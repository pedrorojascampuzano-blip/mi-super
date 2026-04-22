import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';
import { decrypt } from '../lib/crypto.js';
import { getPlugin } from '../integrations/registry.js';

// Exports two routers - mounted at /api/sync and /api/items
export const syncRouter = Router();
export const itemsRouter = Router();

syncRouter.use(requireAuth);
itemsRouter.use(requireAuth);

// POST /api/sync/:service - trigger on-demand sync
syncRouter.post('/:service', asyncHandler(async (req, res) => {
  const { service } = req.params;
  const plugin = getPlugin(service);
  if (!plugin) {
    return res.status(404).json({ error: `Unknown service: ${service}` });
  }

  const sb = getAdminClient();

  // Look up user's account for this service
  const { data: account, error: accErr } = await sb
    .from('accounts')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('provider', service)
    .maybeSingle();

  if (accErr || !account) {
    return res.status(400).json({ error: 'No account connected for this service' });
  }

  // Decrypt credentials
  const credentials = decrypt(
    account.credentials_encrypted,
    account.credentials_iv,
    account.credentials_tag
  );

  // Start sync log entry
  const { data: logEntry } = await sb
    .from('sync_log')
    .insert({
      user_id: req.user.id,
      service,
      status: 'partial',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  let items = [];
  let errors = [];

  try {
    const result = await plugin.sync(credentials, account.last_synced_at);
    items = result.items || [];
    errors = result.errors || [];
  } catch (err) {
    errors.push(err.message);
  }

  // Upsert items to cached_items (conflict on user_id, source, source_id)
  if (items.length > 0) {
    const rows = items.map(item => ({
      user_id: req.user.id,
      source: item.source,
      source_id: item.source_id,
      item_type: item.item_type,
      title: item.title,
      body: item.body,
      metadata: item.metadata || {},
      source_timestamp: item.source_timestamp,
      synced_at: new Date().toISOString(),
    }));

    const { error: upErr } = await sb
      .from('cached_items')
      .upsert(rows, { onConflict: 'user_id,source,source_id' });
    if (upErr) errors.push(`Cache upsert failed: ${upErr.message}`);
  }

  // Extract contacts from synced items
  try {
    await extractContacts(req.user.id, items, sb);
  } catch (err) {
    errors.push(`Contact extraction: ${err.message}`);
  }

  // Update sync log and account
  const status = errors.length === 0 ? 'success' : (items.length > 0 ? 'partial' : 'error');
  if (logEntry) {
    await sb.from('sync_log')
      .update({
        status,
        items_synced: items.length,
        error_message: errors.join('; ') || null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', logEntry.id);
  }

  await sb.from('accounts')
    .update({
      last_synced_at: new Date().toISOString(),
      status: errors.length === 0 ? 'connected' : 'error',
    })
    .eq('id', account.id);

  res.json({ items_synced: items.length, items, errors });
}));

// GET /api/items - query cached items
itemsRouter.get('/', asyncHandler(async (req, res) => {
  const { type, source, q, limit = 50, offset = 0 } = req.query;
  const sb = getAdminClient();

  let query = sb.from('cached_items')
    .select('*', { count: 'exact' })
    .eq('user_id', req.user.id)
    .order('source_timestamp', { ascending: false, nullsFirst: false })
    .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

  if (type) query = query.eq('item_type', type);
  if (source) query = query.eq('source', source);
  if (q) query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  res.json({ items: data || [], total: count || 0 });
}));

// GET /api/items/:id - get a single item
itemsRouter.get('/:id', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { data, error } = await sb.from('cached_items')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Item not found' });
  res.json(data);
}));

// Extract contact info from synced items and upsert to contacts table.
// Two sources:
//   1. Explicit contact items (item_type === 'contact') — from Notion Contacts DB, etc.
//   2. Email/sender metadata on messages — from Gmail, Slack, WhatsApp.
async function extractContacts(userId, items, sb) {
  const byEmail = new Map();
  const byName = new Map(); // for contact-items without email

  function upsertByEmail(email, name, source, timestamp, extra = {}) {
    const key = email.toLowerCase();
    if (!byEmail.has(key)) {
      byEmail.set(key, {
        user_id: userId,
        email: key,
        name: name || key.split('@')[0],
        phone: extra.phone || null,
        sources: [source],
        metadata: extra.metadata || {},
        last_interaction_at: timestamp,
      });
    } else {
      const existing = byEmail.get(key);
      if (!existing.sources.includes(source)) existing.sources.push(source);
      if (timestamp > existing.last_interaction_at) existing.last_interaction_at = timestamp;
      if (name && !existing.name) existing.name = name;
      if (extra.phone && !existing.phone) existing.phone = extra.phone;
    }
  }

  for (const item of items) {
    const md = item.metadata || {};

    // Source 1: explicit contact items (e.g. Notion Contacts DB)
    if (item.item_type === 'contact') {
      const email = md.email || md.correo || null;
      const phone = md.phone || md.phone_number || md.telefono || null;
      const name = item.title || md.name || null;

      if (email && typeof email === 'string') {
        upsertByEmail(email, name, item.source, item.source_timestamp, {
          phone,
          metadata: { notion_page_id: item.source_id, url: md.url },
        });
      } else if (name) {
        // No email — use name as fallback key
        const key = `name:${name.toLowerCase().trim()}`;
        if (!byName.has(key)) {
          byName.set(key, {
            user_id: userId,
            email: `${name.toLowerCase().replace(/\s+/g, '.')}@notion.local`,
            name,
            phone,
            sources: [item.source],
            metadata: { notion_page_id: item.source_id, url: md.url, no_email: true },
            last_interaction_at: item.source_timestamp,
          });
        }
      }
      continue;
    }

    // Source 2: email/sender metadata on message/event items
    const candidates = [md.from, md.to, md.sender, md.recipient].filter(Boolean);
    for (const candidate of candidates) {
      if (typeof candidate !== 'string') continue;
      const emailMatch = candidate.match(/<([^>]+@[^>]+)>/) || candidate.match(/([^\s<>]+@[^\s<>]+)/);
      if (!emailMatch) continue;
      const email = emailMatch[1].toLowerCase();
      if (!email.includes('@')) continue;
      const name = candidate.replace(/<[^>]+>/, '').trim() || email.split('@')[0];
      upsertByEmail(email, name, item.source, item.source_timestamp);
    }
  }

  const allContacts = [...byEmail.values(), ...byName.values()];
  for (const contact of allContacts) {
    await sb.from('contacts').upsert(contact, { onConflict: 'user_id,email' });
  }
}

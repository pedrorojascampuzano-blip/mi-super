import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';
import { encrypt, decrypt } from '../lib/crypto.js';

const router = Router();
router.use(requireAuth);

// List all accounts for the authenticated user
router.get('/', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('accounts')
    .select('id, provider, label, status, last_synced_at, metadata, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  res.json(data);
}));

// Get a single account (with decrypted credentials for server-side use only)
router.get('/:id', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('accounts')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Account not found' });

  // Decrypt credentials
  const credentials = decrypt(data.credentials_encrypted, data.credentials_iv, data.credentials_tag);

  // Mask credentials for display
  const masked = {};
  for (const [key, val] of Object.entries(credentials)) {
    if (typeof val === 'string' && val.length > 8) {
      masked[key] = val.slice(0, 4) + '••••' + val.slice(-4);
    } else {
      masked[key] = '••••';
    }
  }

  res.json({
    id: data.id,
    provider: data.provider,
    label: data.label,
    status: data.status,
    last_synced_at: data.last_synced_at,
    metadata: data.metadata,
    credentials_masked: masked,
  });
}));

// Add a new account
router.post('/', asyncHandler(async (req, res) => {
  const { provider, label, credentials } = req.body;

  if (!provider || !credentials) {
    return res.status(400).json({ error: 'Missing provider or credentials' });
  }

  const { encrypted, iv, tag } = encrypt(credentials);

  const sb = getAdminClient();
  const { data, error } = await sb
    .from('accounts')
    .insert({
      user_id: req.user.id,
      provider,
      label: label || null,
      credentials_encrypted: encrypted,
      credentials_iv: iv,
      credentials_tag: tag,
      status: 'connected',
    })
    .select('id, provider, label, status, created_at')
    .single();

  if (error) throw new Error(error.message);
  res.status(201).json(data);
}));

// Update an account
router.put('/:id', asyncHandler(async (req, res) => {
  const { label, credentials, status } = req.body;
  const update = {};

  if (label !== undefined) update.label = label;
  if (status !== undefined) update.status = status;
  if (credentials) {
    const { encrypted, iv, tag } = encrypt(credentials);
    update.credentials_encrypted = encrypted;
    update.credentials_iv = iv;
    update.credentials_tag = tag;
  }
  update.updated_at = new Date().toISOString();

  const sb = getAdminClient();
  const { data, error } = await sb
    .from('accounts')
    .update(update)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select('id, provider, label, status')
    .single();

  if (error) throw new Error(error.message);
  res.json(data);
}));

// Delete an account
router.delete('/:id', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { error } = await sb
    .from('accounts')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id);

  if (error) throw new Error(error.message);
  res.json({ ok: true });
}));

export default router;

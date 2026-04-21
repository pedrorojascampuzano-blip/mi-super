// Generic action dispatcher for integration plugins
// POST /api/actions/:service/:action
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';
import { decrypt } from '../lib/crypto.js';
import { getPlugin } from '../integrations/registry.js';

const router = Router();
router.use(requireAuth);

router.post('/:service/:action', asyncHandler(async (req, res) => {
  const { service, action } = req.params;

  const plugin = getPlugin(service);
  if (!plugin) return res.status(404).json({ error: `Unknown service: ${service}` });
  if (!plugin.actions?.[action]) {
    return res.status(404).json({ error: `Unknown action: ${action}` });
  }

  // Get user's account for this service
  const sb = getAdminClient();
  const { data: account } = await sb
    .from('accounts')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('provider', service)
    .maybeSingle();

  if (!account) {
    return res.status(400).json({ error: 'No account connected for this service' });
  }

  const credentials = decrypt(
    account.credentials_encrypted,
    account.credentials_iv,
    account.credentials_tag
  );

  // Execute action
  const result = await plugin.actions[action].call(plugin.actions, credentials, req.body);

  // Log to context_log for AI context
  const summary = summarizeAction(service, action, req.body);
  await sb.from('context_log').insert({
    user_id: req.user.id,
    item_type: `${service}_${action}`,
    item_id: req.body.source_id || req.body.issueId || req.body.messageId || null,
    summary,
    metadata: { service, action, params: req.body },
  });

  res.json({ ok: true, result });
}));

function summarizeAction(service, action, params) {
  const serviceLabel = service.charAt(0).toUpperCase() + service.slice(1);
  if (action === 'send' || action === 'sendMessage') {
    const target = params.to || params.channel || 'recipient';
    const preview = (params.text || params.body || '').slice(0, 80);
    return `Sent ${serviceLabel} message to ${target}: "${preview}"`;
  }
  if (action === 'updateStatus') {
    return `Updated ${serviceLabel} ${params.source_id || params.issueId} status to ${params.status}`;
  }
  if (action === 'search') {
    return `Searched ${serviceLabel} for "${params.query}"`;
  }
  return `${action} on ${serviceLabel}`;
}

export default router;

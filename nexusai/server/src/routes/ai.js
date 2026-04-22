// AI routes - chat with workspace-aware context
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';
import { decrypt } from '../lib/crypto.js';
import { chat as aiChat } from '../integrations/ai/provider.js';
import { buildContext } from '../services/context.js';

const router = Router();
router.use(requireAuth);

// GET /api/ai/providers - list AI providers and connection status
router.get('/providers', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { data: accounts } = await sb
    .from('accounts')
    .select('provider, status')
    .eq('user_id', req.user.id)
    .in('provider', ['deepseek', 'gemini', 'mistral']);

  const providers = ['deepseek', 'gemini', 'mistral'].map(name => ({
    name,
    connected: accounts?.some(a => a.provider === name && a.status === 'connected') || false,
  }));

  res.json(providers);
}));

// POST /api/ai/chat - send messages with workspace context
router.post('/chat', asyncHandler(async (req, res) => {
  const { messages, provider } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages required' });
  }

  const sb = getAdminClient();

  // Get all connected AI accounts
  const { data: aiAccounts } = await sb
    .from('accounts')
    .select('*')
    .eq('user_id', req.user.id)
    .in('provider', ['deepseek', 'gemini', 'mistral']);

  if (!aiAccounts?.length) {
    return res.status(400).json({
      error: 'No AI provider connected. Add DeepSeek, Gemini, or Mistral in Accounts.',
    });
  }

  // Decrypt credentials for each provider
  const decryptedAccounts = aiAccounts.map(a => ({
    provider: a.provider,
    credentials: decrypt(a.credentials_encrypted, a.credentials_iv, a.credentials_tag),
  }));

  // Build context from workspace
  const { systemPrompt, contextItems } = await buildContext(req.user.id, messages);

  // Prepend system message
  const enrichedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  // Call AI provider with fallback chain
  const content = await aiChat(decryptedAccounts, enrichedMessages, { provider });

  // Log to context_log for future context
  const userMessage = messages[messages.length - 1]?.content || '';
  await sb.from('context_log').insert({
    user_id: req.user.id,
    item_type: 'ai_chat',
    summary: `Asked AI: "${userMessage.slice(0, 120)}${userMessage.length > 120 ? '...' : ''}"`,
    metadata: {
      provider: provider || 'auto',
      context_item_count: contextItems.length,
    },
  });

  res.json({
    content,
    provider: provider || 'auto',
    contextItems: contextItems.slice(0, 10).map(i => ({
      id: i.id,
      source: i.source,
      title: i.title,
      item_type: i.item_type,
    })),
  });
}));

export default router;

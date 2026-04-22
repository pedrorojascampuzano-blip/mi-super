import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';

const router = Router();
router.use(requireAuth);

// GET /api/contacts - list contacts, optional search query
router.get('/', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { q } = req.query;

  let query = sb.from('contacts')
    .select('*')
    .eq('user_id', req.user.id)
    .order('last_interaction_at', { ascending: false, nullsFirst: false })
    .limit(100);

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  res.json(data || []);
}));

// GET /api/contacts/:id/history - interaction history from cached_items
router.get('/:id/history', asyncHandler(async (req, res) => {
  const sb = getAdminClient();

  const { data: contact } = await sb.from('contacts')
    .select('*')
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single();

  if (!contact) return res.status(404).json({ error: 'Contact not found' });

  // Find cached items mentioning this contact's email
  const { data: items } = await sb.from('cached_items')
    .select('*')
    .eq('user_id', req.user.id)
    .or(`metadata->>from.ilike.%${contact.email}%,metadata->>to.ilike.%${contact.email}%`)
    .order('source_timestamp', { ascending: false })
    .limit(50);

  res.json({ contact, items: items || [] });
}));

export default router;

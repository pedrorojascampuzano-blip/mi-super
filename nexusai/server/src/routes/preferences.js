import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errors.js';
import { getAdminClient } from '../services/supabase.js';

const router = Router();
router.use(requireAuth);

// Get user preferences
router.get('/', asyncHandler(async (req, res) => {
  const sb = getAdminClient();
  const { data, error } = await sb
    .from('user_preferences')
    .select('*')
    .eq('user_id', req.user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  res.json(data || { theme: 'dark', panel_layout: {}, default_ai_provider: 'deepseek' });
}));

// Update user preferences (upsert)
router.put('/', asyncHandler(async (req, res) => {
  const { theme, panel_layout, default_ai_provider } = req.body;
  const update = { user_id: req.user.id, updated_at: new Date().toISOString() };

  if (theme !== undefined) update.theme = theme;
  if (panel_layout !== undefined) update.panel_layout = panel_layout;
  if (default_ai_provider !== undefined) update.default_ai_provider = default_ai_provider;

  const sb = getAdminClient();
  const { data, error } = await sb
    .from('user_preferences')
    .upsert(update, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  res.json(data);
}));

export default router;

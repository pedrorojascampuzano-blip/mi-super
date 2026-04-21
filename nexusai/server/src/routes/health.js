import { Router } from 'express';
import { getAdminClient } from '../services/supabase.js';

const router = Router();

router.get('/', async (_req, res) => {
  const checks = { server: true, supabase: false };

  try {
    const sb = getAdminClient();
    const { error } = await sb.from('accounts').select('id').limit(1);
    checks.supabase = !error;
  } catch {
    checks.supabase = false;
  }

  res.json({
    status: checks.supabase ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default router;

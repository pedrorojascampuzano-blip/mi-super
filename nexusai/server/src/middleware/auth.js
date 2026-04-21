import { getAdminClient } from '../services/supabase.js';
import { seedAccountsForUser } from '../services/bootstrap.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const token = header.slice(7);
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = data.user;
    req.token = token;

    // Await bootstrap so first request always has accounts ready
    try {
      await seedAccountsForUser(data.user);
    } catch (err) {
      console.warn('[bootstrap] seed error:', err.message);
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

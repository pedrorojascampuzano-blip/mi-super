import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Service-role client for server-side operations (bypasses RLS)
let adminClient = null;

export function getAdminClient() {
  if (!adminClient) {
    if (!config.supabaseUrl || !config.supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    }
    adminClient = createClient(config.supabaseUrl, config.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return adminClient;
}

// Create a client scoped to a user's JWT (respects RLS)
export function getUserClient(token) {
  return createClient(config.supabaseUrl, config.supabaseAnonKey || config.supabaseServiceKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

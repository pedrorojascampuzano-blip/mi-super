// Bootstrap seeder - auto-inserts env-configured credentials into the
// accounts table when a user signs in. Used for single-user deployments
// where you don't want to manually enter credentials via the UI.
//
// Only seeds accounts for the user whose email matches BOOTSTRAP_USER_EMAIL.
// Each provider is only seeded once (skipped if already present).

import { config } from '../config.js';
import { getAdminClient } from './supabase.js';
import { encrypt } from '../lib/crypto.js';

// Track which users we've already bootstrapped in this process
const bootstrapped = new Set();

export async function seedAccountsForUser(user) {
  if (!user?.id || !user?.email) return;
  if (bootstrapped.has(user.id)) return;

  // Only bootstrap the configured email (if set). If not set, bootstrap
  // the first user to sign in (useful for dev/single-user setups).
  if (config.bootstrapUserEmail && user.email !== config.bootstrapUserEmail) {
    return;
  }

  bootstrapped.add(user.id);

  const sb = getAdminClient();

  // Get existing accounts for this user so we don't overwrite manual entries
  const { data: existing } = await sb
    .from('accounts')
    .select('provider')
    .eq('user_id', user.id);

  const existingProviders = new Set((existing || []).map(a => a.provider));
  const toSeed = Object.entries(config.bootstrapCredentials || {})
    .filter(([provider, creds]) => creds && !existingProviders.has(provider));

  if (toSeed.length === 0) return;

  const rows = toSeed.map(([provider, credentials]) => {
    const { encrypted, iv, tag } = encrypt(credentials);
    return {
      user_id: user.id,
      provider,
      label: `${provider} (env)`,
      credentials_encrypted: encrypted,
      credentials_iv: iv,
      credentials_tag: tag,
      status: 'connected',
    };
  });

  const { error } = await sb.from('accounts').insert(rows);
  if (error) {
    console.warn(`[bootstrap] Seed failed for ${user.email}: ${error.message}`);
  } else {
    console.log(`[bootstrap] Seeded ${rows.length} accounts for ${user.email}: ${rows.map(r => r.provider).join(', ')}`);
  }
}

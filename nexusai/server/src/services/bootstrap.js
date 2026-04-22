// Bootstrap seeder - auto-inserts env-configured credentials into the
// accounts table when a user signs in. Used for single-user deployments.
//
// - Only seeds for the user matching BOOTSTRAP_USER_EMAIL (or first user if unset)
// - Skips providers where the user already has a manually-entered account (label != "... (env)")
// - Re-encrypts and updates env-labeled accounts if env credentials change shape
//   (e.g., Notion plugin now includes `databases` field)

import { config } from '../config.js';
import { getAdminClient } from './supabase.js';
import { encrypt, decrypt } from '../lib/crypto.js';

const bootstrapped = new Set();

function envLabel(provider, sublabel) {
  return sublabel ? `${sublabel} (env)` : `${provider} (env)`;
}

function shapesEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

// Normalize a provider's bootstrap config into an array of {label, credentials}.
// - Single object → one entry with default label.
// - Array → each entry becomes a separate account; its `label` (minus) field becomes the sublabel,
//   and the `label` field is stripped from the stored credentials.
function normalizeEntries(provider, cfg) {
  if (!cfg) return [];
  if (Array.isArray(cfg)) {
    return cfg.map((entry) => {
      const { label, ...creds } = entry;
      return { label: envLabel(provider, label), credentials: creds };
    });
  }
  return [{ label: envLabel(provider), credentials: cfg }];
}

export async function seedAccountsForUser(user) {
  if (!user?.id || !user?.email) return;
  if (bootstrapped.has(user.id)) return;

  if (config.bootstrapUserEmail && user.email !== config.bootstrapUserEmail) return;

  bootstrapped.add(user.id);

  const sb = getAdminClient();

  // Fetch all existing accounts for this user (with credentials for shape diffing)
  const { data: existing } = await sb
    .from('accounts')
    .select('id, provider, label, credentials_encrypted, credentials_iv, credentials_tag')
    .eq('user_id', user.id);

  const existingByProvider = new Map();
  for (const row of existing || []) {
    if (!existingByProvider.has(row.provider)) existingByProvider.set(row.provider, []);
    existingByProvider.get(row.provider).push(row);
  }

  let inserted = 0;
  let updated = 0;

  for (const [provider, cfg] of Object.entries(config.bootstrapCredentials || {})) {
    const entries = normalizeEntries(provider, cfg);
    if (entries.length === 0) continue;

    const rows = existingByProvider.get(provider) || [];
    const envLabels = new Set(entries.map((e) => e.label));
    const nonEnvRows = rows.filter((r) => !r.label.endsWith(' (env)'));

    // If the user has any manual (non-env) account for this provider and no env-labeled rows
    // yet exist, skip seeding (don't override user's manual setup).
    const hasEnvRows = rows.some((r) => envLabels.has(r.label));
    if (nonEnvRows.length > 0 && !hasEnvRows) continue;

    for (const { label, credentials } of entries) {
      const envRow = rows.find((r) => r.label === label);

      if (!envRow) {
        const { encrypted, iv, tag } = encrypt(credentials);
        const { error } = await sb.from('accounts').insert({
          user_id: user.id,
          provider,
          label,
          credentials_encrypted: encrypted,
          credentials_iv: iv,
          credentials_tag: tag,
          status: 'connected',
        });
        if (error) console.warn(`[bootstrap] insert ${provider}/${label}: ${error.message}`);
        else inserted++;
        continue;
      }

      // Env row exists — check if credentials shape changed
      try {
        const currentCreds = decrypt(
          envRow.credentials_encrypted,
          envRow.credentials_iv,
          envRow.credentials_tag
        );
        if (!shapesEqual(currentCreds, credentials)) {
          const { encrypted, iv, tag } = encrypt(credentials);
          const { error } = await sb.from('accounts')
            .update({
              credentials_encrypted: encrypted,
              credentials_iv: iv,
              credentials_tag: tag,
              status: 'connected',
              updated_at: new Date().toISOString(),
            })
            .eq('id', envRow.id);
          if (error) console.warn(`[bootstrap] update ${provider}/${label}: ${error.message}`);
          else updated++;
        }
      } catch (err) {
        console.warn(`[bootstrap] decrypt failed for ${provider}/${label}: ${err.message}`);
      }
    }
  }

  if (inserted || updated) {
    console.log(`[bootstrap] ${user.email}: ${inserted} inserted, ${updated} updated`);
  }
}

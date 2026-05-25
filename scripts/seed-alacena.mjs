#!/usr/bin/env node
// Seed Pedro's alacena inventory (47 items from voicememo 2026-05-24, Locu memo #576).
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY="<service_role>" GROUP_ID="<uuid>" node scripts/seed-alacena.mjs
//
// Get SERVICE_ROLE_KEY:
//   https://supabase.com/dashboard/project/ffkruigqwgzvqhdxvgjv/settings/api-keys
//
// Get GROUP_ID:
//   open mi-super → settings → copy the group code, then query:
//     curl "https://ffkruigqwgzvqhdxvgjv.supabase.co/rest/v1/groups?code=eq.<CODE>&select=id" \
//          -H "apikey: <ANON_KEY>"
//   or paste in SQL Editor:
//     select id, name, code from groups order by created_at;
//
// Idempotent: re-runs upsert by (group_id, name).

import process from 'node:process';

const SUPABASE_URL = 'https://ffkruigqwgzvqhdxvgjv.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROUP_ID = process.env.GROUP_ID;

if (!SERVICE_KEY || !GROUP_ID) {
  console.error('Missing env: SUPABASE_SERVICE_ROLE_KEY and/or GROUP_ID');
  console.error('See header of this file for instructions.');
  process.exit(1);
}

// 47 items extracted from Locu memo #576 (Pedro voicememo 2026-05-24 11:14).
// Categories use mi-super's existing taxonomy.
const ITEMS = [
  // Aceites
  { name: 'Aceite de aguacate', category: 'Aceites', places: ['Alacena'] },
  { name: 'Aceite de oliva', category: 'Aceites', places: ['Alacena'] },
  { name: 'Aceite de uva', category: 'Aceites', places: ['Alacena'] },
  { name: 'Aceite de trufa', category: 'Aceites', places: ['Alacena'] },
  { name: 'Aceite de ajonjolí tostado', category: 'Aceites', places: ['Alacena'] },
  { name: 'Aceite de coco extra virgen', category: 'Aceites', places: ['Alacena'] },
  // Vinagres
  { name: 'Vinagre balsámico', category: 'Vinagres', places: ['Alacena'] },
  { name: 'Vinagre blanco', category: 'Vinagres', places: ['Alacena'] },
  { name: 'Vinagre de manzana', category: 'Vinagres', places: ['Alacena'] },
  { name: 'Vinagre de arroz', category: 'Vinagres', places: ['Alacena'] },
  // Sazonadores asiáticos
  { name: 'Salsa de soya', category: 'Salsas', places: ['Alacena'] },
  { name: 'Ponzu', category: 'Salsas', places: ['Alacena'] },
  { name: 'Mirin', category: 'Salsas', places: ['Alacena'] },
  { name: 'Salsa teriyaki', category: 'Salsas', places: ['Alacena'] },
  { name: 'Mayonesa Kewpie', category: 'Salsas', places: ['Alacena'] },
  // Sazonadores mexicanos
  { name: 'Salsa botanera', category: 'Salsas', places: ['Alacena'] },
  { name: 'Mermelada de chipotle', category: 'Salsas', places: ['Alacena'] },
  { name: 'Tajín', category: 'Especias', places: ['Alacena'] },
  // Especias / polvos
  { name: 'Pimienta', category: 'Especias', places: ['Alacena'] },
  { name: 'Paprika', category: 'Especias', places: ['Alacena'] },
  { name: 'Sal de mar', category: 'Especias', places: ['Alacena'] },
  { name: 'Consomé en polvo', category: 'Especias', places: ['Alacena'] },
  { name: 'Caldo de tomate en polvo', category: 'Especias', places: ['Alacena'] },
  { name: 'Ajonjolí tostado', category: 'Especias', places: ['Alacena'] },
  // Mieles / endulzantes
  { name: 'Miel de abeja', category: 'Endulzantes', places: ['Alacena'] },
  { name: 'Miel de maple', category: 'Endulzantes', places: ['Alacena'] },
  { name: 'Azúcar mascabada', category: 'Endulzantes', places: ['Alacena'] },
  // Harinas / repostería
  { name: 'Harina normal', category: 'Harinas', places: ['Alacena'] },
  { name: 'Harina de hot cake', category: 'Harinas', places: ['Alacena'] },
  { name: 'Harina de almendra', category: 'Harinas', places: ['Alacena'] },
  { name: 'Maicena', category: 'Harinas', places: ['Alacena'] },
  { name: 'Polvo para hornear (Royal)', category: 'Harinas', places: ['Alacena'] },
  { name: 'Chía', category: 'Granos', places: ['Alacena'] },
  { name: 'Coco rallado', category: 'Repostería', places: ['Alacena'] },
  // Granos / pasta
  { name: 'Arroz', category: 'Granos', places: ['Alacena'] },
  { name: 'Quinoa', category: 'Granos', places: ['Alacena'] },
  { name: 'Mijo', category: 'Granos', places: ['Alacena'] },
  { name: 'Espagueti Del Mar', category: 'Pastas', places: ['Alacena'] },
  { name: 'Pasta para sopa fideo corto', category: 'Pastas', places: ['Alacena'] },
  { name: 'Pasta panini', category: 'Pastas', places: ['Alacena'] },
  { name: 'Café molido', category: 'Bebidas', places: ['Alacena'] },
  // Snacks
  { name: 'Salmas', category: 'Snacks', places: ['Alacena'] },
  { name: 'Pan pita', category: 'Snacks', places: ['Alacena'] },
  { name: 'Pita crisps', category: 'Snacks', places: ['Alacena'] },
  { name: 'Queso para fondue', category: 'Snacks', places: ['Alacena'] },
  // Untables / repostería
  { name: 'Mantequilla de maní', category: 'Untables', places: ['Alacena'] },
  { name: 'Extracto de vainilla', category: 'Repostería', places: ['Alacena'] },
];

console.log(`Seeding ${ITEMS.length} items into group ${GROUP_ID}...`);

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'resolution=merge-duplicates,return=representation',
};

// Idempotent: we delete any existing row with same (group_id, name) first, then insert.
// Supabase upsert requires a unique constraint we don't have, so do it manually.
let inserted = 0;
let updated = 0;
let failed = 0;

for (const it of ITEMS) {
  const existing = await fetch(
    `${SUPABASE_URL}/rest/v1/items?group_id=eq.${GROUP_ID}&name=eq.${encodeURIComponent(it.name)}&select=id`,
    { headers }
  ).then(r => r.json()).catch(() => []);

  const row = {
    group_id: GROUP_ID,
    name: it.name,
    category: it.category,
    places: it.places,
    status: 'stocked',
    is_essential: false,
    qty: '',
    last_bought: new Date().toISOString().slice(0, 10),
  };

  if (existing.length > 0) {
    const id = existing[0].id;
    const r = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${id}`, {
      method: 'PATCH', headers, body: JSON.stringify(row),
    });
    if (r.ok) { updated++; } else { failed++; console.error('UPDATE FAIL', it.name, await r.text()); }
  } else {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/items`, {
      method: 'POST', headers, body: JSON.stringify(row),
    });
    if (r.ok) { inserted++; } else { failed++; console.error('INSERT FAIL', it.name, await r.text()); }
  }
}

console.log(`Done. inserted=${inserted} updated=${updated} failed=${failed} total=${ITEMS.length}`);
process.exit(failed > 0 ? 2 : 0);

#!/usr/bin/env node
// Backfill expiry_type for all items in a group using the same keyword
// heuristic the PWA uses. Idempotent: only patches rows where expiry_type
// is currently null.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY="..." GROUP_ID="..." \
//     node scripts/backfill-expiry-type.mjs
//
// Optional:
//   DRY_RUN=1   prints what would change without patching.

import process from 'node:process';

const SUPABASE_URL = 'https://ffkruigqwgzvqhdxvgjv.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROUP = process.env.GROUP_ID;
const DRY = process.env.DRY_RUN === '1';

if (!KEY || !GROUP) {
  console.error('Need SUPABASE_SERVICE_ROLE_KEY and GROUP_ID');
  process.exit(1);
}

const STRICT_HITS = [
  'leche','yogurt','yoghurt','crema','queso fresco','queso panela','queso oaxaca','queso ricotta','cottage',
  'jamon','jamón','salchich','tocino','chorizo','pollo','carne','pescado','mariscos','camaron','atun fresco',
  'pan ','tortill','baguette','bolillo','muffin','pastel','panque','crepa',
  'mayonesa abierta','aderezo abierto','hummus abierto','pure abierto',
  'huevo','clara liquida',
  'fruta','manzana','platano','pera','sandia','melon','papaya','mango','uva','fresa','arandano','frambuesa',
  'verdura','lechuga','espinaca','jitomate','tomate fresco','cebolla fresca','aguacate','pepino','zanahoria',
  'tofu','tempeh','seitan','leche vegetal','leche de almendra abierta','leche de soya abierta'
];
const BEST_BEFORE_HITS = [
  'especia','sazonador','sal','azucar','mascabad','miel','vinagre','aceite','salsa de soya','soya','ponzu','mirin','teriyaki','salsa botanera','valentina','tajin','chamoy','chipotle','adobo','achiote',
  'pimient','paprika','comino','oregano','laurel','tomillo','romero','clavo','canela','curcuma','nuez moscada','jengibre en polvo','ajo en polvo','cebolla en polvo','furikake','togarashi','everything bagel','consome','caldo','msg','glutamato',
  'harina','maicena','levadura','royal','polvo para hornear','chia','linaza','semilla',
  'arroz','quinoa','mijo','frijol','garbanzo','lenteja','cebada','avena',
  'espagueti','pasta','fideo','panini','noodle',
  'cafe molido','cafe','te ','infusion','chocolate','cocoa',
  'mantequilla de mani','peanut butter','tahini','nutella','crema de cacahuate',
  'mermelada','jam ','jalea','compota',
  'salmas','pita','crisp','tostada','galleta','crackers','salada',
  'salsa de pescado','tiparos','soja','wasabi en polvo'
];

const norm = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

const inferExpiryType = (it) => {
  const t = norm(it.name + ' ' + (it.category || ''));
  for (const k of STRICT_HITS)      if (t.includes(k)) return 'strict';
  for (const k of BEST_BEFORE_HITS) if (t.includes(k)) return 'best_before';
  return null;
};

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

const url = `${SUPABASE_URL}/rest/v1/items?group_id=eq.${GROUP}&expiry_type=is.null&select=id,name,category`;
const resp = await fetch(url, { headers });
if (!resp.ok) { console.error('list err', resp.status, await resp.text()); process.exit(2); }
const items = await resp.json();
console.log(`Items without expiry_type: ${items.length}`);

let strict = 0, soft = 0, skipped = 0, failed = 0;
for (const it of items) {
  const t = inferExpiryType(it);
  if (!t) { skipped++; console.log(`  ? ${it.name} — no match`); continue; }
  if (DRY) {
    console.log(`  [dry] ${it.name} -> ${t}`);
    t === 'strict' ? strict++ : soft++;
    continue;
  }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${it.id}`, {
    method: 'PATCH', headers, body: JSON.stringify({ expiry_type: t }),
  });
  if (r.ok) { t === 'strict' ? strict++ : soft++; console.log(`  ${t === 'strict' ? '🔴' : '🟡'} ${it.name}`); }
  else { failed++; console.error(`  ✗ ${it.name} — ${r.status}`); }
}
console.log(`\nDone. strict=${strict} best_before=${soft} skipped=${skipped} failed=${failed}`);

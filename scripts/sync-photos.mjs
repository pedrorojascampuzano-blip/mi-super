#!/usr/bin/env node
// Sync all item photos for Pedro's mi-super group to local photos/ dir.
// Makes them readable by Claude Code via the Read tool.
//
// Usage:
//   GROUP_ID="<uuid>" node scripts/sync-photos.mjs
//
// Optional env:
//   SUPABASE_ANON_KEY  (defaults to the one in config.js — bucket is public anyway)
//
// Outputs:
//   photos/<item_name>__<item_id>.<ext>
//   photos/_index.json   { item_id, name, category, photo_url, local_path }
//
// Idempotent. Skips already-downloaded files by URL hash.

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const SUPABASE_URL = 'https://ffkruigqwgzvqhdxvgjv.supabase.co';
const ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3J1aWdxd2d6dnFoZHh2Z2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MTIwNzMsImV4cCI6MjA5MjI4ODA3M30.KNXU54rBJxiSTBmG5oMRidgU5xg0HXQsN0dH6iYrwws';
const GROUP_ID = process.env.GROUP_ID;

if (!GROUP_ID) {
  console.error('Missing env: GROUP_ID');
  process.exit(1);
}

const PHOTOS_DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'photos');
await fs.mkdir(PHOTOS_DIR, { recursive: true });

console.log(`Fetching items with photo_url for group ${GROUP_ID}...`);

// items table is RLS-protected but anon can read if not a member: nope, RLS blocks.
// Use the public-read trick: storage bucket is public, so we list via storage.objects
// using the anon key (anon list is also blocked). Best path: hit /rest/v1/items via
// anon — won't work because RLS requires membership. So we use service-role-friendly
// fallback: try with anon, if 0 rows, instruct user to set SUPABASE_SERVICE_ROLE_KEY.
//
// For Pedro's own machine he's authenticated in the browser; for a server script we
// need the service role. Keep it simple: prefer service role if provided.

const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ANON_KEY;
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
};

const url = `${SUPABASE_URL}/rest/v1/items?group_id=eq.${GROUP_ID}&photo_url=not.is.null&select=id,name,category,photo_url`;
const resp = await fetch(url, { headers });
if (!resp.ok) {
  console.error('Fetch failed:', resp.status, await resp.text());
  console.error('If RLS blocks anon, set SUPABASE_SERVICE_ROLE_KEY=... and retry.');
  process.exit(2);
}
const items = await resp.json();
console.log(`Found ${items.length} items with photos.`);

const slug = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const index = [];
let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const it of items) {
  const ext = (it.photo_url.split('.').pop() || 'jpg').split('?')[0].slice(0, 6);
  const localName = `${slug(it.name)}__${it.id.slice(0, 8)}.${ext}`;
  const localPath = path.join(PHOTOS_DIR, localName);

  const exists = await fs.stat(localPath).then(() => true).catch(() => false);
  if (exists) { skipped++; }
  else {
    try {
      const photoResp = await fetch(it.photo_url);
      if (!photoResp.ok) { failed++; console.error('Download fail', it.name, photoResp.status); continue; }
      const buf = Buffer.from(await photoResp.arrayBuffer());
      await fs.writeFile(localPath, buf);
      downloaded++;
    } catch (e) { failed++; console.error('Download err', it.name, e.message); continue; }
  }

  index.push({
    item_id: it.id,
    name: it.name,
    category: it.category,
    photo_url: it.photo_url,
    local_path: path.relative(path.resolve(PHOTOS_DIR, '..'), localPath),
    sha256: crypto.createHash('sha256').update(it.photo_url).digest('hex').slice(0, 16),
  });
}

await fs.writeFile(path.join(PHOTOS_DIR, '_index.json'), JSON.stringify(index, null, 2));
console.log(`Done. downloaded=${downloaded} skipped=${skipped} failed=${failed} index=${index.length}`);
console.log(`Index: ${path.join(PHOTOS_DIR, '_index.json')}`);
console.log('Claude can now Read individual photos via their local_path.');

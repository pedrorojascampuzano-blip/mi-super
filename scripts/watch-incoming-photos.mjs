#!/usr/bin/env node
// Watcher: poll Supabase every 5s for items with a photo but no real name,
// then call Claude vision (haiku-4-5) to identify and patch the row.
//
// Usage:
//   ANTHROPIC_API_KEY=sk-ant-... \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   GROUP_ID=<uuid> \
//   node scripts/watch-incoming-photos.mjs
//
// Optional:
//   POLL_MS=5000             interval between polls
//   MODEL=claude-haiku-4-5   anthropic model id
//
// This is the "Claude Code in terminal identifies photos" path. Keep it
// running in a terminal tab; new photos added from the PWA get filled.

import process from 'node:process';

const SUPABASE_URL = 'https://ffkruigqwgzvqhdxvgjv.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROUP_ID = process.env.GROUP_ID;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const POLL_MS = Number(process.env.POLL_MS || 5000);
const MODEL = process.env.MODEL || 'claude-haiku-4-5';

if (!SERVICE_KEY || !GROUP_ID || !ANTHROPIC_KEY) {
  console.error('Missing env: need SUPABASE_SERVICE_ROLE_KEY, GROUP_ID, ANTHROPIC_API_KEY');
  process.exit(1);
}

const PLACEHOLDER_NAMES = new Set(['Identificando…', 'Identificando...', 'Sin identificar — toca para editar', 'Sin identificar - toca para editar']);

const sbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

const PROMPT = `Identifica el producto en la foto y devuelve JSON exactamente con este schema:
{
  "name": "Nombre corto del producto en español, sin marca a menos que sea distintiva",
  "category": "UNO de: Alimentos | Medicamentos | Limpieza | Hogar | Mascotas | Otros",
  "unit_count": null o número entero,
  "unit_size": null o número,
  "unit_type": null o UNO de: g | kg | mg | oz | lb | ml | l | oz_fl | pz | pkg | bolsa | lata | caja | botella
}
Si no estás seguro de un campo, usa null. Responde SOLO el JSON.`;

const VALID_CATS = ['Alimentos','Medicamentos','Limpieza','Hogar','Mascotas','Otros'];
const VALID_UNITS = ['g','kg','mg','oz','lb','ml','l','oz_fl','pz','pkg','bolsa','lata','caja','botella'];

async function urlToBase64(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`download ${resp.status}`);
  const mime = resp.headers.get('content-type') || 'image/jpeg';
  const buf = Buffer.from(await resp.arrayBuffer());
  return { mime, data: buf.toString('base64') };
}

async function identifyWithClaude(photoUrl) {
  const img = await urlToBase64(photoUrl);
  const body = {
    model: MODEL,
    max_tokens: 1024,
    system: 'Eres un asistente de inventario experto. Responde SOLO con JSON válido. Sin markdown.',
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: img.mime, data: img.data } },
        { type: 'text', text: PROMPT },
      ],
    }],
  };
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`anthropic ${resp.status} ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  const text = data.content?.[0]?.text || '';
  const cleaned = text.replace(/^```json\n?|\n?```$/g, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    name: parsed.name?.trim() || 'Sin identificar',
    category: VALID_CATS.includes(parsed.category) ? parsed.category : 'Otros',
    unit_count: Number.isFinite(parsed.unit_count) ? Math.round(parsed.unit_count) : null,
    unit_size:  Number.isFinite(parsed.unit_size)  ? Number(parsed.unit_size)     : null,
    unit_type:  VALID_UNITS.includes(parsed.unit_type) ? parsed.unit_type         : null,
  };
}

async function findPending() {
  const filter = encodeURIComponent('in.("Identificando…","Identificando...","Sin identificar — toca para editar","Sin identificar - toca para editar")');
  const url = `${SUPABASE_URL}/rest/v1/items?group_id=eq.${GROUP_ID}&photo_url=not.is.null&name=${filter}&select=id,name,photo_url`;
  const resp = await fetch(url, { headers: sbHeaders });
  if (!resp.ok) { console.error('list err', resp.status, await resp.text()); return []; }
  return await resp.json();
}

async function patchItem(id, fields) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/items?id=eq.${id}`, {
    method: 'PATCH', headers: sbHeaders, body: JSON.stringify(fields),
  });
  if (!resp.ok) throw new Error(`patch ${resp.status} ${(await resp.text()).slice(0, 200)}`);
}

console.log(`Watching group ${GROUP_ID} every ${POLL_MS}ms with ${MODEL}. Ctrl+C to stop.`);

let consecutiveEmpty = 0;
while (true) {
  try {
    const pending = await findPending();
    if (pending.length === 0) {
      consecutiveEmpty++;
      if (consecutiveEmpty % 12 === 0) console.log(`[idle] ${new Date().toISOString().slice(11,19)} no pending`);
    } else {
      consecutiveEmpty = 0;
      console.log(`[${new Date().toISOString().slice(11,19)}] ${pending.length} pending`);
      for (const it of pending) {
        try {
          const fields = await identifyWithClaude(it.photo_url);
          await patchItem(it.id, fields);
          console.log(`  ✓ ${it.id.slice(0,8)} -> ${fields.name} (${fields.category}${fields.unit_count ? `, ${fields.unit_count}×${fields.unit_size} ${fields.unit_type}` : ''})`);
        } catch (e) {
          console.error(`  ✗ ${it.id.slice(0,8)} ${e.message}`);
        }
      }
    }
  } catch (e) {
    console.error('poll err', e.message);
  }
  await new Promise(r => setTimeout(r, POLL_MS));
}

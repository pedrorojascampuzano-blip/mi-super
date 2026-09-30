// Cuenta controles tocables en la mitad de arriba y la de abajo de la pantalla, por vista y tamaño de iPhone.
// Excluye las filas de la lista ([data-item]) y el contenido de Rendimientos, que se desplazan con el dedo.
// Uso: node design/reach.mjs <raiz-de-la-app> <salida>
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [root, out] = process.argv.slice(2);
const items = JSON.parse(await fs.readFile(new URL('../tests/fixtures/items.json', import.meta.url), 'utf8'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = http.createServer(async (req, res) => {
    try {
        let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        if (p.endsWith('/')) p += 'index.html';
        const body = await fs.readFile(path.join(root, p));
        res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(body);
    } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/`;
const SIZES = { '390x844': { width: 390, height: 844, safe: { top: 47, bottom: 34 } }, '430x932': { width: 430, height: 932, safe: { top: 59, bottom: 34 } } };
const VIEWS = {
    'Lista': () => __ms.setTab('shop'),
    'Casa': () => __ms.setTab('inv'),
    'Historial': () => __ms.setTab('hist'),
    'Rendimientos': () => { __ms.setTab('hist'); __ms.setHistView('rend'); },
    'hoja Más': () => { __ms.setTab('shop'); __ms.setModal('more'); },
    'hoja Ver y ordenar (Lista)': () => { __ms.setTab('shop'); __ms.setModal('filters'); },
    'hoja Ver y ordenar (Casa)': () => { __ms.setTab('inv'); __ms.setModal('filters'); },
    'hoja Agregar': () => { __ms.setTab('shop'); __ms.setAddOpen(true); },
};

export const count = (page) => page.evaluate(() => {
    const H = innerHeight;
    const sheet = document.querySelector('.ms-overlay .ms-sheet');
    const scope = sheet || document.getElementById('root');
    const shown = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('.hidden') && r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H; };
    const els = new Set();
    for (const el of scope.querySelectorAll('button,input:not([type=file]),select,textarea,label:has(input[type=file])')) {
        if (!shown(el) || el.closest('[data-item],[data-testid="rendimientos"]')) continue;
        els.add(el.closest('label:has(input[type=file])') || el);
    }
    const top = [], bottom = [];
    for (const el of els) {
        const r = el.getBoundingClientRect();
        const name = (el.getAttribute('aria-label') || el.placeholder || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 24);
        ((r.top + r.height / 2) < H / 2 ? top : bottom).push(name);
    }
    return { arriba: top.length, abajo: bottom.length, controlesArriba: top };
});

const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'] });
const results = {};
if (out) await fs.mkdir(out, { recursive: true });
for (const [sz, s] of Object.entries(SIZES)) {
    for (const [view, fn] of Object.entries(VIEWS)) {
        const page = await browser.newPage();
        await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        await (await page.createCDPSession()).send('Emulation.setSafeAreaInsetsOverride', { insets: { left: 0, right: 0, ...s.safe } });
        await page.setRequestInterception(true);
        page.on('request', (r) => (r.url().includes('.supabase.co') && !r.url().includes('supabase-js')) ? r.abort() : r.continue());
        await page.evaluateOnNewDocument((items) => { window.__MS_TEST__ = true; localStorage.clear(); localStorage.setItem('onboarded_v1', '1'); localStorage.setItem('data_v4', JSON.stringify(items)); }, items);
        await page.goto(base, { waitUntil: 'networkidle0' });
        await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
        await page.evaluate(fn); await new Promise((r) => setTimeout(r, 300));
        results[`${view} · ${sz}`] = await count(page);
        if (out) {
            await page.evaluate(() => { const o = document.createElement('div'); o.style.cssText = 'position:fixed;left:0;right:0;top:0;height:50vh;background:rgba(0,0,0,.18);border-bottom:2px solid #d33;pointer-events:none;z-index:9999'; document.body.appendChild(o); });
            await page.screenshot({ path: path.join(out, `${sz}-${view.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.jpg`), quality: 82, type: 'jpeg' });
        }
        await page.close();
    }
}
await browser.close(); srv.close();
if (out) await fs.writeFile(path.join(out, 'reach.json'), JSON.stringify(results, null, 1));
for (const [k, v] of Object.entries(results)) console.log(`${k.padEnd(36)} arriba ${v.arriba} · abajo ${v.abajo}${v.arriba ? '  ← ' + v.controlesArriba.join(', ') : ''}`);

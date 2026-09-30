// Mide pantallas reales de la app en tamaños de iPhone: elementos visibles, acciones fuera de la zona
// del pulgar y capturas. Uso: node design/measure.mjs <raiz-de-la-app> <etiqueta> <salida> [query...]
// Cada query es una variante (?nav=a, ?dir=fresco, ...). Nunca toca Supabase.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [root, label, out, ...queries] = process.argv.slice(2);
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

export const SIZES = { '390x844': { width: 390, height: 844, safe: { top: 47, bottom: 34 } }, '430x932': { width: 430, height: 932, safe: { top: 59, bottom: 34 } } };
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox'], protocolTimeout: 60000 });

// Acciones principales: selector de lo que se toca para cada una (el primero que exista y se vea).
const ACTIONS = {
    'agregar': ['[data-composer] input', '[aria-label="Agregar"].ms-navadd', '[data-act="add"]', 'header .ms-add input'],
    'dictar': ['[aria-label="Dictar"]', '[data-act="dictate"]'],
    'leer ticket': ['[aria-label="Leer ticket"]', '[data-act="ticket"]'],
    'ir a Casa': ['[data-tab="inv"]'],
    'ir a Historial': ['[data-tab="hist"]'],
    'finalizar compra': ['[data-dock] .ms-btn-accent', '[data-act="checkout"]'],
    'buscar': ['input[aria-label="Buscar"]', '[data-act="search"]'],
    'ajustes': ['[aria-label="Ajustes"]', '[aria-label="Más"]'],
};

const measure = (page) => page.evaluate((ACTIONS) => {
    const H = innerHeight, W = innerWidth;
    const top = document.querySelector('.ms-overlay .ms-sheet') || document.getElementById('root');
    const inView = (r) => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
    const shown = (el) => { const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('.hidden'); };
    const controls = [...top.querySelectorAll('button,input:not([type=file]),select,textarea,label:has(input[type=file])')]
        .filter((el) => shown(el) && inView(el.getBoundingClientRect()));
    const uniq = new Set();
    for (const el of controls) { const l = el.closest('label:has(input[type=file])'); uniq.add(l || el); }
    const walker = document.createTreeWalker(top, NodeFilter.SHOW_TEXT);
    let texts = 0; const seen = new Set();
    while (walker.nextNode()) {
        const n = walker.currentNode; if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (!shown(el) || seen.has(el)) continue;
        const range = document.createRange(); range.selectNodeContents(n);
        if (![...range.getClientRects()].some(inView)) continue;
        seen.add(el); texts++;
    }
    const rows = [...document.querySelectorAll('[data-item]')].filter((el) => inView(el.getBoundingClientRect())).length;
    const chrome = [...uniq].filter((el) => !el.closest('[data-item]')).length;
    const rowCtl = [...uniq].filter((el) => el.closest('[data-item]')).length;
    const chromeText = [...seen].filter((el) => !el.closest('[data-item]')).length;
    const acts = {};
    for (const [name, sels] of Object.entries(ACTIONS)) {
        let hit = null;
        for (const s of sels) { hit = [...document.querySelectorAll(s)].find((el) => shown(el) && el.getBoundingClientRect().width > 0); if (hit) break; }
        if (!hit) { acts[name] = null; continue; }
        const r = hit.getBoundingClientRect(); const y = (r.top + r.height / 2) / H;
        acts[name] = { y: Math.round(y * 100), zona: y >= 0.5 ? 'pulgar' : y >= 0.25 ? 'estirar' : 'difícil' };
    }
    return { controles: uniq.size, textos: texts, filas: rows, cromo: chrome, cromoTextos: chromeText, porFila: rows ? +(rowCtl / rows).toFixed(1) : 0, acciones: acts };
}, ACTIONS);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = {};
await fs.mkdir(out, { recursive: true });
for (const q of queries.length ? queries : ['']) {
    for (const [sizeName, s] of Object.entries(SIZES)) {
        const page = await browser.newPage();
        await page.setUserAgent(UA);
        await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
        await (await page.createCDPSession()).send('Emulation.setSafeAreaInsetsOverride', { insets: { left: 0, right: 0, ...s.safe } });
        await page.setRequestInterception(true);
        page.on('request', (r) => (r.url().includes('.supabase.co') && !r.url().includes('supabase-js')) ? r.abort() : r.continue());
        await page.evaluateOnNewDocument((items) => {
            window.__MS_TEST__ = true;
            if (sessionStorage.getItem('__seeded')) return;
            sessionStorage.setItem('__seeded', '1');
            localStorage.clear();
            localStorage.setItem('onboarded_v1', '1');
            localStorage.setItem('data_v4', JSON.stringify(items));
        }, items);
        await page.goto(base + (q ? `?${q}` : ''), { waitUntil: 'networkidle0' });
        await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0);
        await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
        const key = `${q || 'default'} · ${sizeName}`;
        results[key] = {};
        const snap = async (screen) => {
            await wait(350);
            results[key][screen] = await measure(page);
            await page.screenshot({ path: path.join(out, `${(q || 'default').replace(/[^a-z0-9]+/gi, '-')}-${sizeName}-${screen}.png`) });
        };
        await page.evaluate(() => __ms.setTab('shop')); await snap('lista');
        // Agregar: lo que Pedro toca primero para escribir un producto
        const opened = await page.evaluate(() => {
            const b = document.querySelector('[aria-label="Agregar"].ms-navadd, [data-act="add"]');
            if (b) { b.click(); return 'sheet'; }
            const i = document.querySelector('[data-composer] input, header .ms-add input'); i?.focus(); return 'inline';
        });
        await wait(300);
        await page.keyboard.type('Tortillas');
        await snap('agregar');
        for (let k = 0; k < 9; k++) await page.keyboard.press('Backspace');
        await page.evaluate(() => { __ms.setAddOpen?.(false); document.activeElement?.blur(); });
        await page.evaluate(() => __ms.setTab('inv')); await snap('casa');
        await page.evaluate(() => __ms.setTab('hist')); await snap('historial');
        await page.close();
    }
}
await fs.writeFile(path.join(out, `${label}.json`), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 1).slice(0, 200000));
await browser.close(); srv.close();

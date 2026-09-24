import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css' };

export const startServer = () => new Promise((resolve) => {
    const srv = http.createServer(async (req, res) => {
        try {
            let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
            if (p.endsWith('/')) p += 'index.html';
            const file = path.join(ROOT, p);
            if (!file.startsWith(ROOT)) throw new Error('out of root');
            const body = await fs.readFile(file);
            res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
            res.end(body);
        } catch {
            res.writeHead(404); res.end();
        }
    });
    srv.listen(0, '127.0.0.1', () => resolve({ srv, url: `http://127.0.0.1:${srv.address().port}/` }));
});

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const IPHONE = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

export const launch = () => puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });

// Abre la app en emulación iPhone con los datos dados en localStorage (modo local).
// Nunca toca Supabase: cualquier request a *.supabase.co se aborta.
export const openApp = async (browser, url, { items = [], extra = {} } = {}) => {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport(IPHONE);
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().includes('.supabase.co') && !r.url().includes('supabase-js')) ? r.abort() : r.continue());
    await page.evaluateOnNewDocument((items, extra) => {
        if (sessionStorage.getItem('__seeded')) return;
        sessionStorage.setItem('__seeded', '1');
        localStorage.clear();
        localStorage.setItem('onboarded_v1', '1');
        localStorage.setItem('data_v4', JSON.stringify(items));
        for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
    }, items, extra);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0, { timeout: 20000 });
    return { page, errors };
};

// Simula lo que hace iOS al abrir el teclado o mostrar la barra de Safari:
// el layout viewport no cambia, pero visualViewport se encoge.
export const setVisualViewport = (page, height) => page.evaluate((h) => {
    const vv = window.visualViewport;
    Object.defineProperty(vv, 'height', { configurable: true, get: () => h });
    Object.defineProperty(vv, 'offsetTop', { configurable: true, get: () => 0 });
    vv.dispatchEvent(new Event('resize'));
}, height);

// Baja el scroll de la lista hasta el fondo y reporta si el último elemento
// queda visible: sin taparse por barras flotantes ni por el borde visible.
export const lastItemReachable = (page, visibleHeight = IPHONE.height) => page.evaluate(async (visibleHeight) => {
    const sc = document.querySelector('[data-testid="scroll"]') || document.querySelector('.flex-1.overflow-y-auto');
    sc.scrollTop = sc.scrollHeight;
    await new Promise((r) => setTimeout(r, 400));
    const last = sc.lastElementChild;
    const lr = last.getBoundingClientRect();
    const floats = [...document.querySelectorAll('[data-floating], .absolute.bottom-4')].map((f) => f.getBoundingClientRect().top);
    const limit = Math.min(visibleHeight, ...floats);
    return { lastBottom: Math.round(lr.bottom), limit: Math.round(limit), ok: lr.bottom <= limit + 1 };
}, visibleHeight);

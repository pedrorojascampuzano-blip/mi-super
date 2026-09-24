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
export const openApp = async (browser, url, { items = [], extra = {}, safeArea = null } = {}) => {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.setViewport(IPHONE);
    // safeArea = { top: 47, bottom: 34 } emula la app instalada en un iPhone con Dynamic Island.
    if (safeArea) await (await page.createCDPSession()).send('Emulation.setSafeAreaInsetsOverride', { insets: { left: 0, right: 0, ...safeArea } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().includes('.supabase.co') && !r.url().includes('supabase-js')) ? r.abort() : r.continue());
    await page.evaluateOnNewDocument((items, extra) => {
        window.__MS_TEST__ = true;
        window.alert = (m) => console.log('[alert] ' + m);
        window.confirm = () => true;
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

// Auditoría genérica de una vista. Devuelve una lista de problemas legibles:
//  - cortado:    el último elemento de una zona con scroll no cabe en lo visible al llegar al fondo
//  - tapado:     algo (barra, toast, overlay) está encima del último elemento o de un control
//  - fuera:      un control de la capa activa no se puede alcanzar dentro de la pantalla visible
//  - horizontal: algo se sale a lo ancho
export const audit = (page, vh) => page.evaluate(async (vh) => {
    const W = window.innerWidth;
    const describe = (el) => {
        if (!el) return 'nada';
        const t = (el.getAttribute('aria-label') || el.textContent || el.placeholder || '').trim().replace(/\s+/g, ' ').slice(0, 30);
        return `${el.tagName.toLowerCase()}${t ? ` "${t}"` : ''}`;
    };
    const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.opacity !== '0'; };
    const root = document.getElementById('root');
    // Capa activa: el overlay de pantalla completa más arriba, o la app.
    const overlays = [...root.querySelectorAll('*')].filter((el) => {
        const cs = getComputedStyle(el); if (!['absolute', 'fixed'].includes(cs.position)) return false;
        const r = el.getBoundingClientRect(); return r.width >= W * 0.95 && r.height >= Math.min(vh, innerHeight) * 0.9 && visible(el);
    });
    overlays.sort((a, b) => (parseInt(getComputedStyle(a).zIndex) || 0) - (parseInt(getComputedStyle(b).zIndex) || 0));
    const layer = overlays.length ? overlays[overlays.length - 1] : root;
    const issues = [];
    const covered = (el, x, y) => {
        if (y < 0 || y > vh || x < 0 || x > W) return 'fuera de pantalla';
        const hit = document.elementFromPoint(x, y);
        if (!hit || el.contains(hit) || hit.contains(el) && hit === el) return null;
        if (el.tagName === 'LABEL' && hit.closest('label') === el) return null;
        return describe(hit.closest('button,[data-floating],div') || hit);
    };
    const scrollers = [...layer.querySelectorAll('*'), layer].filter((el) => {
        const cs = getComputedStyle(el);
        return ['auto', 'scroll'].includes(cs.overflowY) && el.scrollHeight > el.clientHeight + 2 && visible(el) && el.getBoundingClientRect().width > W * 0.5;
    });
    for (const sc of scrollers) sc.scrollTop = sc.scrollHeight;
    await new Promise((r) => setTimeout(r, 350));
    for (const sc of scrollers) {
        const kids = [...sc.children].filter(visible);
        const last = kids[kids.length - 1];
        if (!last) continue;
        const lr = last.getBoundingClientRect();
        const bottom = Math.min(sc.getBoundingClientRect().bottom, vh);
        if (lr.bottom > bottom + 1) { issues.push(`cortado: último de la zona con scroll (${describe(last)}) llega a ${Math.round(lr.bottom)}px y lo visible acaba en ${Math.round(bottom)}px`); continue; }
        const by = covered(last, lr.left + lr.width / 2, lr.bottom - 6) || covered(last, lr.left + 12, lr.bottom - 6);
        if (by) issues.push(`tapado: último de la lista (${describe(last)}) queda bajo ${by}`);
    }
    const controls = [...layer.querySelectorAll('button,input:not([type=file]):not(.hidden),select,textarea,label')].filter(visible).filter((el) => !el.closest('.hidden'));
    for (const el of controls) {
        el.scrollIntoView({ block: 'center', inline: 'nearest' });
        const r = el.getBoundingClientRect();
        // contenedores con overflow hidden que se movieron = el control solo se alcanza "por trampa"
        let a = el.parentElement, cheat = false;
        while (a && a !== document.body) { if (getComputedStyle(a).overflowY === 'hidden' && a.scrollTop > 0) { cheat = true; a.scrollTop = 0; } a = a.parentElement; }
        if (cheat || r.bottom > vh + 1 || r.top < -1) { issues.push(`fuera: ${describe(el)} no se alcanza (top ${Math.round(r.top)}, bottom ${Math.round(r.bottom)}, visible ${vh})`); continue; }
        const inHScroll = el.closest('.overflow-x-auto,[data-hscroll]');
        if (!inHScroll && r.right > W + 1) issues.push(`horizontal: ${describe(el)} se sale a ${Math.round(r.right)}px`);
        const by = covered(el, r.left + r.width / 2, r.top + r.height / 2);
        if (by && !inHScroll) issues.push(`tapado: ${describe(el)} queda bajo ${by}`);
    }
    if (document.scrollingElement.scrollWidth > W + 1) issues.push(`horizontal: la página mide ${document.scrollingElement.scrollWidth}px de ancho`);
    return [...new Set(issues)];
}, vh);

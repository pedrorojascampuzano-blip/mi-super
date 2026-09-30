// Navegación única v27 (Claro): barra abajo con Lista / Casa / Historial y el + del lado del pulgar.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, setVisualViewport, IPHONE } from './helpers.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const hasNav = (page) => page.evaluate(() => !!document.querySelector('.ms-bottomnav'));

test('hay una sola navegación y los parámetros viejos (?nav, ?dir) no la cambian', async () => {
    for (const q of ['', '?nav=a', '?nav=b', '?dir=mercado']) {
        const { page } = await openApp(browser, server.url + q, { items });
        const r = await page.evaluate(() => ({ navs: document.querySelectorAll('.ms-bottomnav').length, tabs: [...document.querySelectorAll('[data-tab]')].map((b) => b.dataset.tab), composer: !!document.querySelector('[data-composer]') }));
        assert.deepEqual(r, { navs: 1, tabs: ['shop', 'inv', 'hist'], composer: false }, q);
        await page.close();
    }
});

test('la barra cambia de sección y el título lo dice', async () => {
    const { page } = await openApp(browser, server.url, { items });
    const title = () => page.evaluate(() => document.querySelector('.ms-stitle').textContent);
    assert.equal(await title(), 'Lista');
    await page.click('.ms-bottomnav [data-tab="inv"]');
    assert.equal(await title(), 'Casa');
    await page.click('.ms-bottomnav [data-tab="hist"]');
    assert.equal(await title(), 'Historial');
    await page.close();
});

test('+ agrega varios seguidos sin cerrar la hoja', async () => {
    const { page } = await openApp(browser, server.url, { items: [] });
    await page.click('.ms-bottomnav [aria-label="Agregar"]');
    await page.waitForSelector('[data-testid="add"] input');
    await page.type('[data-testid="add"] input', 'Tortillas'); await page.keyboard.press('Enter');
    await page.type('[data-testid="add"] input', 'Huevo'); await page.keyboard.press('Enter');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')).map((i) => [i.name, i.status]));
    assert.deepEqual(saved, [['Tortillas', 'needed'], ['Huevo', 'needed']]);
    assert.match(await page.evaluate(() => document.querySelector('[data-testid="add"]').textContent), /Agregado: Tortillas, Huevo/);
    await page.close();
});

test('la barra se esconde con el teclado abierto', async () => {
    const { page } = await openApp(browser, server.url, { items });
    assert.equal(await hasNav(page), true);
    await setVisualViewport(page, 508);
    await new Promise((r) => setTimeout(r, 200));
    assert.equal(await hasNav(page), false);
    await page.close();
});

// Criterio de la v27: en 390x844 todas las acciones principales quedan en la mitad de abajo de la pantalla.
test('acciones principales dentro de la zona del pulgar (390x844)', async () => {
    const { page } = await openApp(browser, server.url, { items, safeArea: { top: 47, bottom: 34 } });
    const center = (sel) => page.evaluate((sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return r.top + r.height / 2; }, sel);
    const H = IPHONE.height;
    const checks = {
        'agregar (+)': '.ms-bottomnav [aria-label="Agregar"]',
        'ir a Casa': '.ms-bottomnav [data-tab="inv"]',
        'ir a Historial': '.ms-bottomnav [data-tab="hist"]',
        'finalizar compra': '[data-act="checkout"]',
    };
    for (const [name, sel] of Object.entries(checks)) {
        const y = await center(sel);
        assert.ok(y !== null && y >= H / 2, `${name}: y=${y}`);
    }
    await page.click('.ms-bottomnav [aria-label="Agregar"]');
    await page.waitForSelector('[data-testid="add"] input');
    for (const label of ['Dictar', 'Leer ticket']) {
        const y = await page.evaluate((l) => { const el = [...document.querySelectorAll('[data-testid="add"] button, [data-testid="add"] label')].find((b) => b.textContent.trim() === l); const r = el.getBoundingClientRect(); return r.top + r.height / 2; }, label);
        assert.ok(y >= H / 2, `${label} en la hoja de agregar: y=${y}`);
    }
    await page.close();
});

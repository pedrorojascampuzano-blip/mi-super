import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, audit } from './helpers.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const clickTab = (page, t) => page.click(`[data-tab="${{ Lista: 'shop', Casa: 'inv', Historial: 'hist' }[t]}"]`);

test('Editar y Borrar de cada fila miden al menos 36x40 px', async () => {
    const { page } = await openApp(browser, server.url, { items });
    for (const t of ['Lista', 'Casa']) {
        await clickTab(page, t);
        const sizes = await page.evaluate(() => [...document.querySelectorAll('[aria-label="Editar"],[aria-label="Borrar"]')].map((b) => { const r = b.getBoundingClientRect(); return [r.width, r.height]; }));
        assert.ok(sizes.length > 0, t);
        for (const [w, h] of sizes) assert.ok(w >= 36 && h >= 40, `${t}: ${w}x${h}`);
    }
    await page.close();
});

test('Enter en "¿Qué falta?" agrega el item a la lista y se guarda en data_v4', async () => {
    const { page } = await openApp(browser, server.url, { items: [] });
    await page.type('input[placeholder="¿Qué falta?"]', 'Tortillas');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('[data-testid="scroll"]').textContent.includes('Tortillas'));
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')));
    assert.equal(saved.length, 1);
    assert.equal(saved[0].name, 'Tortillas');
    assert.equal(saved[0].status, 'needed');
    await page.close();
});

test('Lista vacía muestra una indicación útil', async () => {
    const { page } = await openApp(browser, server.url, { items: [] });
    const txt = await page.evaluate(() => document.querySelector('[data-testid="scroll"]').textContent);
    assert.match(txt, /Tu lista está vacía/);
    await page.close();
});

test('Los datos existentes en data_v4 se cargan intactos (sin migración)', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await clickTab(page, 'Casa');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')));
    assert.deepEqual(saved, items);
    await page.close();
});

test('Compartir lista manda el texto por navigator.share', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.evaluate(() => { window.__shared = null; navigator.share = async (d) => { window.__shared = d.text; }; });
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Compartir lista')).click());
    await page.waitForFunction(() => window.__shared);
    const txt = await page.evaluate(() => window.__shared);
    assert.match(txt, /^Lista del súper\n/);
    const pending = items.filter((i) => i.status === 'needed' || i.status === 'cart');
    for (const i of pending) assert.ok(txt.includes(i.name), i.name);
    await page.close();
});

test('Lista agrupada muestra encabezados por categoría', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.click('[aria-label="Agrupar por categoría"]');
    const heads = await page.evaluate(() => [...document.querySelectorAll('.ms-group')].map((h) => h.textContent));
    const cats = new Set(items.filter((i) => i.status === 'needed' || i.status === 'cart').map((i) => i.category));
    assert.equal(heads.length, cats.size);
    await page.close();
});

test('Tras Finalizar compra, el aviso Deshacer no tapa nada y deshace', async () => {
    const { page } = await openApp(browser, server.url, { items, safeArea: { top: 47, bottom: 34 } });
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Finalizar compra')).click());
    await page.waitForSelector('[data-testid="confirm"]');
    await page.evaluate(() => [...document.querySelectorAll('[data-testid="confirm"] button')].find((b) => b.textContent.includes('Finalizar')).click());
    await page.waitForSelector('[data-dock] [role="status"]');
    assert.deepEqual(await audit(page, 844), []);
    await page.evaluate(() => [...document.querySelectorAll('[data-dock] button')].find((b) => b.textContent === 'Deshacer').click());
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')));
    assert.deepEqual(saved, items);
    await page.close();
});

test('Finalizar compra registra el historial y Deshacer lo quita', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Finalizar compra')).click());
    await page.waitForSelector('[data-testid="confirm"]');
    await page.evaluate(() => [...document.querySelectorAll('[data-testid="confirm"] button')].find((b) => b.textContent.includes('Finalizar')).click());
    await page.waitForSelector('[data-dock] [role="status"]');
    const log = await page.evaluate(() => JSON.parse(localStorage.getItem('purchases_v1')));
    const cart = items.filter((i) => i.status === 'cart');
    assert.deepEqual(log.map((p) => p.itemId).sort(), cart.map((i) => i.id).sort());
    assert.ok(log.every((p) => p.source === 'compra' && /^\d{4}-\d{2}-\d{2}$/.test(p.date)));
    await page.evaluate(() => [...document.querySelectorAll('[data-dock] button')].find((b) => b.textContent === 'Deshacer').click());
    await new Promise((r) => setTimeout(r, 200));
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('purchases_v1'))), []);
    await page.close();
});

test('Rendimientos sin historial lo dice en vez de inventar', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.click('[data-tab="hist"]');
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Rendimientos').click());
    const txt = await page.evaluate(() => document.querySelector('[data-testid="rendimientos"]').textContent);
    assert.match(txt, /El historial se empieza a llenar/);
    assert.match(txt, /hacen falta al menos dos compras/);
    assert.match(txt, /Antes del historial · 40/);
    await page.close();
});

test('Rendimientos: por acabarse se agrega a la lista', async () => {
    const { exampleLog } = await import('./states.mjs');
    const log = exampleLog();
    const { page } = await openApp(browser, server.url, { items, extra: { purchases_v1: JSON.stringify(log) } });
    await page.click('[data-tab="hist"]');
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent === 'Rendimientos').click());
    const txt = await page.evaluate(() => document.querySelector('[data-testid="rendimientos"]').textContent);
    assert.match(txt, /Por acabarse/); assert.match(txt, /Gasto por mes/); assert.match(txt, /Precio por compra/);
    const before = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')).filter((i) => i.status === 'needed').length);
    const ok = await page.evaluate(() => { const b = [...document.querySelectorAll('[data-testid="rendimientos"] button')].find((x) => x.textContent === 'A la lista'); b?.click(); return !!b; });
    assert.ok(ok, 'hay al menos un producto por acabarse');
    await new Promise((r) => setTimeout(r, 200));
    const after = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')).filter((i) => i.status === 'needed').length);
    assert.equal(after, before + 1);
    await page.close();
});

test('Lista muestra el precio de la última vez', async () => {
    const withPrice = items.map((i) => (i.id === 'fx0' ? { ...i, price: '89', lastBought: '2026-09-01' } : i));
    const { page } = await openApp(browser, server.url, { items: withPrice });
    const txt = await page.evaluate(() => document.querySelector('[data-testid="scroll"]').textContent);
    assert.match(txt, /la última vez \$89 \(1 sep\)/);
    await page.close();
});

test('Leer un ticket actualiza precios y registra cada producto en el historial', async () => {
    const ticket = { items: [{ name: 'Aceite de oliva', price: 199, qty: '1' }, { name: 'Pan de caja', price: 52, qty: '1' }] };
    const { page } = await openApp(browser, server.url, {
        items, extra: { gem_key: 'test-key' },
        mock: { 'generativelanguage.googleapis.com': { candidates: [{ content: { parts: [{ text: JSON.stringify(ticket) }] } }] } },
    });
    const input = await page.$('label[aria-label="Leer ticket"] input[type=file]');
    await input.uploadFile(path.join(ROOT, 'icon-192.png'));
    await page.waitForFunction(() => (JSON.parse(localStorage.getItem('purchases_v1') || '[]')).length === 2, { timeout: 10000 });
    const log = await page.evaluate(() => JSON.parse(localStorage.getItem('purchases_v1')));
    assert.deepEqual(log.map((p) => [p.name, p.price, p.source]), [['Aceite de oliva', 199, 'ticket'], ['Pan de caja', 52, 'ticket']]);
    assert.equal(log[0].itemId, 'fx1');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')));
    assert.equal(saved.find((i) => i.id === 'fx1').price, 199);
    assert.ok(saved.find((i) => i.name === 'Pan de caja'));
    await page.close();
});

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp } from './helpers.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const clickTab = (page, t) => page.evaluate((t) => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === t).click(), t);

test('Editar y Borrar de cada fila miden al menos 32x32 px', async () => {
    const { page } = await openApp(browser, server.url, { items });
    for (const t of ['Lista', 'Casa']) {
        await clickTab(page, t);
        const sizes = await page.evaluate(() => [...document.querySelectorAll('[aria-label="Editar"],[aria-label="Borrar"]')].map((b) => { const r = b.getBoundingClientRect(); return [r.width, r.height]; }));
        assert.ok(sizes.length > 0, t);
        for (const [w, h] of sizes) assert.ok(w >= 32 && h >= 32, `${t}: ${w}x${h}`);
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

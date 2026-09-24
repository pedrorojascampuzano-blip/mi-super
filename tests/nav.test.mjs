// Variantes de navegación de prueba (A/B/C). La actual sigue siendo el default.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, setVisualViewport } from './helpers.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const state = (page) => page.evaluate(() => ({ nav: document.querySelector('[data-nav]').dataset.nav, bottom: !!document.querySelector('.ms-bottomnav'), composer: !!document.querySelector('[data-composer]') }));

test('sin elegir nada se queda la navegación actual', async () => {
    const { page } = await openApp(browser, server.url, { items });
    assert.deepEqual(await state(page), { nav: 'actual', bottom: false, composer: false });
    await page.close();
});

test('?nav=a se recuerda y el selector de Ajustes la cambia', async () => {
    const { page } = await openApp(browser, server.url + '?nav=a', { items });
    assert.equal((await state(page)).nav, 'a');
    assert.equal(await page.evaluate(() => localStorage.getItem('nav_variant')), 'a');
    await page.click('.ms-bottomnav [aria-label="Ajustes"]');
    await page.evaluate(() => [...document.querySelectorAll('[data-testid="sheet"] button')].find((b) => b.textContent.startsWith('C ·')).click());
    await new Promise((r) => setTimeout(r, 200));
    assert.equal(await page.evaluate(() => localStorage.getItem('nav_variant')), 'c');
    await page.close();
});

test('A: la barra inferior cambia de sección y + agrega sin cerrar la hoja', async () => {
    const { page } = await openApp(browser, server.url, { items: [], extra: { nav_variant: 'a' } });
    await page.click('.ms-bottomnav [data-tab="inv"]');
    assert.equal(await page.evaluate(() => document.querySelector('.ms-bottomnav [aria-current="page"]').dataset.tab), 'inv');
    await page.click('.ms-bottomnav [data-tab="shop"]');
    await page.click('.ms-bottomnav [aria-label="Agregar"]');
    await page.waitForSelector('[data-testid="add"] input');
    await page.type('[data-testid="add"] input', 'Tortillas'); await page.keyboard.press('Enter');
    await page.type('[data-testid="add"] input', 'Huevo'); await page.keyboard.press('Enter');
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')).map((i) => [i.name, i.status]));
    assert.deepEqual(saved, [['Tortillas', 'needed'], ['Huevo', 'needed']]);
    assert.match(await page.evaluate(() => document.querySelector('[data-testid="add"]').textContent), /Agregado: Tortillas, Huevo/);
    await page.close();
});

test('A y C: la barra inferior se esconde con el teclado abierto', async () => {
    for (const nav of ['a', 'c']) {
        const { page } = await openApp(browser, server.url, { items, extra: { nav_variant: nav } });
        assert.equal((await state(page)).bottom, true);
        await setVisualViewport(page, 508);
        await new Promise((r) => setTimeout(r, 200));
        assert.equal((await state(page)).bottom, false, nav);
        await page.close();
    }
});

test('B: el campo para escribir queda abajo y el swipe cambia de pestaña', async () => {
    const { page } = await openApp(browser, server.url, { items, extra: { nav_variant: 'b' } });
    const r = await page.evaluate(() => document.querySelector('[data-composer] input').getBoundingClientRect().top);
    assert.ok(r > 700, `el campo está en y=${r}`);
    const current = () => page.evaluate(() => document.querySelector('.ms-tabs [aria-selected="true"]').dataset.tab);
    // touchEnd reporta el último punto movido; se hace en dos pasos para que el desplazamiento cuente
    await page.touchscreen.touchStart(330, 600); await page.touchscreen.touchMove(200, 603); await page.touchscreen.touchMove(120, 605); await page.touchscreen.touchEnd();
    await new Promise((res) => setTimeout(res, 150));
    assert.equal(await current(), 'inv');
    const y2 = await page.evaluate(() => { const r = [...document.querySelectorAll('[data-item] .ms-name')][3].getBoundingClientRect(); return r.top + r.height / 2; });
    await page.touchscreen.touchStart(80, y2); await page.touchscreen.touchMove(200, y2 + 3); await page.touchscreen.touchMove(300, y2 + 5); await page.touchscreen.touchEnd();
    await new Promise((res) => setTimeout(res, 150));
    assert.equal(await current(), 'shop');
    await page.close();
});

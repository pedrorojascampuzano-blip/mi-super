import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, setVisualViewport, lastItemReachable } from './helpers.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
const SHOTS = process.env.SHOTS_DIR;
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const shot = (page, name) => SHOTS && page.screenshot({ path: path.join(SHOTS, name + '.png') });

test('carga sin errores de JS', async () => {
    const { page, errors } = await openApp(browser, server.url, { items });
    await shot(page, '01-lista');
    assert.deepEqual(errors.filter((e) => !/tailwindcss\.com should not be used in production|net::ERR_FAILED/.test(e)), []);
    await page.close();
});

test('Lista: con "Finalizar Compra" visible, el último item se puede ver', async () => {
    const { page } = await openApp(browser, server.url, { items });
    const r = await lastItemReachable(page);
    await shot(page, '02-lista-fondo');
    assert.ok(r.ok, JSON.stringify(r));
    await page.close();
});

for (const [label, tabIdx] of [['Casa', 1], ['Historial', 2]]) {
    test(`${label}: el último item se puede ver al fondo`, async () => {
        const { page } = await openApp(browser, server.url, { items });
        await page.evaluate((i) => [...document.querySelectorAll('button')].filter((b) => /^(Lista|Casa|Historial)$/.test(b.textContent.trim()))[i].click(), tabIdx);
        const r = await lastItemReachable(page);
        await shot(page, `03-${label.toLowerCase()}-fondo`);
        assert.ok(r.ok, JSON.stringify(r));
        await page.close();
    });
}

test('Barra de Safari (visualViewport 750px): el último item sigue alcanzable', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await setVisualViewport(page, 750);
    const r = await lastItemReachable(page, 750);
    await shot(page, '04-safari-barra');
    assert.ok(r.ok, JSON.stringify(r));
    await page.close();
});

test('Teclado abierto (visualViewport 508px): el último item queda sobre el teclado', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.focus('input');
    await setVisualViewport(page, 508);
    const r = await lastItemReachable(page, 508);
    await shot(page, '05-teclado');
    assert.ok(r.ok, JSON.stringify(r));
    await page.close();
});

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, setVisualViewport, lastItemReachable, audit } from './helpers.mjs';

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
        await page.click(`[data-tab="${['shop', 'inv', 'hist'][tabIdx]}"]`);
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

for (const vh of [844, 508]) {
    test(`Modal Editar (visualViewport ${vh}px): "Guardar cambios" siempre visible y nada tapado`, async () => {
        const { page } = await openApp(browser, server.url, { items, safeArea: { top: 47, bottom: 34 } });
        await page.click('[data-tab="inv"]');
        await page.click('[data-testid="scroll"] [aria-label="Editar"]');
        await page.waitForSelector('[data-testid="sheet"]');
        await page.focus('[data-testid="sheet"] input');
        await setVisualViewport(page, vh);
        const save = await page.evaluate(() => { const b = [...document.querySelectorAll('[data-testid="sheet"] button')].find((x) => x.textContent.includes('Guardar')); const r = b.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; });
        assert.ok(save.bottom <= vh && save.top >= 0, JSON.stringify(save));
        assert.deepEqual(await audit(page, vh), []);
        await shot(page, `06-editar-${vh}`);
        await page.close();
    });
}

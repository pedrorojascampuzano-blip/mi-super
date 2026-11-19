// «Finalizar compra» con foto(s) del ticket (v31): lógica pura + flujo en emulación iPhone.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, startServer, launch, openApp } from './helpers.mjs';
import { ticketPath, newTicket, addFoto, ticketsDe, TK_MAX_FOTOS } from '../src/tickets.js';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
const SHOTS = process.env.CK_SHOTS || '';
let server, browser, tmp;
before(async () => { server = await startServer(); browser = await launch(); tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-')); });
after(async () => { await browser?.close(); server?.srv.close(); fs.rmSync(tmp, { recursive: true, force: true }); });

test('tickets: ruta propia por grupo y compra; addFoto mueve pendiente a url sin duplicar', () => {
    assert.equal(ticketPath('g1', 'c9', 2), 'tickets/g1/c9-2.jpeg');
    let log = [newTicket('c9', '2026-11-19', 4, 2)];
    assert.equal(log[0].pendientes, 2);
    log = addFoto(log, 'c9', 'https://x/1.jpeg'); log = addFoto(log, 'c9', 'https://x/1.jpeg');
    assert.deepEqual(log[0].fotos, ['https://x/1.jpeg']); assert.equal(log[0].pendientes, 0);
    assert.equal(ticketsDe(log, '2026-11-19').length, 1); assert.equal(ticketsDe(log, '2026-11-20').length, 0);
    assert.ok(TK_MAX_FOTOS >= 3);
});

const fotoTicket = async (page, n) => {
    const b64 = await page.evaluate((n) => {
        const c = document.createElement('canvas'); c.width = 600; c.height = 900; const g = c.getContext('2d');
        g.fillStyle = '#fbfbf7'; g.fillRect(0, 0, 600, 900); g.fillStyle = '#222'; g.font = 'bold 40px monospace';
        g.fillText('SUPER MERCADO', 120, 80); g.font = '28px monospace';
        for (let i = 0; i < 16; i++) g.fillText(`Producto ${n}-${i + 1}`.padEnd(22) + (10 + i * 7.5).toFixed(2), 40, 150 + i * 40);
        return c.toDataURL('image/jpeg', 0.8).split(',')[1];
    }, n);
    const f = path.join(tmp, `ticket${n}.jpg`); fs.writeFileSync(f, Buffer.from(b64, 'base64')); return f;
};
const snap = async (page, name) => { if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '.png') }); };
const estados = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('data_v4')).map(i => i.status));

test('Saltar: un toque, finaliza sin fotos', async () => {
    const { page, errors } = await openApp(browser, server.url, { items });
    await page.evaluate(() => { document.querySelector('[data-tab="shop"]').click(); });
    await page.waitForSelector('[data-act="checkout"]');
    await page.click('[data-act="checkout"]');
    await page.waitForSelector('[data-testid="checkout"]');
    assert.equal(await page.$eval('[data-testid="ck-con-ticket"]', b => b.disabled), true, 'sin fotos no se puede «con ticket»');
    await snap(page, '1-paso-vacio');
    await page.click('[data-testid="ck-saltar"]');
    await page.waitForFunction(() => !document.querySelector('[data-testid="checkout"]'));
    assert.ok(!(await estados(page)).includes('cart'));
    assert.equal(await page.evaluate(() => localStorage.getItem('tickets_v1')), '[]');
    assert.deepEqual(errors.filter((e) => !/Failed to load resource|net::ERR/.test(e)), []);
    await page.close();
});

test('Con fotos: miniaturas, quitar una, finalizar, cola local y fotos en Rendimientos', async () => {
    const { page, errors } = await openApp(browser, server.url, { items });
    await page.evaluate(() => { document.querySelector('[data-tab="shop"]').click(); });
    await page.waitForSelector('[data-act="checkout"]');
    await page.click('[data-act="checkout"]');
    await page.waitForSelector('[data-testid="ck-galeria"]');
    const [f1, f2, f3] = [await fotoTicket(page, 1), await fotoTicket(page, 2), await fotoTicket(page, 3)];
    await (await page.$('[data-testid="ck-galeria"]')).uploadFile(f1, f2, f3);
    await page.waitForFunction(() => document.querySelectorAll('[data-testid="ck-fotos"] img').length === 3);
    await snap(page, '2-con-fotos');
    await page.click('[data-testid="ck-fotos"] figure:nth-child(2) button');
    assert.equal(await page.$$eval('[data-testid="ck-fotos"] img', n => n.length), 2);
    assert.match(await page.$eval('[data-testid="ck-con-ticket"]', b => b.textContent), /2 fotos/);
    await page.click('[data-testid="ck-con-ticket"]');
    await page.waitForFunction(() => !document.querySelector('[data-testid="checkout"]'));
    assert.ok(!(await estados(page)).includes('cart'), 'la compra se finalizó');
    const tk = await page.evaluate(() => JSON.parse(localStorage.getItem('tickets_v1')));
    assert.equal(tk.length, 1); assert.equal(tk[0].pendientes, 2); assert.equal(tk[0].count > 0, true);
    const pend = await page.evaluate(() => new Promise(r => { const q = indexedDB.open('mi-super-tickets', 1); q.onsuccess = () => { const g = q.result.transaction('pend').objectStore('pend').getAll(); g.onsuccess = () => r(g.result.map(x => x.key)); }; }));
    assert.deepEqual(pend.sort(), [`${tk[0].id}-1`, `${tk[0].id}-2`], 'las fotos esperan en la cola local');
    await snap(page, '3-finalizada');
    await page.evaluate(() => { document.querySelector('[data-tab="hist"]').click(); });
    await page.waitForFunction(() => [...document.querySelectorAll('[role=tab]')].some(b => b.textContent === 'Rendimientos'));
    await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].find(b => b.textContent === 'Rendimientos').click());
    await page.waitForSelector('[data-testid="tickets-hist"] img');
    assert.equal(await page.$$eval('[data-testid="tickets-hist"] img', n => n.length), 2);
    await page.$eval('[data-testid="tickets-hist"]', e => e.scrollIntoView());
    await snap(page, '4-historial');
    assert.deepEqual(errors.filter((e) => !/Failed to load resource|net::ERR/.test(e)), []);
    await page.close();
});

// Escribirle a la orquesta (v29): lógica pura + la hoja en emulación iPhone con un colector simulado.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, audit, IPHONE } from './helpers.mjs';
import { reportBody, estadoDe, mergeEstados, sendMsg, fetchReports, canSend, shrinkDims, loadMsgs, saveMsgs, ORQ_COLECTOR, ORQ_FILA } from '../src/orquesta.js';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const fakeFetch = (rutas, log = []) => async (url, init = {}) => {
    log.push({ url, method: init.method || 'GET', headers: init.headers, body: init.body ? JSON.parse(init.body) : null });
    const hit = Object.keys(rutas).find((k) => url.includes(k));
    if (!hit) throw new TypeError('sin red');
    const [status, body] = rutas[hit];
    return { ok: status < 300, status, json: async () => body };
};

test('reportBody: proyecto misuper, texto tal cual, máximo 3 fotos', () => {
    const b = reportBody({ texto: '  hola  ', shots: [1, 2, 3, 4].map((n) => ({ data: 'x' + n })), url: 'u', viewport: '390x844' });
    assert.equal(b.project, 'misuper'); assert.equal(b.note, 'hola'); assert.equal(b.shots.length, 3);
    assert.equal(b.shots[0].mime, 'image/jpeg');
    assert.match(reportBody({ texto: '', shots: [{ data: 'x' }] }).note, /sin texto/);
    assert.equal(canSend('  ', []), false); assert.equal(canSend('', [{ data: 'x' }]), true);
});

test('estadoDe y mergeEstados: done = atendido con la respuesta; lo pendiente no se toca', () => {
    assert.equal(estadoDe({ status: 'done' }), 'atendido'); assert.equal(estadoDe({ status: 'new' }), 'enviado');
    assert.equal(estadoDe({ status: 'wontfix' }), 'descartado'); assert.equal(estadoDe(undefined), 'enviado');
    const msgs = [{ id: 'a', estado: 'enviado' }, { id: '', local: 'l1', estado: 'pendiente' }, { id: 'c', estado: 'enviado' }];
    const out = mergeEstados(msgs, [{ dir: 'a', status: 'done', reply: ' Listo, ya quedó. ' }, { dir: 'z', status: 'done' }]);
    assert.equal(out[0].estado, 'atendido'); assert.equal(out[0].respuesta, 'Listo, ya quedó.'); assert.equal(out[0].visto, false);
    assert.equal(out[1].estado, 'pendiente'); assert.equal(out[2].estado, 'enviado');
    const again = mergeEstados([{ ...out[0], visto: true }], [{ dir: 'a', status: 'done', reply: 'Listo, ya quedó.' }]);
    assert.equal(again[0].visto, true);
});

test('sendMsg: sin llave solo /report; con llave también /orquesta ligado a la fila', async () => {
    const log = [];
    const f = fakeFetch({ '/report': [200, { ok: true, dir: '2026-11-17_1900-abc' }] }, log);
    let r = await sendMsg({ texto: 'hola', shots: [], f });
    assert.deepEqual(r, { ok: true, id: '2026-11-17_1900-abc', ligado: false }); assert.equal(log.length, 1);
    assert.equal(log[0].url, ORQ_COLECTOR + '/report');
    const log2 = [];
    const f2 = fakeFetch({ '/orquesta': [200, { ok: true }], '/report': [200, { ok: true, dir: 'd1' }] }, log2);
    r = await sendMsg({ texto: 'hola', shots: [], llave: 'K', f: f2 });
    assert.equal(r.ligado, true); assert.equal(log2[1].body.code, ORQ_FILA); assert.equal(log2[1].body.dir, 'd1'); assert.equal(log2[1].headers['X-TT-Key'], 'K');
});

test('sendMsg: errores claros; /orquesta caído no tumba el envío', async () => {
    assert.equal((await sendMsg({ texto: ' ', shots: [], f: fakeFetch({}) })).ok, false);
    const sinRed = await sendMsg({ texto: 'x', shots: [], f: fakeFetch({}) });
    assert.equal(sinRed.ok, false); assert.match(sinRed.error, /sin conexión|No hay conexión/i);
    const malo = await sendMsg({ texto: 'x', shots: [], f: fakeFetch({ '/report': [500, { ok: false, error: 'boom' }] }) });
    assert.equal(malo.error, 'boom');
    const f = fakeFetch({ '/report': [200, { ok: true, dir: 'd' }] });   // /orquesta lanza TypeError
    assert.deepEqual(await sendMsg({ texto: 'x', shots: [], llave: 'K', f }), { ok: true, id: 'd', ligado: false });
});

test('fetchReports: lista, o null sin red', async () => {
    assert.deepEqual(await fetchReports(fakeFetch({ '/reports?project=misuper': [200, { reports: [{ dir: 'a' }] }] })), [{ dir: 'a' }]);
    assert.equal(await fetchReports(fakeFetch({})), null);
});

test('saveMsgs/loadMsgs: ida y vuelta; si no cabe, guarda sin fotos', () => {
    const mem = {}; const st = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = v; } };
    assert.equal(saveMsgs([{ id: 'a', texto: 't' }], st), true); assert.equal(loadMsgs(st)[0].texto, 't');
    let n = 0; const justo = { getItem: st.getItem, setItem: (k, v) => { if (n++ === 0) throw new Error('quota'); mem[k] = v; } };
    assert.equal(saveMsgs([{ id: 'b', texto: 'q', shots: [{ data: 'zzz' }] }], justo), true); assert.equal(loadMsgs(st)[0].shots, undefined);
    assert.deepEqual(shrinkDims(4000, 3000), [1280, 960]); assert.deepEqual(shrinkDims(800, 600), [800, 600]);
});

// ---- La hoja en el teléfono ----
const abrirOrq = async (page) => {
    await page.click('[aria-label="Más"]');
    await page.waitForSelector('[data-testid="orq-menu"]');
    await page.click('[data-testid="orq-menu"]');
    await page.waitForSelector('[data-testid="orq-body"]');
};

test('sin ?orq=1 la opción no existe (los demás del grupo no la ven)', async () => {
    const { page } = await openApp(browser, server.url, { items });
    await page.click('[aria-label="Más"]');
    await page.waitForSelector('.ms-menu');
    assert.equal(await page.$('[data-testid="orq-menu"]'), null);
    await page.close();
});

test('mandar desde el teléfono, ver «Enviado» y luego la respuesta de la orquesta', async () => {
    const mock = { 'ticktack/reports': { reports: [] }, 'ticktack/report': { ok: true, dir: '2026-11-17_190000-aaa111' } };
    const { page, errors } = await openApp(browser, server.url + '?orq=1', { items, mock });
    const posts = [];
    page.on('request', (r) => { if (r.method() === 'POST') posts.push(JSON.parse(r.postData())); });
    await abrirOrq(page);
    assert.equal(await page.$eval('[data-testid="orq-send"]', (b) => b.disabled), true);
    await page.type('[data-testid="orq-text"]', 'Agrega un botón para pedir el súper por voz');
    assert.equal(await page.$eval('[data-testid="orq-send"]', (b) => b.disabled), false);
    // una foto real de 1x1 por el selector de archivos
    const png = path.join(ROOT, 'tests/fixtures/orq-1x1.png');
    fs.writeFileSync(png, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64'));
    await (await page.$('[data-testid="orq-file"]')).uploadFile(png);
    await page.waitForSelector('[data-testid="orq-body"] figure img');
    fs.rmSync(png);
    await page.click('[data-testid="orq-send"]');
    await page.waitForFunction(() => document.querySelector('[data-testid="orq-status"]')?.textContent.startsWith('Mandado'));
    assert.equal(posts.length, 1);
    assert.equal(posts[0].project, 'misuper'); assert.match(posts[0].note, /pedir el súper por voz/); assert.equal(posts[0].shots.length, 1);
    assert.match(await page.$eval('[data-testid="orq-list"]', (e) => e.textContent), /Enviado · esperando/);
    assert.equal(await page.$eval('[data-testid="orq-text"]', (e) => e.value), '');
    // La orquesta cierra: el colector ahora dice done con la respuesta. Se cierra y se vuelve a abrir la hoja.
    mock['ticktack/reports'] = { reports: [{ dir: '2026-11-17_190000-aaa111', status: 'done', reply: 'Listo: ya puedes pedirlo por voz desde la v30.' }] };
    await page.evaluate(() => __ms.setModal(null));
    await page.evaluate(() => __ms.setModal('orquesta'));
    await page.waitForSelector('[data-testid="orq-reply"]', { timeout: 5000 }).catch(async (e) => { throw new Error(e.message + ' :: ' + await page.evaluate(() => JSON.stringify({ls: localStorage.getItem('orq_msgs_v1'), list: document.querySelector('[data-testid="orq-list"]')?.textContent}))); });
    assert.match(await page.$eval('[data-testid="orq-reply"]', (e) => e.textContent), /ya puedes pedirlo por voz/);
    assert.deepEqual(errors.filter((e) => !/Failed to load resource|net::ERR/.test(e)), []);
    await page.close();
});

test('sin red el mensaje queda pendiente con Reintentar, y sale cuando vuelve la red', async () => {
    const mock = {};   // sin rutas: el helper deja pasar y no hay red hacia anvil
    const { page } = await openApp(browser, server.url + '?orq=1', { items, mock });
    await abrirOrq(page);
    await page.type('[data-testid="orq-text"]', 'mensaje sin red');
    await page.evaluate(() => { window.__realFetch = window.fetch; window.fetch = () => Promise.reject(new TypeError('offline')); });
    await page.click('[data-testid="orq-send"]');
    await page.waitForFunction(() => /No hay conexión/.test(document.querySelector('[data-testid="orq-status"]')?.textContent || ''));
    assert.match(await page.$eval('[data-testid="orq-list"]', (e) => e.textContent), /Sin enviar/);
    await page.evaluate(() => { window.fetch = async (u) => ({ ok: true, status: 200, json: async () => (String(u).includes('/reports') ? { reports: [] } : { ok: true, dir: 'dir-ok' }) }); });
    await page.evaluate(() => [...document.querySelectorAll('[data-testid="orq-list"] button')].find((b) => b.textContent === 'Reintentar').click());
    await page.waitForFunction(() => /Enviado · esperando/.test(document.querySelector('[data-testid="orq-list"]').textContent));
    await page.close();
});

test('la hoja cabe en 390 de ancho: sin cortes, tapados ni scroll horizontal (con mensajes largos)', async () => {
    const largo = 'Una frase muy larga sin espacios: ' + 'x'.repeat(120) + ' y luego un párrafo normal que ocupa varias líneas para ver cómo se corta el texto en la pantalla del teléfono.';
    const msgs = [
        { id: 'a', texto: largo, at: Date.now(), estado: 'atendido', respuesta: largo, visto: true },
        { id: 'b', texto: 'otro', at: Date.now(), estado: 'enviado' },
        { id: '', local: 'l', texto: 'sin red', at: Date.now(), estado: 'pendiente' },
    ];
    const { page } = await openApp(browser, server.url + '?orq=1', { items, safeArea: { top: 47, bottom: 34 }, extra: { orq_msgs_v1: JSON.stringify(msgs) }, mock: { 'ticktack/reports': { reports: [] } } });
    await abrirOrq(page);
    assert.deepEqual(await audit(page, IPHONE.height), []);
    await page.close();
});

test('en 1280 de ancho la hoja se ve completa', async () => {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(true);
    page.on('request', (r) => (r.url().includes('ticktack') ? r.respond({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"reports":[]}' }) : r.continue()));
    await page.evaluateOnNewDocument(() => { window.__MS_TEST__ = true; localStorage.setItem('onboarded_v1', '1'); localStorage.setItem('orq_on', '1'); });
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0);
    await page.evaluate(() => __ms.setModal('orquesta'));
    await page.waitForSelector('[data-testid="orq-body"]');
    const r = await page.evaluate(() => { const s = document.querySelector('[data-testid="sheet"]').getBoundingClientRect(); return { l: s.left, r: s.right, w: window.innerWidth, sw: document.documentElement.scrollWidth }; });
    assert.ok(r.l >= 0 && r.r <= r.w && r.sw <= r.w, JSON.stringify(r));
    await page.close();
});

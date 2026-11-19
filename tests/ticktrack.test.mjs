// TickTrack en Mi Súper (v30): carga solo con la marca orq_on, el botón queda arriba de la barra inferior
// y sin red la app sigue igual. Usa un widget de mentira para no depender de la tailnet.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp } from './helpers.mjs';
import { ttCss, TT_BASE, TT_PROYECTO } from '../src/ticktrack.js';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
let server, browser;
before(async () => { server = await startServer(); browser = await launch(); });
after(async () => { await browser?.close(); server?.srv.close(); });

const FAKE = `window.TickTrack={init:function(o){window.__ttInit=o;var b=document.createElement('button');b.className='tt-fab';
b.style.cssText='position:fixed;bottom:12px;right:18px;width:44px;height:44px;z-index:2147483000';document.body.appendChild(b);}};`;

const abre = async (extra, { red = true } = {}) => {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.setBypassServiceWorker(true);   // el SW va por fuera de la intercepción de la página
    await page.setRequestInterception(true);
    page.on('request', (r) => {
        const u = r.url();
        if (u.includes('anvil.tail8be012.ts.net')) return red ? r.respond({ status: 200, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: FAKE }) : r.abort();
        return (u.includes('.supabase.co') && !u.includes('supabase-js')) ? r.abort() : r.continue();
    });
    page.on('console', (m) => process.env.DBG && console.log('C', m.text())); const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
    await page.evaluateOnNewDocument((items, extra) => {
        window.__MS_TEST__ = true;
        if (sessionStorage.getItem('__seeded')) return;
        sessionStorage.setItem('__seeded', '1'); localStorage.clear();
        localStorage.setItem('onboarded_v1', '1'); localStorage.setItem('data_v4', JSON.stringify(items));
        for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
    }, items, extra);
    await page.goto(server.url, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.querySelector('#root')?.children.length > 0);
    await new Promise((r) => setTimeout(r, 500));
    return { page, errors };
};

test('css: el botón va arriba a la derecha, respeta el borde seguro y se oculta con una hoja abierta', () => {
    const css = ttCss();
    assert.match(css, /\.tt-fab\{top:calc\(var\(--sat, 0px\) \+ 8px\)/);
    assert.match(css, /body\.ms-sheet-open \.tt-fab\{display:none/);
    assert.equal(TT_PROYECTO, 'misuper'); assert.match(TT_BASE, /anvil\.tail8be012\.ts\.net\/ticktack$/);
});

test('sin la marca orq_on no se carga nada de TickTrack', async () => {
    const { page, errors } = await abre({});
    assert.equal(await page.evaluate(() => !!document.getElementById('ms-tt-script') || !!window.TickTrack), false);
    assert.deepEqual(errors, []); await page.close();
});

test('con orq_on: init con proyecto misuper y el botón no toca la barra inferior ni el «+»', async () => {
    const { page, errors } = await abre({ orq_on: '1' });
    const r = await page.evaluate(() => {
        const g = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return { t: b.top, b: b.bottom, l: b.left, r: b.right }; };
        const f = document.querySelector('.tt-fab').getBoundingClientRect();
        const cruza = [...document.querySelectorAll('#root button, #root input, #root label')].filter((e) => { const x = e.getBoundingClientRect(); return x.width && x.left < f.right && x.right > f.left && x.top < f.bottom && x.bottom > f.top; }).map((e) => e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20));
        return { cruza, init: window.__ttInit, fab: g('.tt-fab'), nav: g('.ms-bottomnav'), add: g('.ms-navadd span') };
    });
    assert.equal(r.init.project, 'misuper'); assert.equal(r.init.endpoint, TT_BASE + '/report');
    assert.ok(r.fab.b <= r.nav.t, `el botón (${r.fab.b}) debe quedar sobre la barra (${r.nav.t})`);
    assert.equal(r.cruza.length, 0, 'el botón no debe tapar ningún control de la app: ' + r.cruza.join(', '));
    assert.ok(r.fab.r <= 390 && r.fab.l >= 0);
    for (const tab of ['inv', 'history']) {   // en las otras pestañas tampoco tapa nada
        await page.evaluate((t) => window.__ms.setTab(t), tab); await new Promise((r) => setTimeout(r, 300));
        const c = await page.evaluate(() => { const f = document.querySelector('.tt-fab').getBoundingClientRect(); return [...document.querySelectorAll('#root button, #root input, #root label')].filter((e) => { const x = e.getBoundingClientRect(); return x.width && x.left < f.right && x.right > f.left && x.top < f.bottom && x.bottom > f.top; }).map((e) => e.getAttribute('aria-label') || e.textContent.trim().slice(0, 20)); });
        assert.deepEqual(c, [], 'tapa controles en ' + tab);
    }
    await page.evaluate(() => window.__ms.setTab('shop'));
    // al abrir una hoja el botón se oculta
    await page.evaluate(() => window.__ms.setModal('settings'));
    await new Promise((r) => setTimeout(r, 300));
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.tt-fab')).display), 'none');
    assert.deepEqual(errors, []); await page.close();
});

test('sin red a anvil la app abre igual y no sale ningún error', async () => {
    const { page, errors } = await abre({ orq_on: '1' }, { red: false });
    assert.equal(await page.evaluate(() => !!window.TickTrack), false);
    assert.equal(await page.evaluate(() => !!document.getElementById('ms-tt-script')), false);   // se quitó solo
    assert.ok(await page.evaluate(() => document.querySelector('.ms-bottomnav') !== null));
    assert.deepEqual(errors, []); await page.close();
});

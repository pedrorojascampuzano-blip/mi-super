// Bug hunt: recorre STATES x VIEWPORTS, audita y guarda capturas. Uso: node tests/hunt.mjs <dir-capturas> [url]
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, startServer, launch, openApp, setVisualViewport, audit } from './helpers.mjs';
import { STATES, VIEWPORTS, wait } from './states.mjs';

const items = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/items.json'), 'utf8'));
const out = process.argv[2]; if (out) fs.mkdirSync(out, { recursive: true });
const server = process.argv[3] ? null : await startServer();
const url = process.argv[3] || server.url;
const browser = await launch();
const results = [];
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
    for (const [stName, open] of Object.entries(STATES)) {
        const st = stName === 'Lista' ? items.map((i) => (i.status === 'cart' ? { ...i, status: 'needed' } : i)) : items;
        const { page, errors } = await openApp(browser, url, { items: st, safeArea: vp.safeArea });
        await open(page); await wait(250);
        if (vp.vh !== 844) { await page.evaluate(() => document.querySelector('input:not([type=file])')?.focus()); await setVisualViewport(page, vp.vh); await wait(200); }
        let issues;
        try { issues = await audit(page, vp.vh); } catch (e) { issues = ['error en auditoría: ' + e.message]; }
        const jsErr = errors.filter((e) => !/tailwindcss\.com should not|net::ERR_FAILED/.test(e));
        if (jsErr.length) issues.push(...jsErr.map((e) => 'js: ' + e));
        const slug = `${vp.vh}-${stName}`.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-');
        if (out) { await page.evaluate(() => document.querySelectorAll('*').forEach((el) => { if (el.scrollTop) el.scrollTop = el.scrollHeight; })); await page.screenshot({ path: path.join(out, slug + '.png') }); }
        results.push({ viewport: vpName, state: stName, issues, shot: slug + '.png' });
        await page.close();
    }
}
await browser.close(); server?.srv.close();
const bad = results.filter((r) => r.issues.length);
for (const r of bad) console.log(`\n✗ ${r.state} · ${r.viewport}\n  - ${r.issues.join('\n  - ')}`);
console.log(`\n${results.length - bad.length}/${results.length} estados limpios`);
if (out) fs.writeFileSync(path.join(out, 'hunt.json'), JSON.stringify(results, null, 1));
process.exitCode = bad.length ? 1 : 0;

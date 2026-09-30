// Renderiza un logo SVG a los PNG de ícono de la app (192, 512 y apple-touch 180).
// Uso: node design/render-icons.mjs <svg> <carpeta-salida>
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const [svgPath, out] = process.argv.slice(2);
const svg = await fs.readFile(svgPath, 'utf8');
await fs.mkdir(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage();
for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: path.join(out, name), clip: { x: 0, y: 0, width: size, height: size } });
}
await fs.copyFile(svgPath, path.join(out, 'icon.svg'));
await browser.close();

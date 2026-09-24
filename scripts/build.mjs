// Compila src/app.jsx → app.js (sin Babel en el navegador) y sincroniza la
// versión del cache del service worker con APP_VERSION.
// app.js se commitea: GitHub Pages sirve la raíz de main tal cual, sin build en CI.
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(ROOT, 'src/app.jsx'), 'utf8');
const version = src.match(/const APP_VERSION = '(\d+)'/)?.[1];
if (!version) throw new Error('APP_VERSION no encontrado en src/app.jsx');

export const compile = () => esbuild.build({
    entryPoints: [path.join(ROOT, 'src/app.jsx')],
    bundle: true,
    format: 'iife',
    write: false,
    loader: { '.jsx': 'jsx' },
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: ['es2020'],
    charset: 'utf8',
    banner: { js: '// GENERADO por scripts/build.mjs desde src/app.jsx. No editar a mano.' },
}).then((r) => r.outputFiles[0].text);

export const swWithVersion = (sw) => sw.replace(/const CACHE = 'mi-super-v\d+';/, `const CACHE = 'mi-super-v${version}';`);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    fs.writeFileSync(path.join(ROOT, 'app.js'), await compile());
    const swPath = path.join(ROOT, 'sw.js');
    fs.writeFileSync(swPath, swWithVersion(fs.readFileSync(swPath, 'utf8')));
    console.log(`app.js listo · v${version}`);
}

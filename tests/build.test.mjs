import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './helpers.mjs';
import { compile, swWithVersion } from '../scripts/build.mjs';

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('src/app.jsx compila (sin errores de sintaxis JSX)', async () => {
    await compile();
});

test('app.js está al día con src/app.jsx (corre npm run build)', async () => {
    assert.equal(read('app.js'), await compile());
});

test('sw.js usa el mismo número de versión que APP_VERSION', () => {
    const sw = read('sw.js');
    assert.equal(sw, swWithVersion(sw));
});

test('sw.js sin marcadores de conflicto y precachea app.js', () => {
    for (const f of ['sw.js', 'index.html', 'src/app.jsx']) assert.doesNotMatch(read(f), /^(<<<<<<<|=======|>>>>>>>)/m, f);
    assert.match(read('sw.js'), /'\.\/app\.js'/);
});

test('index.html ya no carga Babel en el navegador', () => {
    assert.doesNotMatch(read('index.html'), /babel/i);
    assert.match(read('index.html'), /<script src="app\.js"><\/script>/);
});

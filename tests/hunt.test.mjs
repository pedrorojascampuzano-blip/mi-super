// Regresión del bug hunt: ningún estado x viewport puede tener contenido tapado, cortado o fuera de alcance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './helpers.mjs';

test('bug hunt: todas las vistas y modales en app instalada, Safari y con teclado', () => {
    try {
        execFileSync(process.execPath, [path.join(ROOT, 'tests/hunt.mjs')], { encoding: 'utf8', stdio: 'pipe', timeout: 300000 });
    } catch (e) {
        assert.fail(e.stdout || e.message);
    }
});

// Regresión del bug hunt: ningún estado x viewport puede tener contenido tapado, cortado o fuera de alcance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ROOT } from './helpers.mjs';

for (const nav of ['actual', 'a', 'b', 'c']) {
    test(`bug hunt [nav ${nav}]: todas las vistas y modales en app instalada, Safari y con teclado`, () => {
        try {
            execFileSync(process.execPath, [path.join(ROOT, 'tests/hunt.mjs')], { encoding: 'utf8', stdio: 'pipe', timeout: 400000, env: { ...process.env, NAV: nav } });
        } catch (e) {
            assert.fail(e.stdout || e.message);
        }
    });
}

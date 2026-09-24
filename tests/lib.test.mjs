import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listShareText } from '../src/lib.js';

const it = (name, category, status = 'needed', places = ['General'], qty = '') => ({ name, category, status, places, qty });

test('listShareText agrupa por categoría, ordena y marca lo que ya está en el carrito', () => {
    const txt = listShareText([
        it('Mirin', 'Asiáticos'), it('Aceite de oliva', 'Aceites', 'cart'), it('Aceite de uva', 'Aceites', 'needed', ['General'], '2 l'),
        it('Sal', 'Especias', 'stocked'),
    ]);
    assert.equal(txt, 'Lista del súper\n\nAceites\n[x] Aceite de oliva\n[ ] Aceite de uva (2 l)\n\nAsiáticos\n[ ] Mirin');
});

test('listShareText respeta el filtro de tienda (y lo General siempre entra)', () => {
    const txt = listShareText([it('Pan', 'Panadería', 'needed', ['Costco']), it('Leche', 'Lácteos', 'needed', ['Oxxo']), it('Huevo', 'Lácteos')], 'Costco');
    assert.match(txt, /^Lista del súper · Costco/);
    assert.match(txt, /Pan/); assert.match(txt, /Huevo/); assert.doesNotMatch(txt, /Leche/);
});

test('listShareText con lista vacía', () => {
    assert.equal(listShareText([it('Sal', 'Especias', 'stocked')]), 'La lista del súper está vacía.');
});

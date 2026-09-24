import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appendPurchases, purchaseEntry, computeRendimientos, lastInfo, toPrice, fmtLeft, fmtMoney } from '../src/rendimientos.js';

const leche = { id: 'a', name: 'Leche', category: 'Lácteos', status: 'stocked', price: '28', qty: '1 l', lastBought: '2026-09-01' };
const arroz = { id: 'b', name: 'Arroz', category: 'Granos', status: 'needed', price: '', qty: '', lastBought: null };
const sal = { id: 'c', name: 'Sal', category: 'Especias', status: 'stocked', price: '15', qty: '', lastBought: '2026-05-25' };

test('toPrice solo acepta números positivos', () => {
    assert.equal(toPrice('45'), 45); assert.equal(toPrice('$1,250.50'), 1250.5);
    assert.equal(toPrice(''), null); assert.equal(toPrice('abc'), null); assert.equal(toPrice(0), null);
});

test('appendPurchases no duplica el mismo producto el mismo día y el precio del ticket gana', () => {
    let log = appendPurchases([], [purchaseEntry(leche, '2026-09-10', 'compra')]);
    log = appendPurchases(log, [purchaseEntry(leche, '2026-09-10', 'ticket', 31)]);
    assert.equal(log.length, 1);
    assert.equal(log[0].price, 31);
    log = appendPurchases(log, [purchaseEntry(leche, '2026-09-10', 'compra')]);
    assert.equal(log[0].price, 31, 'una compra sin ticket no pisa el precio leído del ticket');
});

test('intervalo promedio, siguiente compra y por acabarse', () => {
    const log = ['2026-08-01', '2026-08-08', '2026-08-15', '2026-08-22'].map((d, i) => purchaseEntry(leche, d, 'compra', 28 + i));
    const r = computeRendimientos(log, [leche, arroz], '2026-08-28');
    const p = r.products[0];
    assert.equal(p.every, 7); assert.equal(p.last, '2026-08-22'); assert.equal(p.next, '2026-08-29'); assert.equal(p.daysLeft, 1);
    assert.deepEqual(r.runningOut.map((x) => x.name), ['Leche']);
    assert.deepEqual(r.priceTrends[0].prices.map((x) => x.price), [28, 29, 30, 31]);
});

test('con una sola compra no se inventa intervalo', () => {
    const r = computeRendimientos([purchaseEntry(leche, '2026-09-10', 'compra')], [leche], '2026-09-24');
    assert.equal(r.products.length, 0);
    assert.equal(r.singles.length, 1);
    assert.equal(r.runningOut.length, 0);
});

test('lo que ya está en la lista no se sugiere otra vez', () => {
    const log = ['2026-08-01', '2026-08-08'].map((d) => purchaseEntry(arroz, d, 'compra', 40));
    const r = computeRendimientos(log, [arroz], '2026-08-20');
    assert.equal(r.products[0].daysLeft, -5);
    assert.equal(r.runningOut.length, 0);
});

test('gasto por mes y por categoría; compras sin precio se cuentan aparte', () => {
    const log = [
        purchaseEntry(leche, '2026-08-05', 'compra', 30), purchaseEntry(arroz, '2026-08-05', 'compra', null),
        purchaseEntry(leche, '2026-09-05', 'ticket', 32), purchaseEntry(sal, '2026-09-06', 'ticket', 18),
    ];
    const r = computeRendimientos(log, [leche, arroz, sal], '2026-09-24');
    assert.deepEqual(r.months.map((m) => [m.month, m.total, m.purchases, m.unpriced]), [['2026-09', 50, 2, 0], ['2026-08', 30, 2, 1]]);
    assert.equal(r.unpriced, 1);
    assert.deepEqual(r.categories.map((c) => [c.category, c.total]), [['Lácteos', 62], ['Especias', 18]]);
});

test('productos con compras anteriores al historial quedan aparte, con su última fecha', () => {
    const r = computeRendimientos([], [leche, arroz, sal], '2026-09-24');
    assert.deepEqual(r.beforeLog.map((i) => i.name), ['Leche', 'Sal']);
    assert.equal(r.since, null);
});

test('lastInfo: el historial manda; si no hay, usa lo que guardaba el item', () => {
    assert.deepEqual(lastInfo(sal, []), { date: '2026-05-25', price: 15, priceDate: '2026-05-25', fromLog: false });
    const log = [purchaseEntry(leche, '2026-09-10', 'ticket', 31)];
    assert.deepEqual(lastInfo({ ...leche, lastBought: '2026-09-10' }, log), { date: '2026-09-10', price: 31, priceDate: '2026-09-10', fromLog: true });
    assert.equal(lastInfo(arroz, []).price, null);
});

test('formatos', () => {
    assert.equal(fmtLeft(-2), 'tocaba hace 2 días'); assert.equal(fmtLeft(0), 'toca hoy'); assert.equal(fmtLeft(1), 'en 1 día');
    assert.equal(fmtMoney(1250.5), '$1,250.50'); assert.equal(fmtMoney(30), '$30');
});

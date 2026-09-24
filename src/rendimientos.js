// Rendimientos: cálculos puros sobre el historial de compras (purchases_v1).
// Cada compra: { id, itemId, name, category, date: 'YYYY-MM-DD', price: number|null, qty, source: 'compra'|'ticket' }
// Antes de este historial la app solo guardaba en cada item la última fecha (lastBought) y el último precio (price);
// eso se usa como respaldo para "última compra" y "precio de la última vez", nunca para inventar intervalos.

const DAY = 86400000;
const toDate = (iso) => new Date(iso + 'T12:00:00');
export const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY);
export const addDays = (iso, n) => new Date(toDate(iso).getTime() + n * DAY).toISOString().slice(0, 10);
export const toPrice = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = typeof v === 'number' ? v : Number(String(v).replace(/[$,\s]/g, ''));
    return Number.isFinite(n) && n > 0 ? n : null;
};
const norm = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();
const keyOf = (p) => p.itemId || 'n:' + norm(p.name);

// Agrega compras al historial. Si el mismo producto ya tiene compra ese día, no se duplica:
// se conserva una sola y el precio leído de un ticket gana sobre el precio guardado.
export const appendPurchases = (log, entries) => {
    const out = [...log];
    for (const e of entries) {
        const k = keyOf(e);
        const idx = out.findIndex((p) => keyOf(p) === k && p.date === e.date);
        if (idx < 0) { out.push(e); continue; }
        const prev = out[idx];
        const useNewPrice = e.price !== null && (prev.price === null || e.source === 'ticket');
        out[idx] = { ...prev, price: useNewPrice ? e.price : prev.price, source: useNewPrice ? e.source : prev.source, qty: e.qty || prev.qty };
    }
    return out;
};

export const purchaseEntry = (item, date, source, price = item.price, qty = item.qty) => ({
    id: `${item.id}-${date}-${source}`,
    itemId: item.id,
    name: item.name,
    category: item.category || 'Otros',
    date,
    price: toPrice(price),
    qty: qty || '',
    source,
});

// Última compra y último precio conocidos de un item (historial primero, luego lo que guardaba el item).
export const lastInfo = (item, log) => {
    const mine = log.filter((p) => keyOf(p) === keyOf({ itemId: item.id, name: item.name }) || (!p.itemId && norm(p.name) === norm(item.name)))
        .sort((a, b) => a.date.localeCompare(b.date));
    const lastLog = mine[mine.length - 1];
    const priced = mine.filter((p) => p.price !== null);
    const lastPriced = priced[priced.length - 1];
    let date = lastLog ? lastLog.date : null;
    if (item.lastBought && (!date || item.lastBought > date)) date = item.lastBought;
    let price = lastPriced ? lastPriced.price : null;
    let priceDate = lastPriced ? lastPriced.date : null;
    if (price === null && toPrice(item.price) !== null) { price = toPrice(item.price); priceDate = item.lastBought || null; }
    return { date, price, priceDate, fromLog: !!lastLog };
};

// Estadísticas por producto, por mes y por categoría.
export const computeRendimientos = (log, items, today) => {
    const itemsById = new Map(items.map((i) => [i.id, i]));
    const groups = new Map();
    for (const p of log) {
        const k = keyOf(p);
        if (!groups.has(k)) groups.set(k, []);
        groups.get(k).push(p);
    }

    const products = [];
    for (const [k, entries] of groups) {
        entries.sort((a, b) => a.date.localeCompare(b.date));
        const item = entries[0].itemId ? itemsById.get(entries[0].itemId) : items.find((i) => norm(i.name) === norm(entries[0].name));
        const dates = [...new Set(entries.map((e) => e.date))];
        const gaps = dates.slice(1).map((d, i) => daysBetween(dates[i], d));
        const every = gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : null;
        const last = dates[dates.length - 1];
        const next = every ? addDays(last, every) : null;
        products.push({
            key: k,
            itemId: item ? item.id : null,
            name: item ? item.name : entries[entries.length - 1].name,
            category: item ? (item.category || 'Otros') : entries[entries.length - 1].category,
            status: item ? item.status : null,
            purchases: dates.length,
            every,
            last,
            next,
            daysLeft: next ? daysBetween(today, next) : null,
            prices: entries.filter((e) => e.price !== null).map((e) => ({ date: e.date, price: e.price })),
        });
    }

    // Productos con compras anteriores al historial: solo sabemos la última.
    const loggedIds = new Set(products.map((p) => p.itemId).filter(Boolean));
    const beforeLog = items.filter((i) => i.lastBought && !loggedIds.has(i.id));

    const months = new Map();
    const categories = new Map();
    const windowStart = addDays(today, -89);
    let unpriced = 0;
    for (const p of log) {
        const m = p.date.slice(0, 7);
        if (!months.has(m)) months.set(m, { month: m, total: 0, purchases: 0, unpriced: 0 });
        const row = months.get(m);
        row.purchases++;
        if (p.price === null) { row.unpriced++; unpriced++; continue; }
        row.total += p.price;
        if (p.date >= windowStart) {
            const c = p.category || 'Otros';
            categories.set(c, (categories.get(c) || 0) + p.price);
        }
    }
    const catTotal = [...categories.values()].reduce((a, b) => a + b, 0);

    const withInterval = products.filter((p) => p.every !== null);
    const runningOut = withInterval
        .filter((p) => p.daysLeft <= 3 && p.itemId && p.status !== 'needed' && p.status !== 'cart')
        .sort((a, b) => a.daysLeft - b.daysLeft);

    return {
        since: log.length ? log.map((p) => p.date).sort()[0] : null,
        totalPurchases: log.length,
        unpriced,
        products: withInterval.sort((a, b) => a.daysLeft - b.daysLeft),
        singles: products.filter((p) => p.every === null).sort((a, b) => b.last.localeCompare(a.last)),
        beforeLog: beforeLog.sort((a, b) => b.lastBought.localeCompare(a.lastBought)),
        months: [...months.values()].sort((a, b) => b.month.localeCompare(a.month)),
        categories: [...categories.entries()].map(([category, total]) => ({ category, total, share: catTotal ? total / catTotal : 0 })).sort((a, b) => b.total - a.total),
        categoryWindowStart: windowStart,
        priceTrends: products.filter((p) => p.prices.length >= 2).sort((a, b) => a.name.localeCompare(b.name, 'es')),
        runningOut,
    };
};

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const fmtDay = (iso) => { if (!iso) return ''; const [, m, d] = iso.split('-'); return `${Number(d)} ${MONTHS[Number(m) - 1]}`; };
export const fmtMonth = (ym) => { const [y, m] = ym.split('-'); return `${MONTHS[Number(m) - 1]} ${y}`; };
export const fmtMoney = (n) => '$' + (Math.round(n * 100) / 100).toLocaleString('es-MX', { minimumFractionDigits: Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2, maximumFractionDigits: 2 });
export const fmtLeft = (d) => d === null ? '' : d < 0 ? `tocaba hace ${-d} ${-d === 1 ? 'día' : 'días'}` : d === 0 ? 'toca hoy' : `en ${d} ${d === 1 ? 'día' : 'días'}`;

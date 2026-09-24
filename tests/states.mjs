// Matriz de estados para el bug hunt: cada estado se abre con los setters expuestos en window.__ms (solo en pruebas).
const LONG = Array.from({ length: 40 }, (_, i) => `${i + 1}. Paso de ejemplo con texto suficientemente largo para ocupar más de una línea en un iPhone.`).join('\n');
const run = (fn) => (page) => page.evaluate(fn);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const STATES = {
    'Lista': run(() => __ms.setTab('shop')),
    'Lista + Finalizar Compra': run(() => __ms.setTab('shop')),
    'Lista tras Finalizar (toast Deshacer)': run(() => { __ms.setTab('inv'); __ms.setUndoSnapshot({ items: __ms.items, label: '7 productos a Casa' }); }),
    'Lista + barra + toast': run(() => { __ms.setTab('shop'); __ms.setUndoSnapshot({ items: __ms.items, label: 'Borrado' }); }),
    'Lista agrupada por categoría': run(() => { __ms.setTab('shop'); __ms.setGroupByPlace(true); }),
    'Lista búsqueda sin resultados': run(() => { __ms.setTab('shop'); __ms.setSearchQuery('zzz'); }),
    'Casa': run(() => __ms.setTab('inv')),
    'Casa agrupada': run(() => { __ms.setTab('inv'); __ms.setGroupByPlace(true); }),
    'Casa Mari Kondo': run(() => { __ms.setTab('inv'); __ms.setInvFilter('MariKondo'); }),
    'Casa Agotados': run(() => { __ms.setTab('inv'); __ms.setInvFilter('Agotados'); }),
    'Historial': run(() => __ms.setTab('hist')),
    'Rendimientos sin historial': run(() => { __ms.setTab('hist'); __ms.setHistView('rend'); }),
    'Rendimientos con historial de ejemplo': async (page) => { await page.evaluate((log) => { __ms.setPurchases(log); __ms.setTab('hist'); __ms.setHistView('rend'); }, exampleLog()); },
    'Modal Ajustes': run(() => __ms.setModal('settings')),
    'Hoja Agregar': run(() => __ms.setAddOpen(true)),
    'Modal Editar': run(() => __ms.openEdit(__ms.items[1])),
    'Modal Dictado con resultado largo': async (page) => { await page.evaluate(() => __ms.setModal('dictate')); await page.evaluate((L) => __ms.setResult(L), LONG); },
    'Modal Chef con receta larga': async (page) => { await page.evaluate(() => __ms.setModal('chef')); await page.evaluate((L) => __ms.setResult(L), LONG); },
    'Ver item': run(() => __ms.openView(__ms.items[4])),
    'Modal Sugerencias': run(() => __ms.setModal('suggest')),
    'Confirmación': run(() => __ms.setConfirmData({ isOpen: true, msg: '¿Mover 7 productos a Casa?', action: () => {}, actionText: 'Finalizar Compra' })),
    'Onboarding bienvenida': run(() => __ms.setOnboarded(false)),
    'Onboarding crear': run(() => { __ms.setOnboarded(false); __ms.setObStep('create'); }),
    'Onboarding unirme': run(() => { __ms.setOnboarded(false); __ms.setObStep('join'); }),
    'Receta paso a paso': run(() => __ms.setRecipeWizard({ title: 'Pasta con aceite de trufa', steps: ['Hierve agua con sal. '.repeat(30), 'Paso 2'], step: 0 })),
};

// Historial de ejemplo (fechas y precios inventados sobre nombres reales del fixture) solo para pruebas de layout.
export const exampleLog = (today = new Date().toISOString().slice(0, 10)) => {
    const day = (n) => new Date(new Date(today + 'T12:00:00').getTime() - n * 86400000).toISOString().slice(0, 10);
    const base = [['fx1', 'Aceite de oliva', 'Aceites', 21, 189, 20], ['fx2', 'Aceite de uva', 'Aceites', 30, 120, 33], ['fx4', 'Aceite de ajonjolí tostado', 'Aceites', 45, 95, 2], ['fx5', 'Aceite de coco extra virgen San Lucas', 'Aceites', 14, 150, 13]];
    const log = [];
    for (const [id, name, category, every, price, offset] of base) {
        for (let k = 3; k >= 0; k--) log.push({ id: `${id}-${k}`, itemId: id, name, category, date: day(k * every + offset), price: price + (3 - k) * 4, qty: '', source: k % 2 ? 'ticket' : 'compra' });
    }
    return log;
};

export const VIEWPORTS = {
    'app instalada (844, safe-area 47/34)': { vh: 844, safeArea: { top: 47, bottom: 34 } },
    'Safari con barra (750)': { vh: 750, safeArea: { top: 47, bottom: 0 } },
    'teclado abierto (508)': { vh: 508, safeArea: { top: 47, bottom: 34 } },
};

export { wait };

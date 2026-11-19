// Tickets de compra (v31): fotos ligadas a cada compra finalizada.
// - tickets_v1 (localStorage): [{ id, date, ts, count, fotos: [url], pendientes: n }]
// - Fotos sin subir viven en IndexedDB (mi-super-tickets) hasta que haya red; no se pierden.

export const TK_MAX_FOTOS = 6;
const DB = 'mi-super-tickets';
const STORE = 'pend';

export const ticketPath = (groupId, compraId, n) => `tickets/${groupId}/${compraId}-${n}.jpeg`;
export const newCompraId = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

export const newTicket = (id, date, count, nFotos) => ({ id, date, ts: Date.now(), count, fotos: [], pendientes: nFotos });

// Una foto subida: la pasa de pendiente a lista de URLs.
export const addFoto = (log, id, url) => log.map((t) => (t.id === id ? { ...t, fotos: t.fotos.includes(url) ? t.fotos : [...t.fotos, url], pendientes: Math.max(0, t.pendientes - 1) } : t));

export const ticketsDe = (log, date) => log.filter((t) => t.date === date && (t.fotos.length || t.pendientes));

const open = () => new Promise((res, rej) => {
    if (typeof indexedDB === 'undefined') return rej(new Error('sin IndexedDB'));
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'key' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
});
const tx = async (mode, fn) => {
    const db = await open();
    return new Promise((res, rej) => {
        const t = db.transaction(STORE, mode);
        const out = fn(t.objectStore(STORE));
        t.oncomplete = () => { db.close(); res(out && 'result' in out ? out.result : undefined); };
        t.onerror = () => { db.close(); rej(t.error); };
    });
};
// foto = { mime, data(base64) }
export const guardarPend = (compraId, groupId, fotos) => tx('readwrite', (s) => { fotos.forEach((f, i) => s.put({ key: `${compraId}-${i + 1}`, compraId, groupId, n: i + 1, mime: f.mime, data: f.data })); });
export const listarPend = () => tx('readonly', (s) => s.getAll());
export const borrarPend = (key) => tx('readwrite', (s) => { s.delete(key); });

export const b64ToBlob = (data, mime) => {
    const bin = atob(data); const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return new Blob([u], { type: mime || 'image/jpeg' });
};

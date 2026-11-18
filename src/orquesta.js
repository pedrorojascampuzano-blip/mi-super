// Escribirle a la orquesta desde Mi Súper (v29). Funciones puras: sin React ni DOM, para probarlas en Node.
//
// Camino: POST {colector}/report con project «misuper». El vigilante de Faro barre el colector y
// emite un evento `ticktrack` por cada reporte; llega a la orquesta como captura. Con la llave de
// TickTrack en Ajustes, además POST /orquesta con code = fila de Mi Súper (queda ligada de una vez).
// Respuesta: GET /reports?project=misuper. status `done` = la orquesta cerró; `reply` trae el texto.

export const ORQ_COLECTOR = 'https://anvil.tail8be012.ts.net/ticktack';
export const ORQ_PROYECTO = 'misuper';
export const ORQ_FILA = 'PERS-misuper-orquesta';
export const ORQ_MAX_TEXTO = 4000;
export const ORQ_MAX_FOTOS = 3;
const KEY_MSGS = 'orq_msgs_v1';
const MAX_MSGS = 30;

// Texto del reporte: lo que escribió Pedro, tal cual. Sin texto pero con foto, una línea que lo diga.
export const reportBody = ({ texto = '', shots = [], url = '', viewport = '' }) => {
    const note = String(texto).trim().slice(0, ORQ_MAX_TEXTO);
    const fotos = shots.filter((s) => s && s.data).slice(0, ORQ_MAX_FOTOS)
        .map((s, i) => ({ data: s.data, mime: s.mime || 'image/jpeg', ref: `foto ${i + 1}` }));
    const body = {
        note: note || (fotos.length ? 'Captura desde Mi Súper (sin texto).' : ''),
        type: 'feature', project: ORQ_PROYECTO, url, via: 'misuper-app',
        shots: fotos, context: { viewport, app: 'mi-super' },
    };
    return body;
};

// ¿Se puede mandar? Texto o al menos una foto.
export const canSend = (texto, shots = []) => !!(String(texto).trim() || shots.length);

// Estado visible de un mensaje a partir del reporte que devuelve el colector.
export const estadoDe = (rep) => {
    if (!rep) return 'enviado';
    if (rep.status === 'done') return 'atendido';
    if (rep.status === 'wontfix') return 'descartado';
    return 'enviado';
};

export const ESTADO_TXT = { pendiente: 'Sin enviar', enviado: 'Enviado · esperando', atendido: 'Respondió la orquesta', descartado: 'Descartado' };

// Mezcla la lista de reportes del colector con los mensajes guardados. No pierde lo local.
export const mergeEstados = (msgs, reports) => {
    const por = new Map((reports || []).map((r) => [r.dir, r]));
    return msgs.map((m) => {
        if (m.estado === 'pendiente' || !m.id) return m;
        const r = por.get(m.id);
        if (!r) return m;
        const estado = estadoDe(r);
        const respuesta = String(r.reply || r.respuesta || '').trim();
        return { ...m, estado, respuesta: respuesta || m.respuesta || '', visto: m.visto && m.estado === estado ? true : false };
    });
};

export const loadMsgs = (store = globalThis.localStorage) => {
    try { const v = JSON.parse(store.getItem(KEY_MSGS)); return Array.isArray(v) ? v : []; } catch { return []; }
};

// Guarda; si el almacenamiento se llena (fotos), reintenta sin las fotos de los pendientes.
export const saveMsgs = (msgs, store = globalThis.localStorage) => {
    const lista = msgs.slice(0, MAX_MSGS);
    try { store.setItem(KEY_MSGS, JSON.stringify(lista)); return true; } catch {
        try { store.setItem(KEY_MSGS, JSON.stringify(lista.map((m) => ({ ...m, shots: undefined })))); return true; } catch { return false; }
    }
};

export const newPending = (texto, shots, now = Date.now()) => ({ id: '', local: 'l' + now.toString(36), texto: String(texto).trim(), shots, at: now, estado: 'pendiente', respuesta: '' });

// Manda un mensaje. `f` = fetch (inyectable). Devuelve { ok, id?, ligado?, error? }.
export const sendMsg = async ({ texto, shots, url, viewport, llave = '', f = globalThis.fetch }) => {
    if (!canSend(texto, shots)) return { ok: false, error: 'Escribe algo o agrega una foto.' };
    let r;
    try {
        const res = await f(ORQ_COLECTOR + '/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reportBody({ texto, shots, url, viewport })) });
        r = await res.json();
        if (!res.ok || !r.ok) return { ok: false, error: r.error || `El colector respondió ${res.status}.` };
    } catch { return { ok: false, error: 'No hay conexión con la orquesta. Queda guardado para reintentar.' }; }
    let ligado = false;
    if (llave) {
        try {
            const res = await f(ORQ_COLECTOR + '/orquesta', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-TT-Key': llave }, body: JSON.stringify({ dir: r.dir, code: ORQ_FILA }) });
            const j = await res.json();
            ligado = !!(res.ok && j.ok);
        } catch { /* el reporte ya salió; el vigilante lo recoge igual */ }
    }
    return { ok: true, id: r.dir, ligado };
};

// Pide el estado de los reportes de Mi Súper. Devuelve la lista o null si no hay red.
export const fetchReports = async (f = globalThis.fetch) => {
    try {
        const res = await f(ORQ_COLECTOR + '/reports?project=' + ORQ_PROYECTO);
        if (!res.ok) return null;
        const j = await res.json();
        return Array.isArray(j.reports) ? j.reports : null;
    } catch { return null; }
};

// Imagen → JPEG chico (lado largo ≤ 1280) en base64 sin prefijo. `loadImg`/`draw` se inyectan en pruebas.
export const shrinkDims = (w, h, max = 1280) => { const k = Math.min(1, max / Math.max(w, h)); return [Math.round(w * k), Math.round(h * k)]; };

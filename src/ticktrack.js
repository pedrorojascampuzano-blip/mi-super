// TickTrack en Mi Súper (v30): botón flotante de la skill /ticktrack (captura, voz, capturas de pantalla).
// Solo se carga en el teléfono de Pedro (la misma marca orq_on que «Escribirle a la orquesta»).
// Si no hay red o la tailnet no responde, no pasa nada: la app no depende del widget y, si el widget ya
// cargó antes, el service worker lo sirve de caché y TickTrack guarda sus reportes y los reenvía solo.

export const TT_BASE = 'https://anvil.tail8be012.ts.net/ticktack';
export const TT_PROYECTO = 'misuper';
export const TT_CSS_ID = 'ms-tt-pos';

// El botón vive arriba a la derecha (el encabezado de las tres pestañas está vacío ahí), lejos de la barra
// inferior: abajo están el buscador, «Más», los filtros, las pestañas y el «+», y todo eso es del pulgar.
export const ttCss = () => [
    '.tt-fab{top:calc(var(--sat, 0px) + 8px) !important;bottom:auto !important;right:12px !important;opacity:.92}',
    '#tt-qbub{top:calc(var(--sat, 0px) + 60px) !important;bottom:auto !important;right:12px !important;flex-wrap:wrap !important}',
    '#tt-qdock{top:calc(var(--sat, 0px) + 8px) !important;bottom:auto !important;right:64px !important;left:12px !important;width:auto !important;max-height:none !important}',
    '.tt-panel{top:calc(var(--sat, 0px) + 60px) !important;bottom:calc(var(--sab, 0px) + 12px) !important;right:12px !important;max-height:none !important}',
    'body.ms-sheet-open .tt-fab{display:none !important}',
].join('\n');

export const ttCargar = (doc = document) => {
    if (doc.getElementById('ms-tt-script')) return null;
    // La llave de Ajustes (orq_key) es la misma del colector: el widget la lee de tt_key para «→ Orquesta».
    try { const k = localStorage.getItem('orq_key'); if (k && localStorage.getItem('tt_key') !== k) localStorage.setItem('tt_key', k); } catch { /* sin almacenamiento */ }
    const st = doc.createElement('style'); st.id = TT_CSS_ID; st.textContent = ttCss(); doc.head.appendChild(st);
    const s = doc.createElement('script');
    s.id = 'ms-tt-script'; s.async = true; s.src = TT_BASE + '/ticktack.js';
    s.onload = () => { try { window.TickTrack && window.TickTrack.init({ endpoint: TT_BASE + '/report', project: TT_PROYECTO, lang: 'es-MX', hotkey: false }); } catch { /* sin widget no pasa nada */ } };
    s.onerror = () => { s.remove(); };   // sin red: la app sigue igual
    doc.head.appendChild(s);
    return s;
};

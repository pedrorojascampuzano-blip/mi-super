import { listShareText } from './lib.js';

const { useState, useEffect, useRef } = React;

const Icon = ({ name, size = 20, className = "" }) => {
    const i = {
        Plus: <path d="M12 5v14M5 12h14" />,
        ShoppingBag: <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />,
        Home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />,
        History: <path d="M12 8v4l3 3 M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />,
        Check: <polyline points="20 6 9 17 4 12" />,
        Trash: <path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
        Mic: <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8" />,
        Settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
        Sparkles: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
        Chef: <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z M6 17h12" />,
        X: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        ArrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
        Tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
        Clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
        Upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />,
        Download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />,
        Stop: <rect x="6" y="6" width="12" height="12" />,
        Camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
        Edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
        Star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
        Archive: <><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></>,
        Search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
        Layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
        AlertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
        Copies: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
        Share: <><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></>
    };
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{i[name]}</svg>;
};

// App version — bumpear cada vez que se publica una versión nueva.
// Aparece visible en el header con un botón "↻ refrescar" que limpia
// el cache del SW y recarga, para que Pedro pueda forzar update sin
// tener que matar la PWA manualmente.
const APP_VERSION = '24';

// Hoja inferior única para todos los modales: cabecera fija, cuerpo con scroll propio y pie fijo.
// Vive dentro de #root, que sigue al visualViewport, así que el teclado nunca tapa el pie.
const Sheet = ({ title, onClose, footer, children, z = 50, testid }) => (
    <div className="ms-overlay" style={{ zIndex: z }} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
        <div className="ms-sheet" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} data-testid={testid}>
            {(title || onClose) && (
                <div className="ms-sheet-head">
                    <h2 className="serif ms-sheet-title min-w-0">{title}</h2>
                    {onClose && <button onClick={onClose} aria-label="Cerrar" className="ms-icon-btn" style={{ color: 'var(--ink-2)' }}><Icon name="X" size={22}/></button>}
                </div>
            )}
            {children ? <div className={`ms-sheet-body ${footer ? '' : 'no-foot'}`} data-testid="sheet-body">{children}</div> : null}
            {footer && <div className="ms-sheet-foot">{footer}</div>}
        </div>
    </div>
);

const hardRefresh = async () => {
    try {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (const r of regs) await r.unregister();
        }
        if (window.caches) {
            const keys = await caches.keys();
            for (const k of keys) await caches.delete(k);
        }
    } catch (e) { console.error('hardRefresh', e); }
    // Bypass cache reload
    location.href = location.pathname + '?cb=' + Date.now();
};

const SuperApp = () => {
    const [key, setKey] = useState(()=>localStorage.getItem('gem_key')||'');
    const [dsKey, setDsKey] = useState(()=>localStorage.getItem('ds_key')||'');
    const [claudeKey, setClaudeKey] = useState(()=>localStorage.getItem('cl_key')||'');
    const [openaiKey, setOpenaiKey] = useState(()=>localStorage.getItem('oa_key')||'');
    const [tab, setTab] = useState('shop'); 
    const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('data_v4')) || []; } catch { return []; } });
    const [savedTags, setSavedTags] = useState(() => { try { return JSON.parse(localStorage.getItem('saved_tags')) || ['General', 'Costco', 'Super', 'Mercado', 'Oxxo']; } catch { return ['General', 'Costco', 'Super', 'Mercado', 'Oxxo']; } });
    const [name, setName] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [selTags, setSelTags] = useState(['General']);
    const [filter, setFilter] = useState('Todos'); 
    const [invFilter, setInvFilter] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // name | recent | expiry | price
    const [groupByPlace, setGroupByPlace] = useState(false);
    const [modal, setModal] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);
    const [viewItemPhotos, setViewItemPhotos] = useState([]);
    const [confirmData, setConfirmData] = useState({ isOpen: false, msg: '', action: null, altAction: null, altText: '' });
    const recognitionRef = useRef(null);

    const categories = ['Alimentos', 'Medicamentos', 'Limpieza', 'Hogar', 'Mascotas', 'Otros'];

    const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now() + '_' + Math.random().toString(36).slice(2));
    const todayISO = () => new Date().toISOString().slice(0, 10);
    const nicknameOf = (uid) => {
        if (!uid) return null;
        const m = members.find(x => x.member_id === uid);
        return m?.nickname || 'alguien';
    };
    const relativeTime = (iso) => {
        if (!iso) return '';
        const now = Date.now();
        const t = new Date(iso).getTime();
        if (isNaN(t)) return '';
        const s = Math.max(0, Math.round((now - t) / 1000));
        if (s < 60) return 'hace unos segundos';
        const m = Math.round(s / 60);
        if (m < 60) return `hace ${m} min`;
        const h = Math.round(m / 60);
        if (h < 24) return `hace ${h} h`;
        const d = Math.round(h / 24);
        return `hace ${d} d`;
    };
    const [undoSnapshot, setUndoSnapshot] = useState(null);
    const [notice, setNotice] = useState(null);
    const noticeTimerRef = useRef(null);
    const showToast = (msg) => { setNotice(msg); clearTimeout(noticeTimerRef.current); noticeTimerRef.current = setTimeout(() => setNotice(null), 2500); };
    const undoTimerRef = useRef(null);
    const [onboarded, setOnboarded] = useState(() => localStorage.getItem('onboarded_v1') === '1');
    const [recipeWizard, setRecipeWizard] = useState(null); // { title, steps, step }

    const TODAY_RECIPE = {
        title: "Arroz con pollo — Instant Pot",
        steps: [
            "Corta el pollo en trozos medianos. Sazona con sal, pimienta y ajo en polvo por todos lados.",
            "Pon el Instant Pot en modo Sauté. Agrega un chorrito de aceite y espera que caliente.",
            "Dora el pollo 3-4 minutos por lado hasta que esté sellado. No muevas mucho.",
            "Enjuaga 1.5 tazas de arroz bajo el chorro hasta que el agua salga clara.",
            "Agrega el arroz encima del pollo. Vierte 2 tazas de agua (o caldo) y mezcla un poco.",
            "Cierra la tapa del Instant Pot. Presión alta (High), 8 minutos.",
            "Cuando termine, deja en Natural Release 5 minutos. Luego mueve la válvula a Vent.",
            "Abre, esponja el arroz con un tenedor. Listo."
        ]
    };

    const parseRecipeSteps = (text) => {
        if (!text) return [];
        const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
        const steps = [];
        for (const line of lines) {
            const m = line.match(/^(?:\d+[\.\)]\s*)?(.+)$/);
            if (m && m[1].length > 10) steps.push(m[1]);
        }
        return steps.length >= 2 ? steps : [];
    };

    const openRecipeWizard = (title, steps) => {
        setRecipeWizard({ title, steps, step: 0 });
    };
    const [googleUser, setGoogleUser] = useState(null);
    const [updateReady, setUpdateReady] = useState(false);

    useEffect(() => {
        const onUpdate = () => setUpdateReady(true);
        window.addEventListener('sw-update-available', onUpdate);
        return () => window.removeEventListener('sw-update-available', onUpdate);
    }, []);

    const applyUpdate = () => {
        const w = window.__swWaiting;
        if (w) w.postMessage({ type: 'SKIP_WAITING' });
        else window.location.reload();
    };
    const [obStep, setObStep] = useState('welcome');
    const [obName, setObName] = useState('');
    const [obNick, setObNick] = useState('');
    const [obCode, setObCode] = useState('');
    const [obError, setObError] = useState(null);
    const [obLoading, setObLoading] = useState(false);
    const [obShareCode, setObShareCode] = useState(null);
    const [obShareName, setObShareName] = useState(null);

    // ─── Cloud sync state ───
    const cloudConfigured = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
    const [groupId, setGroupId] = useState(() => localStorage.getItem('cloud_group_id') || null);
    const [groupCode, setGroupCode] = useState(() => localStorage.getItem('cloud_group_code') || null);
    const [groupName, setGroupName] = useState(() => localStorage.getItem('cloud_group_name') || null);
    const [nickname, setNickname] = useState(() => localStorage.getItem('cloud_nickname') || '');
    const [members, setMembers] = useState([]);
    const [syncStatus, setSyncStatus] = useState('offline'); // 'offline' | 'connecting' | 'online' | 'error'
    const cloudMode = cloudConfigured && !!groupId;
    const sbRef = useRef(null);
    const lastSyncedRef = useRef(items);
    const remoteApplyRef = useRef(false);
    const channelRef = useRef(null);

    useEffect(() => {
        if (cloudConfigured && !sbRef.current) {
            sbRef.current = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
        }
        if (sbRef.current) {
            sbRef.current.auth.getSession().then(({ data }) => {
                const session = data.session;
                if (!session) { sbRef.current.auth.signInAnonymously(); return; }
                const provider = session.user?.app_metadata?.provider;
                if (provider === 'google') {
                    setGoogleUser(session.user);
                    const meta = session.user.user_metadata;
                    if (meta?.cloud_group_id && !localStorage.getItem('cloud_group_id')) {
                        setGroupId(meta.cloud_group_id);
                        setGroupCode(meta.cloud_group_code || null);
                        setGroupName(meta.cloud_group_name || 'Mi grupo');
                        localStorage.setItem('onboarded_v1', '1');
                        setOnboarded(true);
                    }
                }
            });
        }
    }, []);

    useEffect(() => { localStorage.setItem('data_v4', JSON.stringify(items)); }, [items]);
    useEffect(() => { localStorage.setItem('saved_tags', JSON.stringify(savedTags)); }, [savedTags]);
    useEffect(() => { localStorage.setItem('gem_key', key); }, [key]);
    useEffect(() => { localStorage.setItem('ds_key', dsKey); }, [dsKey]);
    useEffect(() => { localStorage.setItem('cl_key', claudeKey); }, [claudeKey]);
    useEffect(() => { localStorage.setItem('oa_key', openaiKey); }, [openaiKey]);
    useEffect(() => { groupId ? localStorage.setItem('cloud_group_id', groupId) : localStorage.removeItem('cloud_group_id'); }, [groupId]);
    useEffect(() => { groupCode ? localStorage.setItem('cloud_group_code', groupCode) : localStorage.removeItem('cloud_group_code'); }, [groupCode]);
    useEffect(() => { groupName ? localStorage.setItem('cloud_group_name', groupName) : localStorage.removeItem('cloud_group_name'); }, [groupName]);
    useEffect(() => { nickname ? localStorage.setItem('cloud_nickname', nickname) : localStorage.removeItem('cloud_nickname'); }, [nickname]);

    // ─── Cloud: initial fetch + realtime subscription ───
    useEffect(() => {
        if (!cloudMode || !sbRef.current) return;
        const sb = sbRef.current;
        let alive = true;
        setSyncStatus('connecting');

        const itemFromRow = (r) => ({
            id: r.id, name: r.name, places: r.places || ['General'], category: r.category || 'Otros',
            status: r.status, isEssential: !!r.is_essential, lastBought: r.last_bought,
            qty: r.qty || '', price: r.price ?? '', expiry: r.expiry || '',
            expiryType: r.expiry_type || '',
            photoUrl: r.photo_url || '',
            extraPhotoUrls: r.extra_photo_urls || [],
            unitCount: r.unit_count ?? null, unitSize: r.unit_size ?? null, unitType: r.unit_type || '',
            purchaseAt: r.purchase_at || '',
            updatedBy: r.updated_by, updatedAt: r.updated_at
        });

        const isUuid = (s) => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

        (async () => {
            const [{ data: rows, error: e1 }, { data: tagRows }, { data: memberRows }] = await Promise.all([
                sb.from('items').select('*').eq('group_id', groupId),
                sb.from('saved_tags').select('tag').eq('group_id', groupId),
                sb.from('group_members').select('member_id, nickname').eq('group_id', groupId),
            ]);
            if (!alive) return;
            if (e1) { setSyncStatus('error'); return; }
            const fetched = (rows || []).map(itemFromRow);
            const cloudIds = new Set(fetched.map(i => i.id));
            // Migrate local-only items into the group: keep them, regenerate non-UUID ids
            const localOnly = items.filter(i => !cloudIds.has(i.id)).map(i => isUuid(i.id) ? i : { ...i, id: newId() });
            const merged = [...fetched, ...localOnly];
            lastSyncedRef.current = fetched; // localOnly will be detected by diff and pushed
            if (localOnly.length === 0) remoteApplyRef.current = true;
            setItems(merged);
            if (tagRows && tagRows.length) setSavedTags(prev => Array.from(new Set(['General', ...prev, ...tagRows.map(t => t.tag)])));
            setMembers(memberRows || []);
            setSyncStatus('online');
        })();

        channelRef.current = sb.channel(`group:${groupId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `group_id=eq.${groupId}` }, async () => {
                const { data } = await sb.from('items').select('*').eq('group_id', groupId);
                if (!alive || !data) return;
                const fetched = data.map(itemFromRow);
                remoteApplyRef.current = true;
                lastSyncedRef.current = fetched;
                setItems(fetched);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${groupId}` }, async () => {
                const { data } = await sb.from('group_members').select('member_id, nickname').eq('group_id', groupId);
                if (alive && data) setMembers(data);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'saved_tags', filter: `group_id=eq.${groupId}` }, async () => {
                const { data } = await sb.from('saved_tags').select('tag').eq('group_id', groupId);
                if (alive && data) setSavedTags(prev => Array.from(new Set(['General', ...prev.filter(t => t !== 'General'), ...data.map(d => d.tag)])));
            })
            .subscribe();

        return () => {
            alive = false;
            if (channelRef.current) { sb.removeChannel(channelRef.current); channelRef.current = null; }
        };
    }, [cloudMode, groupId]);

    // ─── Cloud: diff items vs last synced and push changes ───
    useEffect(() => {
        if (!cloudMode || !sbRef.current) return;
        if (remoteApplyRef.current) { remoteApplyRef.current = false; return; }
        const sb = sbRef.current;
        const prev = lastSyncedRef.current;
        const prevMap = new Map(prev.map(i => [i.id, i]));
        const nextMap = new Map(items.map(i => [i.id, i]));
        const toUpsert = [];
        const toDelete = [];
        for (const [id, it] of nextMap) {
            const p = prevMap.get(id);
            if (!p || JSON.stringify(p) !== JSON.stringify(it)) toUpsert.push(it);
        }
        for (const id of prevMap.keys()) if (!nextMap.has(id)) toDelete.push(id);
        if (toUpsert.length === 0 && toDelete.length === 0) return;

        (async () => {
            try {
                if (toUpsert.length) {
                    const rows = toUpsert.map(i => ({
                        id: i.id, group_id: groupId, name: i.name, places: i.places,
                        category: i.category, status: i.status, is_essential: !!i.isEssential,
                        last_bought: i.lastBought || null, qty: i.qty || '',
                        price: i.price === '' || i.price == null ? null : Number(i.price),
                        expiry: i.expiry || null,
                        photo_url: i.photoUrl || null,
                        extra_photo_urls: i.extraPhotoUrls || [],
                        unit_count: i.unitCount == null || i.unitCount === '' ? null : Number(i.unitCount),
                        unit_size:  i.unitSize  == null || i.unitSize  === '' ? null : Number(i.unitSize),
                        unit_type:  i.unitType  || null,
                        purchase_at: i.purchaseAt || null,
                        expiry_type: i.expiryType || null
                    }));
                    const { error } = await sb.from('items').upsert(rows);
                    if (error) throw error;
                }
                if (toDelete.length) {
                    const { error } = await sb.from('items').delete().in('id', toDelete);
                    if (error) throw error;
                }
                lastSyncedRef.current = items;
                setSyncStatus('online');
            } catch (e) {
                console.error('sync failed', e);
                setSyncStatus('error');
            }
        })();
    }, [items, cloudMode, groupId]);

    // Re-attempt sync when network returns
    useEffect(() => {
        if (!cloudMode) return;
        const onOnline = () => { setSyncStatus('connecting'); lastSyncedRef.current = []; setItems(prev => [...prev]); };
        window.addEventListener('online', onOnline);
        return () => window.removeEventListener('online', onOnline);
    }, [cloudMode]);

    // ─── Cloud: group operations ───
    const cloudCreateGroup = async (gName, gNick) => {
        const sb = sbRef.current; if (!sb) return { error: 'Supabase no inicializado' };
        await sb.auth.getSession().then(({ data }) => { if (!data.session) return sb.auth.signInAnonymously(); });
        const { data, error } = await sb.rpc('create_group', { p_name: gName, p_nickname: gNick });
        if (error) return { error: error.message };
        const row = Array.isArray(data) ? data[0] : data;
        setGroupName(gName); setNickname(gNick);
        setGroupId(row.group_id); setGroupCode(row.code);
        sb.auth.getSession().then(({ data: s }) => {
            if (s.session?.user?.app_metadata?.provider === 'google')
                sb.auth.updateUser({ data: { cloud_group_id: row.group_id, cloud_group_code: row.code, cloud_group_name: gName } });
        });
        return { code: row.code };
    };

    const cloudJoinGroup = async (code, gNick) => {
        const sb = sbRef.current; if (!sb) return { error: 'Supabase no inicializado' };
        await sb.auth.getSession().then(({ data }) => { if (!data.session) return sb.auth.signInAnonymously(); });
        const { data, error } = await sb.rpc('join_group', { p_code: code.trim().toUpperCase(), p_nickname: gNick });
        if (error) return { error: error.message };
        const { data: g } = await sb.from('groups').select('name').eq('id', data).single();
        setGroupName(g?.name || 'Grupo'); setGroupCode(code.trim().toUpperCase()); setNickname(gNick);
        setGroupId(data);
        sb.auth.getSession().then(({ data: s }) => {
            if (s.session?.user?.app_metadata?.provider === 'google')
                sb.auth.updateUser({ data: { cloud_group_id: data, cloud_group_code: code.trim().toUpperCase(), cloud_group_name: g?.name || 'Grupo' } });
        });
        return { ok: true };
    };

    const signInWithGoogle = async () => {
        const sb = sbRef.current; if (!sb) return;
        await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href.split('#')[0] } });
    };

    const cloudLeaveGroup = () => {
        if (channelRef.current && sbRef.current) { sbRef.current.removeChannel(channelRef.current); channelRef.current = null; }
        setGroupId(null); setGroupCode(null); setGroupName(null);
        setMembers([]); setSyncStatus('offline');
        lastSyncedRef.current = [];
    };

    const cloudUploadLocal = async () => {
        const sb = sbRef.current; if (!sb || !groupId) return;
        const localItems = items;
        if (!localItems.length) return;
        const isUuid = (s) => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
        const normalized = localItems.map(i => isUuid(i.id) ? i : { ...i, id: newId() });
        const rows = normalized.map(i => ({
            id: i.id, group_id: groupId, name: i.name, places: i.places,
            category: i.category, status: i.status, is_essential: !!i.isEssential,
            last_bought: i.lastBought || null, qty: i.qty || '',
            price: i.price === '' || i.price == null ? null : Number(i.price),
            expiry: i.expiry || null
        }));
        const { error } = await sb.from('items').upsert(rows);
        if (!error) {
            setItems(normalized);
            lastSyncedRef.current = normalized;
        }
        return { error: error?.message };
    };

    const handleSmartDelete = (item) => {
        if (item.status === 'stocked') {
            setConfirmData({
                isOpen: true,
                msg: `¿Qué pasó con ${item.name}?`,
                action: () => { 
                    setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: item.isEssential ? 'needed' : 'inactive' } : i));
                    setConfirmData({ isOpen: false });
                },
                actionText: item.isEssential ? "Falta (Esencial)" : "Se acabó (Guardar)",
                altAction: () => { 
                    setItems(prev => prev.filter(i => i.id !== item.id));
                    setConfirmData({ isOpen: false });
                },
                altText: "Borrar Definitivo"
            });
        } else if (item.status === 'inactive') {
             setConfirmData({
                isOpen: true,
                msg: `¿Borrar definitivamente del historial?`,
                action: () => { 
                    setItems(prev => prev.filter(i => i.id !== item.id));
                    setConfirmData({ isOpen: false });
                },
                actionText: "Sí, borrar",
                altAction: () => setConfirmData({ isOpen: false }),
                altText: "Cancelar"
            });
        } else {
            setConfirmData({
                isOpen: true,
                msg: '¿Eliminar de la lista?',
                action: () => { setItems(prev => prev.filter(i => i.id !== item.id)); setConfirmData({ isOpen: false }); },
                actionText: "Eliminar"
            });
        }
    };

    const requestCheckout = () => {
        const count = items.filter(i => i.status === 'cart').length;
        if (count === 0) return;
        setConfirmData({
            isOpen: true,
            msg: `¿Mover ${count} productos a Casa?`,
            action: () => {
                const snapshot = items;
                setItems(prev => prev.map(i => i.status === 'cart' ? { ...i, status: 'stocked', lastBought: todayISO() } : i));
                setTab('inv');
                setConfirmData({ isOpen: false });
                if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                setUndoSnapshot({ items: snapshot, label: `${count} productos a Casa` });
                undoTimerRef.current = setTimeout(() => setUndoSnapshot(null), 5000);
            },
            actionText: "Finalizar compra"
        });
    };

    const handleExportCSV = () => {
        const headers = ["ID,Nombre,Lugares,Categoria,Estado,Esencial,UltimaCompra,Cantidad,Precio,Caducidad"];
        const rows = items.map(i => 
            `${i.id},"${i.name.replace(/"/g, '""')}","${i.places.join('|')}","${i.category||'Otros'}","${i.status}","${i.isEssential?'Si':'No'}","${i.lastBought||''}","${i.qty||''}","${i.price||''}","${i.expiry||''}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `misuper_backup_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const parseCSVLine = (line) => {
        const out = []; let cur = ''; let q = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (q) {
                if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
                else if (ch === '"') { q = false; }
                else { cur += ch; }
            } else {
                if (ch === ',') { out.push(cur); cur = ''; }
                else if (ch === '"' && cur === '') { q = true; }
                else { cur += ch; }
            }
        }
        out.push(cur);
        return out;
    };

    const handleImportCSV = (e) => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = (evt) => {
            const lines = evt.target.result.split(/\r?\n/);
            const validStatuses = ['needed', 'cart', 'stocked', 'inactive'];
            const n = lines.slice(1).map(line => {
                if (!line.trim()) return null;
                const c = parseCSVLine(line);
                if (!c[1]) return null;
                const status = validStatuses.includes(c[4]) ? c[4] : 'stocked';
                return {
                    id: newId(),
                    name: c[1] || 'Item',
                    places: c[2] ? c[2].split('|').filter(Boolean) : ['General'],
                    category: c[3] || 'Otros',
                    status,
                    isEssential: c[5] === 'Si',
                    lastBought: c[6] || null,
                    qty: c[7] || '',
                    price: c[8] || '',
                    expiry: c[9] || ''
                };
            }).filter(Boolean);
            if (n.length) {
                setConfirmData({
                    isOpen: true,
                    msg: `¿Importar ${n.length} productos?`,
                    action: () => { setItems(prev => [...prev, ...n]); setConfirmData({ isOpen: false }); },
                    actionText: "Importar"
                });
            }
        };
        r.readAsText(f); e.target.value = '';
    };

    // --- IA LOGIC (DeepSeek + Gemini, structured output) ---
    // ─── AI provider functions ───
    const callGemini = async (textPrompt, imageData, wantJson) => {
        const parts = [{ text: textPrompt }];
        if (imageData) parts.push({ inline_data: { mime_type: imageData.mime, data: imageData.data } });
        const body = { contents: [{ parts }] };
        if (wantJson) body.generationConfig = { responseMimeType: "application/json" };
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'Gemini error');
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    };

    const callDeepSeek = async (textPrompt, imageData, wantJson) => {
        if (imageData) throw new Error('DeepSeek no soporta imágenes');
        const body = {
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "Eres un asistente de inventario experto." },
                { role: "user", content: textPrompt }
            ],
            stream: false
        };
        if (wantJson) body.response_format = { type: "json_object" };
        const res = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${dsKey}` },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'DeepSeek error');
        return data.choices?.[0]?.message?.content || "";
    };

    const callClaude = async (textPrompt, imageData, wantJson) => {
        const userContent = imageData
            ? [
                { type: 'image', source: { type: 'base64', media_type: imageData.mime, data: imageData.data } },
                { type: 'text', text: textPrompt }
              ]
            : textPrompt;
        const body = {
            model: 'claude-haiku-4-5',
            max_tokens: 2048,
            system: wantJson
                ? 'Eres un asistente de inventario experto. Responde SOLO con JSON válido. Sin markdown, sin explicaciones, solo el JSON.'
                : 'Eres un asistente de inventario experto.',
            messages: [{ role: 'user', content: userContent }]
        };
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': claudeKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'Claude error');
        return data.content?.[0]?.text || "";
    };

    const callOpenAI = async (textPrompt, imageData, wantJson) => {
        const userContent = imageData
            ? [
                { type: 'text', text: textPrompt },
                { type: 'image_url', image_url: { url: `data:${imageData.mime};base64,${imageData.data}` } }
              ]
            : textPrompt;
        const body = {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: wantJson
                    ? 'Eres un asistente de inventario experto. Responde SOLO con JSON válido.'
                    : 'Eres un asistente de inventario experto.' },
                { role: 'user', content: userContent }
            ]
        };
        if (wantJson) body.response_format = { type: 'json_object' };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message || 'OpenAI error');
        return data.choices?.[0]?.message?.content || "";
    };

    // Dispatcher: picks the best available provider for the task and falls back on error
    const callAI = async (textPrompt, imageData = null, wantJson = false) => {
        setLoading(true); setResult(null);

        const providers = {
            gemini:   { has: !!key,       vision: true,  fn: callGemini   },
            claude:   { has: !!claudeKey, vision: true,  fn: callClaude   },
            openai:   { has: !!openaiKey, vision: true,  fn: callOpenAI   },
            deepseek: { has: !!dsKey,     vision: false, fn: callDeepSeek }
        };

        const order = imageData
            ? ['gemini', 'claude', 'openai']                          // vision required
            : (wantJson
                ? ['deepseek', 'gemini', 'openai', 'claude']         // structured (cheap first)
                : ['claude', 'openai', 'gemini', 'deepseek']);       // free-form (quality first)

        const errors = [];
        for (const name of order) {
            const p = providers[name];
            if (!p.has) continue;
            if (imageData && !p.vision) continue;
            try {
                const out = await p.fn(textPrompt, imageData, wantJson);
                setLoading(false);
                return out;
            } catch (e) {
                console.error(`${name} falló:`, e);
                errors.push(`${name}: ${e.message}`);
            }
        }

        setLoading(false);
        if (errors.length === 0) {
            setResult(imageData
                ? "⚠️ Para tickets necesitas API key de Gemini, Claude u OpenAI."
                : "⚠️ Configura al menos una API Key en Ajustes.");
        } else {
            setResult("Todos los providers fallaron · " + errors.join(' | '));
        }
        return null;
    };

    const cleanJSON = (text) => {
        if (!text) return text;
        const arr = text.indexOf('['); const obj = text.indexOf('{');
        let s = -1, e = -1;
        if (arr !== -1 && (obj === -1 || arr < obj)) { s = arr; e = text.lastIndexOf(']'); }
        else if (obj !== -1) { s = obj; e = text.lastIndexOf('}'); }
        return (s !== -1 && e !== -1) ? text.substring(s, e + 1) : text;
    };

    const handleDictation = async () => {
        if (!prompt.trim()) return;
        const p = `Analiza: "${prompt}". Devuelve JSON con esta forma exacta: {"items":[{"name":"x","places":["y"],"status":"needed|stocked","qty":"1","expiry":"YYYY-MM-DD","category":"Alimentos|Medicamentos|Limpieza|Hogar|Mascotas|Otros"}]}. Si dice "tengo" usa "stocked". Si no hay categoria, adivina. SOLO JSON, sin markdown.`;
        const raw = await callAI(p, null, true);
        if (raw) {
            try {
                const parsed = JSON.parse(cleanJSON(raw));
                const arr = Array.isArray(parsed) ? parsed : (parsed.items || []);
                const newItems = arr.map(i => ({
                    id: newId(), name: i.name, places: i.places || ['General'],
                    status: i.status || 'needed', lastBought: i.status === 'stocked' ? todayISO() : null,
                    qty: i.qty || '', price: '', expiry: i.expiry || '', category: i.category || 'Otros', isEssential: false
                }));
                setItems(prev => [...prev, ...newItems]);
                setResult(`✅ ${newItems.length} items agregados.`); setPrompt('');
            } catch (e) { setResult("La IA no devolvio un formato valido. Intenta de nuevo."); }
        }
    };

    const handleTicketUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setModal('ticket'); setLoading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            const mimeType = file.type;
            const promptText = `Analiza ticket de compra. Extrae productos y precios. Devuelve JSON con esta forma exacta: {"items":[{"name":"Prod","price":10.50,"qty":"1"}]}. SOLO JSON.`;
            const text = await callAI(promptText, { mime: mimeType, data: base64Data }, true);
            if (text) {
                try {
                    const parsed = JSON.parse(cleanJSON(text));
                    const ticketItems = Array.isArray(parsed) ? parsed : (parsed.items || []);
                    if (ticketItems.length === 0) { setResult("Ticket procesado pero no se detectaron productos."); return; }
                    let added = 0, updated = 0;
                    setItems(prev => {
                        const list = [...prev];
                        ticketItems.forEach(t => {
                            const idx = list.findIndex(i => i.name.toLowerCase().includes(t.name.toLowerCase()));
                            if (idx >= 0) {
                                list[idx] = { ...list[idx], price: t.price, lastBought: todayISO(), status: 'stocked' };
                                updated++;
                            } else {
                                list.push({ id: newId(), name: t.name, places: ['Ticket'], status: 'stocked', lastBought: todayISO(), qty: t.qty || '1', price: t.price, expiry: '', category: 'Otros', isEssential: false });
                                added++;
                            }
                        });
                        return list;
                    });
                    setResult(`🧾 Ticket: ${added} nuevos, ${updated} actualizados.`);
                } catch (err) { setResult("Error procesando datos del ticket."); }
            }
        };
    };

    const handleChef = async () => {
        const stock = items.filter(i=>i.status==='stocked').map(i=>`${i.name} (${i.qty||''})`).join(', ');
        if(!stock) { setResult("Alacena vacía."); return; }
        const raw = await callAI(`Soy chef. Tengo: ${stock}. Crea receta corta con pasos numerados. Título divertido en la primera línea. Luego los pasos con número y punto.`);
        if (raw) {
            setResult(raw);
            const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
            const title = lines[0]?.replace(/^#+\s*/, '') || 'Receta Chef AI';
            const steps = parseRecipeSteps(lines.slice(1).join('\n'));
            if (steps.length >= 2) {
                setResult(raw + '\n\n[Toca "Ver paso a paso" para cocinar]');
                window.__lastChefRecipe = { title, steps };
            }
        }
    };

    const addItem = (e) => {
        if (e) e.preventDefault(); if (!name.trim()) return;
        const existing = items.find(i => i.name.toLowerCase() === name.toLowerCase() && i.status === 'inactive');
        if (existing) {
            setItems(items.map(i => i.id === existing.id ? { ...i, status: tab === 'inv' ? 'stocked' : 'needed' } : i));
        } else {
            const newItem = { id: newId(), name, places: selTags, status: tab === 'inv' ? 'stocked' : 'needed', lastBought: tab === 'inv' ? todayISO() : null, qty: '', price: '', expiry: '', category: 'Otros', isEssential: false, photoUrl: '', unitCount: null, unitSize: null, unitType: '', purchaseAt: '', expiryType: '' };
            newItem.expiryType = inferExpiryType(newItem) || '';
            setItems([...items, newItem]);
        }
        setName(''); setSelTags(['General']);
    };
    
    const toggleTag = (t) => { if(selTags.includes(t)) { if(selTags.length>1) setSelTags(selTags.filter(x=>x!==t)); } else setSelTags([...selTags, t]); };
    const addTag = async () => {
        if(!tagInput || savedTags.includes(tagInput)) return;
        const newTag = tagInput;
        setSavedTags([...savedTags, newTag]);
        setSelTags([...selTags, newTag]);
        setTagInput('');
        if (cloudMode && sbRef.current) {
            try {
                const { error } = await sbRef.current.from('saved_tags').insert({ group_id: groupId, tag: newTag });
                if (error && error.code !== '23505') console.error('saved_tags insert failed', error);
            } catch (e) { console.error('saved_tags insert threw', e); }
        }
    };
    const openEdit = (item) => { setEditItem({...item}); setModal('edit'); };
    const saveEdit = () => {
        const { _structured, ...clean } = editItem;
        setItems(items.map(i => i.id === clean.id ? clean : i));
        setModal(null);
        setEditItem(null);
    };

    // ─── Item photo upload (Supabase Storage bucket: item-photos) ───
    // Client-side compress: iPhones produce 8-12MB HEIC files that often
    // fail upload (size limit / HEIC mime). Resize to max 1600px and
    // re-encode as JPEG q=0.85 → ~200-500KB, also normalizes HEIC→JPEG.
    const compressImage = (file) => new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return resolve(file);
        const img = new Image();
        const reader = new FileReader();
        reader.onload = e => { img.src = e.target.result; };
        reader.onerror = () => reject(new Error('No se pudo leer la foto'));
        img.onload = () => {
            const MAX = 1600;
            let { width: w, height: h } = img;
            if (w > MAX || h > MAX) {
                const r = Math.min(MAX / w, MAX / h);
                w = Math.round(w * r); h = Math.round(h * r);
            }
            const canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.getContext('2d').drawImage(img, 0, 0, w, h);
            canvas.toBlob(blob => {
                if (!blob) return reject(new Error('No se pudo comprimir la foto'));
                // Stamp it as a File so .name and .type survive
                resolve(new File([blob], (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }));
            }, 'image/jpeg', 0.85);
        };
        img.onerror = () => reject(new Error('No se pudo decodificar la foto (HEIC sin convertir?)'));
        reader.readAsDataURL(file);
    });

    // Core uploader: works for any item, not just the one in the edit modal.
    // Returns the public URL on success, throws on failure.
    // Auto-retries once with re-auth if storage returns 401/403 (session expired).
    const uploadItemPhoto = async (item, file) => {
        if (!cloudMode || !sbRef.current) throw new Error('Sin sesión / grupo — no se puede subir.');
        const sb = sbRef.current;

        // Compress before upload (HEIC→JPEG, big→1600px)
        let payload;
        try {
            payload = await compressImage(file);
        } catch (e) {
            console.warn('compress failed, uploading original', e);
            payload = file;
        }

        const ext = (payload.type && payload.type.startsWith('image/')) ? payload.type.split('/')[1].split('+')[0].slice(0, 6) : 'jpg';
        const path = `${groupId}/${item.id}-${Date.now()}.${ext}`;

        const doUpload = () => sb.storage.from('item-photos').upload(path, payload, { upsert: true, cacheControl: '3600', contentType: payload.type || 'image/jpeg' });

        let { error } = await doUpload();
        // Auth recovery: re-auth and retry once if session is gone
        if (error && /401|403|auth|jwt|unauthor/i.test(String(error.message || error.statusCode || ''))) {
            console.warn('upload auth failed, re-auth + retry', error);
            try { await sb.auth.signInAnonymously(); } catch (e) { console.warn('re-auth failed', e); }
            ({ error } = await doUpload());
        }
        if (error) {
            const detail = [error.message, error.statusCode, error.error].filter(Boolean).join(' · ');
            console.error('upload failed', { error, path, size: payload.size, type: payload.type });
            throw new Error(detail || 'Upload falló');
        }
        const { data: pub } = sb.storage.from('item-photos').getPublicUrl(path);
        return pub.publicUrl;
    };
    // From edit modal — updates editItem state.
    const handleItemPhotoUpload = async (file) => {
        if (!file || !editItem) return;
        try {
            const url = await uploadItemPhoto(editItem, file);
            setEditItem({ ...editItem, photoUrl: url });
        } catch (e) { console.error('photo upload', e); alert('Subida falló: ' + e.message); }
    };
    // From inventory card — patches the live items array (and DB via diff effect).
    // If the item still lacks size/unit info, also runs vision to enrich those
    // fields without overwriting a name the user already typed.
    const handleQuickPhoto = async (item, file) => {
        if (!file) return;
        let url;
        try {
            url = await uploadItemPhoto(item, file);
            setItems(prev => prev.map(x => x.id === item.id ? { ...x, photoUrl: url } : x));
        } catch (e) { console.error('quick photo', e); alert('Foto no subió: ' + e.message); return; }

        const needsEnrich = !item.unitSize && !item.unitCount;
        if (!needsEnrich) return;
        try {
            const enriched = await identifyItemFromPhoto(url);
            setItems(prev => prev.map(x => x.id === item.id ? (() => {
                const next = {
                    ...x,
                    // never overwrite a name the user typed; only fill if blank
                    name: x.name && !x.name.startsWith('Identificando') && !x.name.startsWith('Sin identificar') ? x.name : (enriched.name || x.name),
                    category: x.category && x.category !== 'Otros' ? x.category : enriched.category,
                    unitCount: x.unitCount ?? enriched.unitCount,
                    unitSize:  x.unitSize  ?? enriched.unitSize,
                    unitType:  x.unitType  || enriched.unitType
                };
                next.expiryType = next.expiryType || inferExpiryType(next) || '';
                return next;
            })() : x));
        } catch (e) { console.error('quick photo enrich', e); }
    };
    const removeItemPhoto = () => { if (editItem) setEditItem({ ...editItem, photoUrl: '' }); };

    // ─── Edit modal photo gallery helpers ───
    // Upload extra photo desde edit modal (mismo path pattern que viewItem add)
    const editAddPhoto = async (file) => {
        if (!editItem || !file) return;
        try {
            const url = await uploadItemPhoto(editItem, file);
            const newExtras = [...(editItem.extraPhotoUrls || []), url];
            setEditItem({ ...editItem, extraPhotoUrls: newExtras, photoUrl: editItem.photoUrl || url });
        } catch (e) {
            console.error('edit add photo', e);
            alert('Foto no subió: ' + e.message);
        }
    };
    const editAddPhotos = async (files) => {
        const list = Array.from(files || []);
        for (let i = 0; i < list.length; i++) {
            setResult('Subiendo ' + (i+1) + '/' + list.length + '…');
            await editAddPhoto(list[i]);
        }
        setResult(null);
    };
    // Quitar foto del item (del array). Si era la principal, promueve la siguiente.
    const editRemovePhoto = (url) => {
        if (!editItem) return;
        const newExtras = (editItem.extraPhotoUrls || []).filter(u => u !== url);
        let newMain = editItem.photoUrl;
        if (newMain === url) newMain = newExtras[0] || '';
        setEditItem({ ...editItem, extraPhotoUrls: newExtras, photoUrl: newMain });
    };
    // Marcar una foto como la principal (la que se muestra como thumbnail)
    const editSetMainPhoto = (url) => {
        if (!editItem) return;
        setEditItem({ ...editItem, photoUrl: url });
    };

    // ─── View modal: tap thumbnail → detail con foto grande + galería + add foto ───
    // Lee extra_photo_urls del item (poblado por upload anterior + migration).
    // No depende de storage.list() — esa requiere policy especial que tuvimos
    // problemas para configurar; en su lugar guardamos las URLs en la columna.
    const openView = (item) => {
        setViewItem(item);
        // Galería = todas las URLs únicas del item (principal + extras).
        const all = [...(item.extraPhotoUrls || [])];
        if (item.photoUrl && !all.includes(item.photoUrl)) all.unshift(item.photoUrl);
        setViewItemPhotos(all);
        setModal('view');
    };

    // Upload extra foto al MISMO item: sube al bucket + agrega URL a la columna
    // extra_photo_urls + actualiza state local. Persiste sin storage.list().
    const handleAddItemPhoto = async (file) => {
        if (!viewItem || !file) return;
        try {
            const url = await uploadItemPhoto(viewItem, file);
            const newExtras = [...(viewItem.extraPhotoUrls || []), url];
            const patch = { extraPhotoUrls: newExtras };
            if (!viewItem.photoUrl) patch.photoUrl = url;

            // Persistir a Supabase (la columna extra_photo_urls)
            if (cloudMode && sbRef.current) {
                const dbPatch = { extra_photo_urls: newExtras };
                if (!viewItem.photoUrl) dbPatch.photo_url = url;
                await sbRef.current.from('items').update(dbPatch).eq('id', viewItem.id);
            }

            // Actualizar state local
            setItems(prev => prev.map(x => x.id === viewItem.id ? { ...x, ...patch } : x));
            setViewItem(prev => prev ? { ...prev, ...patch } : prev);
            setViewItemPhotos(prev => [...prev, url]);
        } catch (e) {
            console.error('add item photo', e);
            alert('Foto no subió: ' + e.message);
        }
    };
    const handleAddItemPhotos = async (files) => {
        const list = Array.from(files || []);
        for (let i = 0; i < list.length; i++) {
            setResult('Subiendo ' + (i+1) + '/' + list.length + '…');
            await handleAddItemPhoto(list[i]);
        }
        setResult(list.length + ' foto(s) agregada(s)');
        setTimeout(()=>setResult(null), 3000);
    };

    // ─── "Solo foto" flow: create item from photo, auto-fill via Vision ───
    // Returns { ok: true } on success, { ok: false, reason } on failure.
    // In silent mode (used by bulk), errors are NOT alerted; the caller
    // aggregates and reports a summary at the end.
    const handlePhotoOnlyAdd = async (file, opts = {}) => {
        const { silent = false } = opts;
        if (!file) return { ok: false, reason: 'no-file' };
        if (!cloudMode || !sbRef.current) {
            if (!silent) alert('Inicia sesión / únete a un grupo para usar Auto-foto.');
            return { ok: false, reason: 'no-session' };
        }
        const placeholderId = newId();
        const placeholder = {
            id: placeholderId,
            name: 'Identificando…',
            places: selTags,
            status: tab === 'inv' ? 'stocked' : 'needed',
            lastBought: tab === 'inv' ? todayISO() : null,
            qty: '', price: '', expiry: '',
            category: 'Otros',
            isEssential: false,
            photoUrl: '',
            unitCount: null, unitSize: null, unitType: '',
            purchaseAt: '',
            expiryType: ''
        };
        setItems(prev => [...prev, placeholder]);

        let photoUrl;
        try {
            photoUrl = await uploadItemPhoto(placeholder, file);
            setItems(prev => prev.map(x => x.id === placeholderId ? { ...x, photoUrl } : x));
        } catch (e) {
            console.error('photo-only upload', e);
            if (!silent) alert('Foto no subió: ' + e.message);
            setItems(prev => prev.filter(x => x.id !== placeholderId));
            return { ok: false, reason: 'upload', error: e.message };
        }

        try {
            const enriched = await identifyItemFromPhoto(photoUrl);
            setItems(prev => prev.map(x => x.id === placeholderId ? (() => {
                const next = {
                    ...x,
                    name: enriched.name || 'Sin identificar — toca para editar',
                    category: enriched.category,
                    unitCount: enriched.unitCount,
                    unitSize:  enriched.unitSize,
                    unitType:  enriched.unitType
                };
                next.expiryType = inferExpiryType(next) || '';
                return next;
            })() : x));
            return { ok: true, identified: true };
        } catch (e) {
            console.error('vision identify', e);
            setItems(prev => prev.map(x => x.id === placeholderId ? { ...x, name: 'Sin identificar — toca para editar' } : x));
            if (!silent) setResult('Foto subida pero no se pudo identificar (' + e.message + '). Edita manual.');
            return { ok: true, identified: false, reason: 'vision', error: e.message };
        }
    };

    // ─── Bulk photo flow: multi-select de la galería del iPhone ───
    // Procesa en serie (evita rate limits de Vision API y Storage),
    // muestra progreso "subiendo i/N", reporta resumen al final.
    const handleBulkPhotoAdd = async (files) => {
        const list = Array.from(files || []);
        if (!list.length) return;
        if (!cloudMode || !sbRef.current) { alert('Inicia sesión / únete a un grupo para subir fotos.'); return; }
        if (list.length === 1) return handlePhotoOnlyAdd(list[0]);

        let okUploaded = 0, okIdentified = 0, failed = 0;
        const failures = [];
        for (let i = 0; i < list.length; i++) {
            setResult('Subiendo ' + (i + 1) + ' / ' + list.length + '…');
            const res = await handlePhotoOnlyAdd(list[i], { silent: true });
            if (res.ok) {
                okUploaded++;
                if (res.identified) okIdentified++;
            } else {
                failed++;
                failures.push((list[i].name || 'foto') + ': ' + (res.error || res.reason));
            }
        }
        let summary = okUploaded + '/' + list.length + ' subidas';
        if (okIdentified < okUploaded) summary += ' · ' + (okUploaded - okIdentified) + ' sin identificar (toca para editar)';
        if (failed) summary += ' · ' + failed + ' fallaron';
        setResult(summary);
        if (failed) console.error('bulk upload failures', failures);
        setTimeout(() => setResult(null), 6000);
    };

    // ─── Vision auto-fill: photo URL -> {name, category, unitCount, unitSize, unitType} ───
    const urlToImageData = async (url) => {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('No se pudo bajar la foto (' + resp.status + ')');
        const blob = await resp.blob();
        const mime = blob.type || 'image/jpeg';
        const data = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(String(r.result).split(',')[1]);
            r.onerror = () => rej(r.error);
            r.readAsDataURL(blob);
        });
        return { mime, data };
    };
    const identifyItemFromPhoto = async (photoUrl) => {
        const img = await urlToImageData(photoUrl);
        const prompt = `Identifica el producto en la foto y devuelve JSON exactamente con este schema:
{
  "name": "Nombre corto del producto en español, sin marca a menos que sea distintiva (ej. 'Aceite de oliva', 'Tajín', 'Queso fondue')",
  "category": "UNO de: Alimentos | Medicamentos | Limpieza | Hogar | Mascotas | Otros",
  "unit_count": null o número entero (cuántos contenedores se ven, ej. 1 frasco, 2 latas),
  "unit_size": null o número (tamaño impreso en la etiqueta, ej. 250, 1.5),
  "unit_type": null o UNO de: g | kg | mg | oz | lb | ml | l | oz_fl | pz | pkg | bolsa | lata | caja | botella
}
Reglas:
- Si no estás seguro de un campo, usa null.
- Si el producto está visible parcialmente o borroso, igual intenta name + category, deja unidades null.
- Responde SOLO el JSON, sin markdown, sin comentarios.`;
        const raw = await callAI(prompt, img, true);
        let parsed;
        try { parsed = JSON.parse(raw.replace(/^```json\n?|\n?```$/g, '').trim()); }
        catch (e) { throw new Error('Vision devolvió JSON inválido: ' + raw.slice(0, 120)); }
        const valid = ['Alimentos','Medicamentos','Limpieza','Hogar','Mascotas','Otros'];
        const units = ['g','kg','mg','oz','lb','ml','l','oz_fl','pz','pkg','bolsa','lata','caja','botella'];
        return {
            name: (parsed.name && String(parsed.name).trim()) || '',
            category: valid.includes(parsed.category) ? parsed.category : 'Otros',
            unitCount: Number.isFinite(parsed.unit_count) ? Math.round(parsed.unit_count) : null,
            unitSize:  Number.isFinite(parsed.unit_size)  ? Number(parsed.unit_size)     : null,
            unitType:  units.includes(parsed.unit_type)   ? parsed.unit_type             : ''
        };
    };

    // ─── Expiry strictness classifier ───
    // Decide if a product's expiry date is "strict" (food-safety risk
    // past date — meat, dairy, fresh bread, opened mayo) or just a
    // "best before" hint (spices, flours, vinegars, oils, honey, salt,
    // sealed sauces). Helps avoid throwing away food that's still fine.
    const inferExpiryType = (it) => {
        const t = ((it.name || '') + ' ' + (it.category || '')).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
        const strictHits = [
            'leche','yogurt','yoghurt','crema','queso fresco','queso panela','queso oaxaca','queso ricotta','cottage',
            'jamon','jamón','salchich','tocino','chorizo','pollo','carne','pescado','mariscos','camaron','atun fresco',
            'pan ','tortill','baguette','bolillo','muffin','pastel','panque','crepa',
            'mayonesa abierta','aderezo abierto','hummus abierto','pure abierto',
            'huevo','clara liquida',
            'fruta','manzana','platano','pera','sandia','melon','papaya','mango','uva','fresa','arandano','frambuesa',
            'verdura','lechuga','espinaca','jitomate','tomate fresco','cebolla fresca','aguacate','pepino','zanahoria',
            'tofu','tempeh','seitan','leche vegetal','leche de almendra abierta','leche de soya abierta'
        ];
        const bestBeforeHits = [
            'especia','sazonador','sal','azucar','mascabad','miel','vinagre','aceite','salsa de soya','soya','ponzu','mirin','teriyaki','salsa botanera','valentina','tajin','chamoy','chipotle','adobo','achiote',
            'pimient','paprika','comino','oregano','laurel','tomillo','romero','clavo','canela','curcuma','nuez moscada','jengibre en polvo','ajo en polvo','cebolla en polvo','furikake','togarashi','everything bagel','consome','caldo','msg','glutamato',
            'harina','maicena','levadura','royal','polvo para hornear','chia','linaza','semilla',
            'arroz','quinoa','mijo','frijol','garbanzo','lenteja','cebada','avena',
            'espagueti','pasta','fideo','panini','noodle',
            'cafe molido','cafe','te ','infusion','chocolate','cocoa',
            'mantequilla de mani','peanut butter','tahini','nutella','crema de cacahuate',
            'mermelada','jam ','jalea','compota',
            'salmas','pita','crisp','tostada','galleta','crackers','salada',
            'salsa de pescado','tiparos','soja','wasabi en polvo'
        ];
        for (const k of strictHits) if (t.includes(k)) return 'strict';
        for (const k of bestBeforeHits) if (t.includes(k)) return 'best_before';
        return null;
    };

    // ─── Unit formatting (display "3×250 g" from structured fields) ───
    const formatUnits = (it) => {
        const c = it.unitCount, s = it.unitSize, u = it.unitType;
        if (c && s && u) {
            const total = c * s;
            return c > 1 ? `${c}×${s} ${u} (${total} ${u})` : `${s} ${u}`;
        }
        if (s && u) return `${s} ${u}`;
        if (it.qty) return it.qty;
        return '';
    };

    // ─── Marie Kondo helpers ───
    const todayStr = () => new Date().toISOString().slice(0,10);
    const monthsBetween = (iso, today) => {
        if (!iso) return Infinity;
        const a = new Date(iso), b = new Date(today);
        return (b.getFullYear()-a.getFullYear())*12 + (b.getMonth()-a.getMonth());
    };
    const isExpired = (i) => i.expiry && i.expiry < todayStr();
    const effectiveExpiryType = (i) => i.expiryType || inferExpiryType(i) || 'best_before';
    const isCriticalExpired = (i) => isExpired(i) && effectiveExpiryType(i) === 'strict';
    const isSoftExpired    = (i) => isExpired(i) && effectiveExpiryType(i) !== 'strict';
    const isStale = (i) => !i.lastBought || monthsBetween(i.lastBought, todayStr()) >= 6;
    const noPhoto = (i) => !i.photoUrl;
    const duplicateNameSet = React.useMemo(() => {
        const counts = {};
        for (const i of items) {
            const k = (i.name || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/\([^)]*\)/g,'').trim();
            if (!k || k.startsWith('identificando') || k.startsWith('sin identificar')) continue;
            counts[k] = (counts[k] || 0) + 1;
        }
        return new Set(Object.entries(counts).filter(([_,n]) => n > 1).map(([k]) => k));
    }, [items]);
    const isDuplicate = (i) => {
        const k = (i.name || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/\([^)]*\)/g,'').trim();
        return duplicateNameSet.has(k);
    };

    const displayItems = () => {
        let base;
        if(tab==='shop') base = items.filter(i => (i.status==='needed'||i.status==='cart') && (filter==='Todos'||i.places.includes(filter)||i.places.includes('General')));
        else if(tab==='inv') {
            if(invFilter === 'Agotados') base = items.filter(i => i.status==='inactive');
            else if(invFilter === 'MariKondo') base = items.filter(i => i.status==='stocked' && (isCriticalExpired(i) || isDuplicate(i) || isStale(i) || noPhoto(i) || isSoftExpired(i)));
            else if(invFilter === 'Todos') base = items.filter(i => i.status==='stocked');
            else base = items.filter(i => i.status==='stocked' && i.category === invFilter);
        }
        else if(tab==='hist') base = items.filter(i => i.lastBought);
        else return [];

        // search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
            base = base.filter(i => {
                const n = (i.name || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'');
                return n.includes(q) || (i.category||'').toLowerCase().includes(q) || (i.purchaseAt||'').toLowerCase().includes(q);
            });
        }

        // sort
        const cmp = {
            name:   (a,b) => (a.name||'').localeCompare(b.name||'', 'es', {sensitivity:'base'}),
            recent: (a,b) => (b.updatedAt||'').localeCompare(a.updatedAt||''),
            expiry: (a,b) => (a.expiry||'9999').localeCompare(b.expiry||'9999'),
            price:  (a,b) => (Number(b.price)||0) - (Number(a.price)||0),
        }[sortBy] || ((a,b)=>0);
        base = [...base].sort(cmp);

        return base;
    };
    const list = displayItems();
    const showCheckout = tab==='shop' && items.some(i=>i.status==='cart');
    // Lista: agrupa por categoría (como pasillos del súper). Casa: por lugar.
    const groupedList = React.useMemo(() => {
        if (!groupByPlace || tab === 'hist') return null;
        const g = {};
        for (const i of list) {
            const key = tab === 'shop' ? (i.category || 'Otros') : ((i.places && i.places[0]) || 'General');
            (g[key] = g[key] || []).push(i);
        }
        return Object.entries(g).sort(([a],[b]) => a.localeCompare(b, 'es'));
    }, [list, groupByPlace, tab]);

    // Texto plano de lo que falta, agrupado por categoría, para mandarlo por WhatsApp o donde sea.
    const shareList = async () => {
        const text = listShareText(items, filter);
        try {
            if (navigator.share) await navigator.share({ text });
            else { await navigator.clipboard.writeText(text); showToast('Lista copiada'); }
        } catch (e) {
            if (e && e.name === 'AbortError') return;
            try { await navigator.clipboard.writeText(text); showToast('Lista copiada'); } catch { alert(text); }
        }
    };

    // --- AUDIO RECORDING (Browser API) ---
    const startListening = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert("Navegador no soporta dictado."); return; }
        const rec = new SR();
        rec.lang = 'es-MX'; rec.continuous = true; rec.interimResults = true;
        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onerror = (e) => { setIsListening(false); if(e.error!=='no-speech') alert("Error: "+e.error); };
        rec.onresult = (e) => {
            let final = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
            if (final) setPrompt(p => (p + ' ' + final).trim());
        };
        recognitionRef.current = rec;
        rec.start();
    };
    const toggleListening = () => { if(isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); } else startListening(); };

    // Solo para pruebas automatizadas (tests/): permite abrir cada vista sin depender de clases CSS.
    if (window.__MS_TEST__) window.__ms = { setTab, setModal, openEdit, openView, setRecipeWizard, setInvFilter, setGroupByPlace, setSearchQuery, setUndoSnapshot, setConfirmData, setOnboarded, setObStep, setResult, setFilter, items };

    const modalFooter = () => {
        if (modal === 'edit' && editItem) return <button onClick={saveEdit} className="ms-btn ms-btn-primary">Guardar cambios</button>;
        if (modal === 'view' && viewItem) return <button onClick={()=>{ setModal('edit'); setEditItem({...viewItem}); }} className="ms-btn ms-btn-secondary">Editar</button>;
        if (modal === 'settings') return <button onClick={()=>setModal(null)} className="ms-btn ms-btn-primary">Guardar</button>;
        if (modal === 'dictate') return (
            <div className="grid grid-cols-2 gap-2">
                <button onClick={toggleListening} className={`ms-btn ms-btn-secondary ${isListening ? 'mic-active' : ''}`}>{isListening ? <><Icon name="Stop" size={18}/> Parar</> : <><Icon name="Mic" size={18}/> Hablar</>}</button>
                <button onClick={handleDictation} disabled={loading || !prompt.trim()} className="ms-btn ms-btn-primary">{loading ? 'Pensando…' : 'Procesar'}</button>
            </div>
        );
        return null;
    };

    const tabCounts = {
        shop: items.filter(i => i.status==='needed'||i.status==='cart').length,
        inv: items.filter(i => i.status==='stocked').length,
        hist: items.filter(i => i.lastBought).length,
    };
    const cartCount = items.filter(i=>i.status==='cart').length;
    const expiryLabel = (i) => isCriticalExpired(i) ? 'caducado' : isSoftExpired(i) ? `consumo pref. ${i.expiry}` : `caduca ${i.expiry}`;

    const renderItem = (i) => {
        const units = formatUnits(i);
        const flags = (tab==='inv' && invFilter==='MariKondo') ? [isDuplicate(i) && 'duplicado', noPhoto(i) && 'sin foto', isStale(i) && 'sin comprar en 6 meses'].filter(Boolean) : [];
        const onRowTap = () => {
            if(tab==='shop') setItems(items.map(x=>x.id===i.id?{...x,status:i.status==='needed'?'cart':'needed'}:x));
            if(i.status==='inactive') setItems(items.map(x=>x.id===i.id?{...x,status:'stocked'}:x));
        };
        return (
            <div key={i.id} data-item className={`ms-row ${i.status==='cart'?'is-cart':''} ${i.status==='inactive'?'is-inactive':''}`}>
                {tab==='shop' && (
                    <button className="ms-check" onClick={onRowTap} aria-label={i.status==='cart' ? `Quitar ${i.name} del carrito` : `Marcar ${i.name} en el carrito`} aria-pressed={i.status==='cart'}>
                        <span>{i.status==='cart' && <Icon name="Check" size={14}/>}</span>
                    </button>
                )}
                {i.photoUrl && (
                    <img src={i.photoUrl} alt="" loading="lazy" onClick={()=>openView(i)} className="ms-thumb cursor-pointer active:opacity-70"/>
                )}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={onRowTap}>
                    <p className="ms-name">
                        {i.name}
                        {i.isEssential && <span className="ms-meta" style={{marginLeft:6}} title="Esencial">★</span>}
                    </p>
                    <p className="ms-meta">
                        {[i.category, (i.places||[]).filter(p=>p && p!=='General').join(', ')].filter(Boolean).join(' · ')}
                        {units && tab!=='inv' && <> · {units}</>}
                        {i.price && <> · ${i.price}</>}
                        {i.purchaseAt && <> · {i.purchaseAt}</>}
                        {i.expiry && <> · <span className={isCriticalExpired(i)?'danger':isSoftExpired(i)?'warn':''}>{expiryLabel(i)}</span></>}
                        {flags.length > 0 && <> · {flags.join(', ')}</>}
                    </p>
                    {tab==='inv' && (
                        (i.unitCount || i.unitSize) ? (
                            <p className="ms-meta" onClick={e=>{e.stopPropagation(); openEdit(i);}}>{units}</p>
                        ) : (
                            <input
                                value={i.qty || ''}
                                placeholder="+ cantidad"
                                aria-label={`Cantidad de ${i.name}`}
                                onClick={e=>e.stopPropagation()}
                                onChange={e=>setItems(items.map(x=>x.id===i.id?{...x,qty:e.target.value}:x))}
                                className="ms-qty"
                            />
                        )
                    )}
                    {cloudMode && i.updatedBy && (
                        <p className="ms-meta">Editado por {nicknameOf(i.updatedBy)} · {relativeTime(i.updatedAt)}</p>
                    )}
                </div>
                <div className="ms-row-actions">
                    {(tab==='inv' && i.status!=='inactive') && (
                        <button onClick={()=>setItems(items.map(x=>x.id===i.id?{...x,status:'needed'}:x))} aria-label="Pasar a la lista" className="ms-icon-btn" style={{color:'var(--ink)'}}><Icon name="Plus" size={20}/></button>
                    )}
                    {tab==='inv' && (
                        <label className="ms-icon-btn" aria-label={i.photoUrl ? 'Cambiar foto' : 'Tomar foto'} onClick={e=>e.stopPropagation()}>
                            <Icon name="Camera" size={19}/>
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={e => { const f = e.target.files && e.target.files[0]; if (f) handleQuickPhoto(i, f); e.target.value=''; }}/>
                        </label>
                    )}
                    <button onClick={()=>openEdit(i)} aria-label="Editar" className="ms-icon-btn"><Icon name="Edit" size={18}/></button>
                    <button onClick={()=>handleSmartDelete(i)} aria-label="Borrar" className="ms-icon-btn"><Icon name="Trash" size={18}/></button>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full sm:h-[90vh] sm:max-w-[420px] sm:rounded-[18px] sm:shadow-2xl flex flex-col relative overflow-hidden" style={{background:'var(--paper)'}}>
            <header className="ms-mast shrink-0 z-10">
                {updateReady && (
                    <div className="flex items-center justify-between gap-3 mb-2 text-sm">
                        <span>Hay una versión nueva.</span>
                        <button onClick={applyUpdate} className="ms-link-strong" style={{color:'var(--paper)'}}>Recargar</button>
                    </div>
                )}
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                        <h1 className="serif" style={{fontSize:26, lineHeight:1.1, fontWeight:500}}>Mi Súper</h1>
                        <p className="ms-mast-meta flex items-center gap-1.5 mt-0.5">
                            {cloudMode && <>
                                <span aria-hidden="true" style={{width:6,height:6,borderRadius:3,background: syncStatus==='online' ? '#7fb08f' : syncStatus==='connecting' ? '#c9a25b' : '#c7706a'}}></span>
                                <span className="truncate">{groupName} · {members.length || 1} {members.length === 1 ? 'miembro' : 'miembros'}</span>
                                <span>·</span>
                            </>}
                            <button onClick={hardRefresh} title="Limpiar cache y recargar" className="py-1">v{APP_VERSION} · <span className="underline">refrescar</span></button>
                        </p>
                    </div>
                    <nav className="flex items-center -mr-2" aria-label="Herramientas">
                        <label className="ms-icon-btn" aria-label="Leer ticket"><Icon name="Camera"/><input type="file" accept="image/*" className="hidden" onChange={handleTicketUpload}/></label>
                        <button onClick={()=>{setModal('dictate'); setResult(null)}} aria-label="Dictar" className="ms-icon-btn"><Icon name="Mic"/></button>
                        <button onClick={()=>{setModal('chef'); setResult(null); handleChef();}} aria-label="Chef" className="ms-icon-btn"><Icon name="Chef"/></button>
                        <button onClick={()=>setModal('suggest')} aria-label="Sugerencias" className="ms-icon-btn"><Icon name="Sparkles"/></button>
                        <button onClick={()=>setModal('settings')} aria-label="Ajustes" className="ms-icon-btn"><Icon name="Settings"/></button>
                    </nav>
                </div>
                <div className="ms-add">
                    <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{ if (e.key==='Enter' && !e.nativeEvent.isComposing) addItem(e); }} enterKeyHint="done" placeholder={tab==='inv'?"Agregar a Casa…":"¿Qué falta?"} aria-label={tab==='inv'?'Agregar a Casa':'Agregar a la lista'}/>
                    <label className="ms-icon-btn" aria-label="Agregar con foto" title="Tomar foto o elegir varias del rollo">
                        <Icon name="Camera"/>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => { const fs = e.target.files; if (fs && fs.length) handleBulkPhotoAdd(fs); e.target.value=''; }}/>
                    </label>
                    <button onClick={addItem} disabled={!name} aria-label="Agregar" className="ms-icon-btn -mr-2"><Icon name="Plus" size={22}/></button>
                </div>
                <div className="flex items-center gap-3">
                <span className="ms-mast-meta shrink-0" style={{fontSize:13}}>Lugar</span>
                <div className="flex gap-4 overflow-x-auto no-scrollbar items-center flex-1 min-w-0" data-hscroll>
                    {savedTags.map(t=>(<button key={t} onClick={()=>toggleTag(t)} aria-pressed={selTags.includes(t)} className="ms-toggle">{t}</button>))}
                    <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onBlur={addTag} onKeyDown={e=>e.key==='Enter'&&addTag()} placeholder="+ lugar" aria-label="Nuevo lugar" className="bg-transparent outline-none shrink-0 py-2" style={{width:72, fontSize:14, color:'var(--paper)'}}/>
                </div>
                </div>
            </header>

            <div className="ms-tabs shrink-0" role="tablist">
                {[{id:'shop',l:'Lista'},{id:'inv',l:'Casa'},{id:'hist',l:'Historial'}].map(x=>(
                    <button key={x.id} data-tab={x.id} role="tab" aria-selected={tab===x.id} onClick={()=>setTab(x.id)} className="ms-tab">{x.l}<span className="ms-count">{tabCounts[x.id]}</span></button>
                ))}
            </div>

            <div data-testid="scroll" className="ms-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <div className="ms-tools">
                    {tab==='shop' && (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar items-center" data-hscroll>
                            <span className="shrink-0" style={{fontSize:13, color:'var(--ink-3)'}}>Ver</span>
                            <button onClick={()=>setFilter('Todos')} aria-pressed={filter==='Todos'} className="ms-toggle">Todos</button>
                            {savedTags.filter(x=>x!=='General').map(t=>(<button key={t} onClick={()=>setFilter(t)} aria-pressed={filter===t} className="ms-toggle">{t}</button>))}
                        </div>
                    )}
                    {tab==='inv' && (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar" data-hscroll>
                            <button onClick={()=>setInvFilter('Todos')} aria-pressed={invFilter==='Todos'} className="ms-toggle">Todos</button>
                            <button onClick={()=>setInvFilter('MariKondo')} aria-pressed={invFilter==='MariKondo'} className="ms-toggle">Mari Kondo</button>
                            {categories.map(c=>(<button key={c} onClick={()=>setInvFilter(c)} aria-pressed={invFilter===c} className="ms-toggle">{c}</button>))}
                            <button onClick={()=>setInvFilter('Agotados')} aria-pressed={invFilter==='Agotados'} className="ms-toggle">Agotados</button>
                        </div>
                    )}
                    {(tab==='inv' || tab==='shop') && (
                        <div className="flex gap-3 items-center mt-1">
                            <label className="ms-search">
                                <Icon name="Search" size={16}/>
                                <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Buscar" aria-label="Buscar"/>
                                {searchQuery && <button onClick={()=>setSearchQuery('')} aria-label="Borrar búsqueda" className="ms-icon-btn -mr-2" style={{width:32,height:32}}><Icon name="X" size={16}/></button>}
                            </label>
                            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label="Ordenar" className="ms-select">
                                <option value="name">A-Z</option>
                                <option value="recent">Recientes</option>
                                <option value="expiry">Caducidad</option>
                                <option value="price">Precio</option>
                            </select>
                            <button onClick={()=>setGroupByPlace(!groupByPlace)} aria-pressed={groupByPlace} aria-label={tab==='shop' ? 'Agrupar por categoría' : 'Agrupar por lugar'} title={tab==='shop' ? 'Agrupar por categoría' : 'Agrupar por lugar'} className="ms-icon-btn -mr-2" style={{color: groupByPlace ? 'var(--ink)' : 'var(--ink-3)', background: groupByPlace ? 'var(--paper-2)' : 'transparent'}}><Icon name="Layers" size={18}/></button>
                        </div>
                    )}
                    {(tab==='inv' || tab==='hist' || tab==='shop') && (
                        <div className="flex justify-end gap-5 -mb-1">
                            {tab==='shop' && list.length > 0 && <button onClick={shareList} className="ms-link flex items-center gap-1.5"><Icon name="Share" size={15}/> Compartir lista</button>}
                            {tab!=='shop' && <button onClick={handleExportCSV} className="ms-link">Exportar CSV</button>}
                            {tab==='inv' && <label className="ms-link cursor-pointer">Importar CSV<input type="file" accept=".csv" onChange={handleImportCSV} className="hidden"/></label>}
                        </div>
                    )}
                </div>

                {invFilter==='MariKondo' && tab==='inv' && list.length > 0 && (
                    <p className="ms-note"><strong>{list.length}</strong> candidatos a mari-kondear: caducados, duplicados, sin foto o sin comprar en 6 meses.</p>
                )}

                <div style={{borderTop:'1px solid var(--rule)'}}>
                    {groupedList
                        ? groupedList.flatMap(([g, gitems]) => [<div key={"_g_"+g} className="ms-group">{g} · {gitems.length}</div>, ...gitems.map(renderItem)])
                        : list.map(renderItem)}
                </div>

                {!list.length && (
                    <div className="ms-empty">
                        {searchQuery.trim() ? <>Nada coincide con “{searchQuery.trim()}”.</>
                            : tab==='shop' ? <>Tu lista está vacía.<br/><span style={{fontSize:13}}>Escribe arriba lo que falta o usa el micrófono.</span></>
                            : tab==='hist' ? <>Aún no hay compras registradas.</>
                            : invFilter==='MariKondo' ? <>Nada que mari-kondear.</>
                            : <>No hay nada aquí todavía.</>}
                    </div>
                )}
                <div style={{height:24}} aria-hidden="true"></div>
            </div>

            {(undoSnapshot || notice || showCheckout) && (
                <div className="ms-dock shrink-0" data-dock>
                    {undoSnapshot && (
                        <div className="ms-toast" role="status">
                            <span>{undoSnapshot.label}</span>
                            <button onClick={() => { setItems(undoSnapshot.items); setUndoSnapshot(null); if (undoTimerRef.current) clearTimeout(undoTimerRef.current); }} className="ms-link-strong">Deshacer</button>
                        </div>
                    )}
                    {notice && !undoSnapshot && <div className="ms-toast" role="status"><span>{notice}</span></div>}
                    {showCheckout && (
                        <button onClick={requestCheckout} className="ms-btn ms-btn-accent justify-between">
                            <span>Finalizar compra</span>
                            <span className="flex items-center gap-2 font-normal">{cartCount} en el carrito <Icon name="ArrowRight" size={18}/></span>
                        </button>
                    )}
                </div>
            )}

            {confirmData.isOpen && (
                <Sheet z={70} testid="confirm" onClose={()=>setConfirmData({isOpen:false})} title={confirmData.msg}
                    footer={<>
                        <button onClick={confirmData.action} className="ms-btn ms-btn-primary">{confirmData.actionText}</button>
                        {confirmData.altAction && <button onClick={confirmData.altAction} className="ms-btn ms-btn-danger">{confirmData.altText}</button>}
                        <button onClick={()=>setConfirmData({isOpen:false})} className="ms-btn ms-btn-secondary">Cancelar</button>
                    </>}>
                    {confirmData.detail ? <p className="ms-prose" style={{color:'var(--ink-2)'}}>{confirmData.detail}</p> : null}
                </Sheet>
            )}

            {modal && !confirmData.isOpen && (
                <Sheet testid="sheet" onClose={()=>{setModal(null); setEditItem(null); setResult(null)}}
                    title={{settings:'Ajustes', edit:'Editar', dictate:'Dictado', chef:'Chef', ticket:'Ticket', suggest:'Sugerencias', view: viewItem ? viewItem.name : ''}[modal]}
                    footer={modalFooter()}>

                        {modal === 'edit' && editItem && (() => {
                            const allPhotos = Array.from(new Set([
                                ...(editItem.photoUrl ? [editItem.photoUrl] : []),
                                ...(editItem.extraPhotoUrls || [])
                            ]));
                            const structured = editItem._structured || editItem.unitCount || editItem.unitSize;
                            return (
                                <div className="space-y-4">
                                    <label className="ms-field">
                                        <span className="ms-label">Nombre</span>
                                        <input value={editItem.name} onChange={e=>setEditItem({...editItem, name:e.target.value})} className="ms-input" style={{fontWeight:600}} placeholder="Nombre"/>
                                    </label>
                                    <div>
                                        <div className="flex items-baseline justify-between">
                                            <span className="ms-label">Cantidad</span>
                                            <button type="button" onClick={() => setEditItem({...editItem, _structured: !editItem._structured && !(editItem.unitCount || editItem.unitSize)})} className="ms-link" style={{fontSize:13, padding:'4px 0'}}>
                                                {structured ? 'Texto libre' : 'Piezas × tamaño'}
                                            </button>
                                        </div>
                                        {structured ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" inputMode="numeric" min="0" placeholder="3" aria-label="Piezas" value={editItem.unitCount ?? ''} onChange={e=>setEditItem({...editItem, unitCount: e.target.value === '' ? null : Number(e.target.value)})} className="ms-input text-center" style={{width:72}}/>
                                                    <span style={{color:'var(--ink-3)'}}>×</span>
                                                    <input type="number" inputMode="decimal" min="0" step="0.01" placeholder="250" aria-label="Tamaño" value={editItem.unitSize ?? ''} onChange={e=>setEditItem({...editItem, unitSize: e.target.value === '' ? null : Number(e.target.value)})} className="ms-input text-center flex-1 min-w-0"/>
                                                    <select value={editItem.unitType || ''} aria-label="Unidad" onChange={e=>setEditItem({...editItem, unitType: e.target.value})} className="ms-input" style={{width:92}}>
                                                        <option value="">—</option>
                                                        <optgroup label="Peso">
                                                            <option value="g">g</option><option value="kg">kg</option><option value="mg">mg</option><option value="oz">oz</option><option value="lb">lb</option>
                                                        </optgroup>
                                                        <optgroup label="Volumen">
                                                            <option value="ml">ml</option><option value="l">l</option><option value="oz_fl">oz fl</option>
                                                        </optgroup>
                                                        <optgroup label="Conteo">
                                                            <option value="pz">pz</option><option value="pkg">pkg</option><option value="bolsa">bolsa</option><option value="lata">lata</option><option value="caja">caja</option><option value="botella">botella</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                                <p className="ms-hint">{formatUnits(editItem) || 'Número de piezas × tamaño y unidad'}</p>
                                            </>
                                        ) : (
                                            <input value={editItem.qty} placeholder="ej. 2 kg" aria-label="Cantidad" onChange={e=>setEditItem({...editItem, qty:e.target.value})} className="ms-input"/>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="ms-field">
                                            <span className="ms-label">Precio</span>
                                            <input type="number" inputMode="decimal" value={editItem.price} onChange={e=>setEditItem({...editItem, price:e.target.value})} className="ms-input" placeholder="$"/>
                                        </label>
                                        <label className="ms-field">
                                            <span className="ms-label">Categoría</span>
                                            <select value={editItem.category} onChange={e=>setEditItem({...editItem, category:e.target.value})} className="ms-input">{categories.map(c=><option key={c} value={c}>{c}</option>)}</select>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className="ms-field">
                                            <span className="ms-label">Caducidad</span>
                                            <input type="date" value={editItem.expiry} onChange={e=>setEditItem({...editItem, expiry:e.target.value})} className="ms-input"/>
                                        </label>
                                        <label className="ms-field">
                                            <span className="ms-label">Tipo de fecha</span>
                                            <select value={editItem.expiryType || ''} onChange={e=>setEditItem({...editItem, expiryType: e.target.value})} className="ms-input">
                                                <option value="">Automático</option>
                                                <option value="strict">Caducidad (tirar)</option>
                                                <option value="best_before">Consumo preferente</option>
                                            </select>
                                        </label>
                                    </div>
                                    <label className="ms-field">
                                        <span className="ms-label">Lugares, separados por coma</span>
                                        <input value={editItem.places.join(', ')} onChange={e=>setEditItem({...editItem, places:e.target.value.split(',').map(s=>s.trim())})} className="ms-input"/>
                                    </label>
                                    <label className="ms-field">
                                        <span className="ms-label">Dónde comprar</span>
                                        <input list="purchase-stores" value={editItem.purchaseAt || ''} onChange={e=>setEditItem({...editItem, purchaseAt: e.target.value})} placeholder="Costco, Sumesa, City Market…" className="ms-input"/>
                                        <datalist id="purchase-stores">
                                            {Array.from(new Set(items.map(it => it.purchaseAt).filter(Boolean))).map(s => <option key={s} value={s}/>)}
                                            {['Costco','Sumesa','Walmart','City Market','La Comer','Soriana','Mercado Roma','Tianguis','Online'].map(s => <option key={'d'+s} value={s}/>)}
                                        </datalist>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer" style={{minHeight:44}}>
                                        <input type="checkbox" checked={!!editItem.isEssential} onChange={()=>setEditItem({...editItem, isEssential: !editItem.isEssential})} style={{width:22,height:22,accentColor:'var(--ink)'}}/>
                                        <span>
                                            <span style={{fontSize:16}}>Esencial</span>
                                            <span className="ms-hint" style={{display:'block', marginTop:0}}>Cuando se acaba, regresa sola a la lista.</span>
                                        </span>
                                    </label>
                                    <div className="ms-section">
                                        <div className="flex items-baseline justify-between">
                                            <p className="ms-h">Fotos · {allPhotos.length}</p>
                                            <label className="ms-link cursor-pointer flex items-center gap-1.5">
                                                <Icon name="Camera" size={15}/> Agregar
                                                <input type="file" accept="image/*" multiple className="hidden" onChange={e => { const fs = e.target.files; if (fs && fs.length) editAddPhotos(fs); e.target.value=''; }}/>
                                            </label>
                                        </div>
                                        {allPhotos.length > 0 ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {allPhotos.map((url) => (
                                                    <figure key={url} className="relative">
                                                        <img src={url} alt="" className="w-full aspect-square object-cover" style={{borderRadius:6, background:'var(--paper-2)'}}/>
                                                        <button type="button" onClick={() => editRemovePhoto(url)} aria-label="Quitar foto" className="absolute top-0 right-0 ms-icon-btn" style={{width:36,height:36,color:'#fff',filter:'drop-shadow(0 0 2px rgba(0,0,0,.7))'}}><Icon name="X" size={18}/></button>
                                                        <figcaption className="ms-meta" style={{marginTop:2}}>
                                                            {url === editItem.photoUrl ? 'Principal' : <button type="button" onClick={() => editSetMainPhoto(url)} className="underline" style={{padding:'4px 0'}}>Hacer principal</button>}
                                                        </figcaption>
                                                    </figure>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="ms-hint">Sin fotos. Agrega frente, ingredientes o caducidad.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}

                        {modal === 'view' && viewItem && (
                            <div className="space-y-4">
                                {viewItem.photoUrl ? (
                                    <a href={viewItem.photoUrl} target="_blank" rel="noopener" className="block">
                                        <img src={viewItem.photoUrl} alt={viewItem.name} className="w-full max-h-[45vh] object-contain" style={{background:'var(--paper-2)', borderRadius:6}}/>
                                    </a>
                                ) : (
                                    <p className="ms-hint">Sin foto principal.</p>
                                )}
                                <dl className="grid gap-x-4 gap-y-2" style={{gridTemplateColumns:'auto 1fr', fontSize:15}}>
                                    <dt style={{color:'var(--ink-3)'}}>Categoría</dt><dd>{viewItem.category}{viewItem.isEssential ? ' · esencial' : ''}</dd>
                                    <dt style={{color:'var(--ink-3)'}}>Lugar</dt><dd>{viewItem.places.join(', ') || 'General'}</dd>
                                    {(formatUnits(viewItem) || viewItem.qty) && <><dt style={{color:'var(--ink-3)'}}>Cantidad</dt><dd>{formatUnits(viewItem) || viewItem.qty}</dd></>}
                                    {viewItem.price && <><dt style={{color:'var(--ink-3)'}}>Precio</dt><dd>${viewItem.price}</dd></>}
                                    {viewItem.expiry && <><dt style={{color:'var(--ink-3)'}}>Fecha</dt><dd style={{color: isCriticalExpired(viewItem) ? 'var(--danger)' : isSoftExpired(viewItem) ? 'var(--warn)' : undefined}}>{expiryLabel(viewItem)}</dd></>}
                                    {viewItem.purchaseAt && <><dt style={{color:'var(--ink-3)'}}>Dónde</dt><dd>{viewItem.purchaseAt}</dd></>}
                                </dl>
                                <div className="ms-section">
                                    <div className="flex items-baseline justify-between">
                                        <p className="ms-h">Fotos · {viewItemPhotos.length}</p>
                                        <label className="ms-link cursor-pointer flex items-center gap-1.5">
                                            <Icon name="Camera" size={15}/> Agregar
                                            <input type="file" accept="image/*" multiple className="hidden" onChange={e => { const fs = e.target.files; if (fs && fs.length) handleAddItemPhotos(fs); e.target.value=''; }}/>
                                        </label>
                                    </div>
                                    {viewItemPhotos.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-2">
                                            {viewItemPhotos.map((url, idx) => (
                                                <a key={url+idx} href={url} target="_blank" rel="noopener" className="block">
                                                    <img src={url} alt="" className="w-full aspect-square object-cover" style={{borderRadius:6, background:'var(--paper-2)'}} loading="lazy"/>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="ms-hint">Agrega ingredientes, caducidad, marca o la parte de atrás.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {modal === 'settings' && (
                            <div className="space-y-4">
                                {cloudConfigured && cloudMode && (
                                    <section>
                                        <p className="ms-h">Grupo</p>
                                        <p style={{fontSize:16}}>{groupName} · <span style={{color:'var(--ink-3)'}}>{members.length || 1} {members.length === 1 ? 'miembro' : 'miembros'}</span></p>
                                        <p className="ms-hint">Código <strong style={{color:'var(--ink)', letterSpacing:'.08em'}}>{groupCode}</strong></p>
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <button onClick={async ()=>{
                                                const text = `Únete a "${groupName}" en Mi Súper con el código ${groupCode}\n${location.origin}${location.pathname}`;
                                                try { if (navigator.share) await navigator.share({ text }); else { await navigator.clipboard.writeText(text); alert('Copiado'); } } catch {}
                                            }} className="ms-btn ms-btn-secondary">Compartir código</button>
                                            <button onClick={()=>{
                                                setConfirmData({
                                                    isOpen: true, msg: `¿Salir de "${groupName}"?`, detail: 'Tus listas locales no se borran.', actionText: "Salir",
                                                    action: () => { cloudLeaveGroup(); setConfirmData({isOpen:false}); setModal(null); },
                                                });
                                            }} className="ms-btn ms-btn-danger">Salir</button>
                                        </div>
                                        {items.length > 0 && (
                                            <button onClick={async ()=>{
                                                const r = await cloudUploadLocal();
                                                alert(r?.error ? `Error: ${r.error}` : 'Inventario subido al grupo');
                                            }} className="ms-link mt-1">Subir mi inventario actual al grupo</button>
                                        )}
                                    </section>
                                )}
                                {cloudConfigured && !cloudMode && (
                                    <section>
                                        <p className="ms-h">Modo</p>
                                        <p style={{fontSize:16}}>Solo este dispositivo</p>
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            <button onClick={()=>{ setObStep('create'); setObError(null); setObName(''); setObNick(''); setOnboarded(false); setModal(null); }} className="ms-btn ms-btn-secondary">Crear grupo</button>
                                            <button onClick={()=>{ setObStep('join'); setObError(null); setObCode(''); setObNick(''); setOnboarded(false); setModal(null); }} className="ms-btn ms-btn-secondary">Unirme</button>
                                        </div>
                                    </section>
                                )}
                                <section className={cloudConfigured ? 'ms-section' : ''}>
                                    <p className="ms-h">Inteligencia artificial</p>
                                    <p className="ms-hint" style={{marginTop:0}}>Las llaves se guardan en este teléfono y solo se mandan al proveedor cuando usas voz, tickets o chef. La app usa la mejor disponible para cada tarea.</p>
                                </section>
                                {[
                                    ['Google Gemini', 'Gratis.', 'https://aistudio.google.com/apikey', 'aistudio.google.com', key, setKey, 'AIza…'],
                                    ['Anthropic Claude', 'De pago, modelo Haiku.', 'https://console.anthropic.com/settings/keys', 'console.anthropic.com', claudeKey, setClaudeKey, 'sk-ant-…'],
                                    ['OpenAI', 'De pago, gpt-4o-mini.', 'https://platform.openai.com/api-keys', 'platform.openai.com', openaiKey, setOpenaiKey, 'sk-…'],
                                    ['DeepSeek', 'El más barato para texto, sin visión.', 'https://platform.deepseek.com/api_keys', 'platform.deepseek.com', dsKey, setDsKey, 'sk-…'],
                                ].map(([label, note, href, host, val, set, ph]) => (
                                    <label key={label} className="ms-field">
                                        <span className="ms-label" style={{color:'var(--ink)', fontSize:15}}>{label}</span>
                                        <input value={val} onChange={e=>set(e.target.value)} className="ms-input" style={{fontSize:14}} placeholder={ph} autoCapitalize="off" autoCorrect="off" spellCheck="false"/>
                                        <span className="ms-hint" style={{display:'block'}}>{note} <a href={href} target="_blank" rel="noopener" className="underline">{host}</a></span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {(modal === 'dictate' || modal === 'chef' || modal === 'ticket') && (
                            <div className="space-y-4">
                                {modal === 'dictate' && (
                                    <label className="ms-field">
                                        <span className="ms-label">Dicta o escribe, por ejemplo: “compré leche, falta huevo”.</span>
                                        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="ms-input" rows="3"/>
                                    </label>
                                )}
                                {loading && <p style={{color:'var(--ink-2)'}} className="animate-pulse">Pensando…</p>}
                                {!loading && result && (
                                    <div>
                                        <div className="ms-prose">{result}</div>
                                        <div className="flex gap-5 mt-3">
                                            {modal === 'chef' && window.__lastChefRecipe && (
                                                <button onClick={()=>{ openRecipeWizard(window.__lastChefRecipe.title, window.__lastChefRecipe.steps); setModal(null); }} className="ms-link-strong" style={{paddingLeft:0}}>Ver paso a paso</button>
                                            )}
                                            <button onClick={()=>{setResult(null); setPrompt(''); window.__lastChefRecipe = null;}} className="ms-link">Limpiar</button>
                                        </div>
                                    </div>
                                )}
                                {!loading && !result && modal !== 'dictate' && <p className="ms-hint">Sin resultado todavía.</p>}
                            </div>
                        )}

                        {modal === 'suggest' && (() => {
                            const today = new Date();
                            const suggested = items.filter(i => {
                                if (!i.isEssential || i.status !== 'stocked' || !i.lastBought) return false;
                                const lb = new Date(i.lastBought);
                                if (isNaN(lb)) return false;
                                const days = Math.floor((today - lb) / (1000 * 60 * 60 * 24));
                                return days > 7;
                            });
                            if (suggested.length === 0) {
                                return <p className="ms-hint" style={{fontSize:15}}>Tu alacena se ve bien, nada por sugerir.</p>;
                            }
                            return (
                                <div>
                                    <p className="ms-hint" style={{marginTop:0, marginBottom:8}}>Esenciales que llevan más de 7 días sin volver a comprarse.</p>
                                    <div style={{borderTop:'1px solid var(--rule)', margin:'0 calc(-1 * var(--gutter))'}}>
                                        {suggested.map(s => (
                                            <div key={s.id} className="ms-row">
                                                <div className="flex-1 min-w-0">
                                                    <p className="ms-name">{s.name}</p>
                                                    <p className="ms-meta">Última compra {s.lastBought}</p>
                                                </div>
                                                <button onClick={()=>{ setItems(prev => prev.map(i => i.id === s.id ? {...i, status: 'needed'} : i)); }} className="ms-link-strong">A la lista</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                </Sheet>
            )}

            {!onboarded && (() => {
                const done = () => { localStorage.setItem('onboarded_v1','1'); setOnboarded(true); };
                if (obStep === 'create') return (
                    <Sheet z={60} testid="onboarding" title="Crear grupo"
                        footer={<>
                            <button disabled={!obName.trim() || !obNick.trim() || obLoading} onClick={async ()=>{
                                setObLoading(true); setObError(null);
                                const r = await cloudCreateGroup(obName.trim(), obNick.trim());
                                setObLoading(false);
                                if (r.error) { setObError(r.error); return; }
                                setObShareCode(r.code); setObShareName(obName.trim()); setObStep('success');
                            }} className="ms-btn ms-btn-primary">{obLoading ? 'Creando…' : 'Crear grupo'}</button>
                            <button onClick={()=>setObStep('welcome')} className="ms-btn ms-btn-secondary">Volver</button>
                        </>}>
                        <div className="space-y-4">
                            <p className="ms-hint" style={{marginTop:0, fontSize:15}}>Tú serás el primer miembro. Comparte el código para que otros se unan.</p>
                            <label className="ms-field"><span className="ms-label">Nombre del grupo</span><input value={obName} onChange={e=>setObName(e.target.value)} placeholder="Familia, roomies…" className="ms-input"/></label>
                            <label className="ms-field"><span className="ms-label">Tu nombre en el grupo</span><input value={obNick} onChange={e=>setObNick(e.target.value)} placeholder="Pedro" className="ms-input"/></label>
                            {obError && <p style={{color:'var(--danger)', fontSize:14}}>{obError}</p>}
                        </div>
                    </Sheet>
                );
                if (obStep === 'join') return (
                    <Sheet z={60} testid="onboarding" title="Unirme con código"
                        footer={<>
                            <button disabled={obCode.trim().length < 4 || !obNick.trim() || obLoading} onClick={async ()=>{
                                setObLoading(true); setObError(null);
                                const r = await cloudJoinGroup(obCode, obNick.trim());
                                setObLoading(false);
                                if (r.error) { setObError(r.error === 'group not found' ? 'No encontré ese grupo. Revisa el código.' : r.error); return; }
                                done();
                            }} className="ms-btn ms-btn-primary">{obLoading ? 'Uniéndome…' : 'Unirme'}</button>
                            <button onClick={()=>setObStep('welcome')} className="ms-btn ms-btn-secondary">Volver</button>
                        </>}>
                        <div className="space-y-4">
                            <p className="ms-hint" style={{marginTop:0, fontSize:15}}>Pega el código de 8 letras que te compartieron.</p>
                            <label className="ms-field"><span className="ms-label">Código del grupo</span><input value={obCode} onChange={e=>setObCode(e.target.value.toUpperCase())} placeholder="AB23PQ12" maxLength={8} autoCapitalize="characters" autoCorrect="off" className="ms-input uppercase" style={{letterSpacing:'.15em'}}/></label>
                            <label className="ms-field"><span className="ms-label">Tu nombre en el grupo</span><input value={obNick} onChange={e=>setObNick(e.target.value)} placeholder="Steph" className="ms-input"/></label>
                            {obError && <p style={{color:'var(--danger)', fontSize:14}}>{obError}</p>}
                        </div>
                    </Sheet>
                );
                if (obStep === 'success') return (
                    <Sheet z={60} testid="onboarding" title={`${obShareName} listo`}
                        footer={<>
                            <button onClick={async ()=>{
                                const text = `Únete a "${obShareName}" en Mi Súper con el código ${obShareCode}\n${location.origin}${location.pathname}`;
                                try {
                                    if (navigator.share) await navigator.share({ text });
                                    else { await navigator.clipboard.writeText(text); alert('Copiado al portapapeles'); }
                                } catch {}
                            }} className="ms-btn ms-btn-primary">Compartir código</button>
                            <button onClick={done} className="ms-btn ms-btn-secondary">Empezar</button>
                        </>}>
                        <p className="ms-hint" style={{marginTop:0, fontSize:15}}>Comparte este código con quien quieras en el grupo:</p>
                        <p className="serif text-center" style={{fontSize:34, letterSpacing:'.12em', padding:'18px 0', borderTop:'1px solid var(--rule)', borderBottom:'1px solid var(--rule)', marginTop:12}}>{obShareCode}</p>
                    </Sheet>
                );
                return (
                    <Sheet z={60} testid="onboarding" title="Mi Súper"
                        footer={cloudConfigured ? <>
                            <button onClick={()=>{ setObStep('create'); setObError(null); }} className="ms-btn ms-btn-primary">Crear grupo nuevo</button>
                            <button onClick={()=>{ setObStep('join'); setObError(null); }} className="ms-btn ms-btn-secondary">Unirme con código</button>
                            <button onClick={done} className="ms-btn ms-btn-secondary">Solo este dispositivo</button>
                        </> : <>
                            <button onClick={()=>{ done(); setModal('settings'); }} className="ms-btn ms-btn-primary">Configurar llave de IA</button>
                            <button onClick={done} className="ms-btn ms-btn-secondary">Empezar sin IA</button>
                        </>}>
                        <p style={{fontSize:17, lineHeight:1.5}}>Tu lista del súper, lo que tienes en casa y lo que ya compraste, en un solo lugar.</p>
                        <ul className="mt-3 space-y-1" style={{fontSize:15, color:'var(--ink-2)', listStyle:'disc', paddingLeft:20}}>
                            <li>Voz, tickets y chef con IA, opcional.</li>
                            <li>Funciona sin conexión dentro del súper.</li>
                            {cloudConfigured && <li>Lista compartida en tiempo real con tu grupo.</li>}
                        </ul>
                        {cloudConfigured ? (
                            <button onClick={signInWithGoogle} className="ms-btn ms-btn-secondary mt-5">
                                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/><path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                                Continuar con Google
                            </button>
                        ) : (
                            <p className="ms-hint mt-4">Tus datos viven en este teléfono. Para voz, tickets y chef necesitas una llave de IA (Gemini es gratis); se configura en Ajustes.</p>
                        )}
                    </Sheet>
                );
            })()}

            {recipeWizard && (() => {
                const { title, steps, step } = recipeWizard;
                const finished = step >= steps.length;
                return (
                    <Sheet z={80} testid="recipe" onClose={()=>setRecipeWizard(null)}
                        title={<><span style={{display:'block', fontSize:13, color:'var(--ink-3)', fontFamily:'-apple-system, system-ui, sans-serif'}}>{finished ? 'Receta terminada' : `Paso ${step + 1} de ${steps.length}`}</span>{title}</>}
                        footer={
                            <div className="grid grid-cols-2 gap-2">
                                <button disabled={step === 0} onClick={()=>setRecipeWizard(w=>({...w, step: w.step - 1}))} className="ms-btn ms-btn-secondary">Anterior</button>
                                {!finished
                                    ? <button onClick={()=>setRecipeWizard(w=>({...w, step: w.step + 1}))} className="ms-btn ms-btn-primary">Siguiente</button>
                                    : <button onClick={()=>setRecipeWizard(null)} className="ms-btn ms-btn-primary">Cerrar</button>}
                            </div>
                        }>
                        {!finished
                            ? <p className="serif" style={{fontSize:24, lineHeight:1.4}}>{steps[step]}</p>
                            : <p className="serif" style={{fontSize:24}}>Listo. Que te aproveche.</p>}
                    </Sheet>
                );
            })()}
        </div>
    );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SuperApp />);

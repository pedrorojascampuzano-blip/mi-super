// GENERADO por scripts/build.mjs desde src/app.jsx. No editar a mano.
const { useState, useEffect, useRef } = React;
const Icon = ({ name, size = 18, className = "" }) => {
  const i = {
    Plus: /* @__PURE__ */ React.createElement("path", { d: "M12 5v14M5 12h14" }),
    ShoppingBag: /* @__PURE__ */ React.createElement("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" }),
    Home: /* @__PURE__ */ React.createElement("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" }),
    History: /* @__PURE__ */ React.createElement("path", { d: "M12 8v4l3 3 M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" }),
    Check: /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }),
    Trash: /* @__PURE__ */ React.createElement("path", { d: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    Mic: /* @__PURE__ */ React.createElement("path", { d: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8" }),
    Settings: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })),
    Sparkles: /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }),
    Chef: /* @__PURE__ */ React.createElement("path", { d: "M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z M6 17h12" }),
    X: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })),
    ArrowRight: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("line", { x1: "5", y1: "12", x2: "19", y2: "12" }), /* @__PURE__ */ React.createElement("polyline", { points: "12 5 19 12 12 19" })),
    Tag: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }), /* @__PURE__ */ React.createElement("line", { x1: "7", y1: "7", x2: "7.01", y2: "7" })),
    Clock: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "10" }), /* @__PURE__ */ React.createElement("polyline", { points: "12 6 12 12 16 14" })),
    Upload: /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" }),
    Download: /* @__PURE__ */ React.createElement("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" }),
    Stop: /* @__PURE__ */ React.createElement("rect", { x: "6", y: "6", width: "12", height: "12" }),
    Camera: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "13", r: "4" })),
    Edit: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }), /* @__PURE__ */ React.createElement("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })),
    Star: /* @__PURE__ */ React.createElement("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }),
    Archive: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("polyline", { points: "21 8 21 21 3 21 3 8" }), /* @__PURE__ */ React.createElement("rect", { x: "1", y: "3", width: "22", height: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "10", y1: "12", x2: "14", y2: "12" })),
    Search: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })),
    Layers: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }), /* @__PURE__ */ React.createElement("polyline", { points: "2 17 12 22 22 17" }), /* @__PURE__ */ React.createElement("polyline", { points: "2 12 12 17 22 12" })),
    AlertTriangle: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "9", x2: "12", y2: "13" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })),
    Copies: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }))
  };
  return /* @__PURE__ */ React.createElement("svg", { className, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, i[name]);
};
const APP_VERSION = "23";
const hardRefresh = async () => {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) await r.unregister();
    }
    if (window.caches) {
      const keys = await caches.keys();
      for (const k of keys) await caches.delete(k);
    }
  } catch (e) {
    console.error("hardRefresh", e);
  }
  location.href = location.pathname + "?cb=" + Date.now();
};
const SuperApp = () => {
  const [key, setKey] = useState(() => localStorage.getItem("gem_key") || "");
  const [dsKey, setDsKey] = useState(() => localStorage.getItem("ds_key") || "");
  const [claudeKey, setClaudeKey] = useState(() => localStorage.getItem("cl_key") || "");
  const [openaiKey, setOpenaiKey] = useState(() => localStorage.getItem("oa_key") || "");
  const [tab, setTab] = useState("shop");
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("data_v4")) || [];
    } catch {
      return [];
    }
  });
  const [savedTags, setSavedTags] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("saved_tags")) || ["General", "Costco", "Super", "Mercado", "Oxxo"];
    } catch {
      return ["General", "Costco", "Super", "Mercado", "Oxxo"];
    }
  });
  const [name, setName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selTags, setSelTags] = useState(["General"]);
  const [filter, setFilter] = useState("Todos");
  const [invFilter, setInvFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [groupByPlace, setGroupByPlace] = useState(false);
  const [modal, setModal] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewItemPhotos, setViewItemPhotos] = useState([]);
  const [confirmData, setConfirmData] = useState({ isOpen: false, msg: "", action: null, altAction: null, altText: "" });
  const recognitionRef = useRef(null);
  const categories = ["Alimentos", "Medicamentos", "Limpieza", "Hogar", "Mascotas", "Otros"];
  const newId = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now() + "_" + Math.random().toString(36).slice(2);
  const todayISO = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const nicknameOf = (uid) => {
    if (!uid) return null;
    const m = members.find((x) => x.member_id === uid);
    return m?.nickname || "alguien";
  };
  const relativeTime = (iso) => {
    if (!iso) return "";
    const now = Date.now();
    const t = new Date(iso).getTime();
    if (isNaN(t)) return "";
    const s = Math.max(0, Math.round((now - t) / 1e3));
    if (s < 60) return "hace unos segundos";
    const m = Math.round(s / 60);
    if (m < 60) return `hace ${m} min`;
    const h = Math.round(m / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.round(h / 24);
    return `hace ${d} d`;
  };
  const [undoSnapshot, setUndoSnapshot] = useState(null);
  const undoTimerRef = useRef(null);
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem("onboarded_v1") === "1");
  const [recipeWizard, setRecipeWizard] = useState(null);
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
    const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
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
    window.addEventListener("sw-update-available", onUpdate);
    return () => window.removeEventListener("sw-update-available", onUpdate);
  }, []);
  const applyUpdate = () => {
    const w = window.__swWaiting;
    if (w) w.postMessage({ type: "SKIP_WAITING" });
    else window.location.reload();
  };
  const [obStep, setObStep] = useState("welcome");
  const [obName, setObName] = useState("");
  const [obNick, setObNick] = useState("");
  const [obCode, setObCode] = useState("");
  const [obError, setObError] = useState(null);
  const [obLoading, setObLoading] = useState(false);
  const [obShareCode, setObShareCode] = useState(null);
  const [obShareName, setObShareName] = useState(null);
  const cloudConfigured = !!(window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase);
  const [groupId, setGroupId] = useState(() => localStorage.getItem("cloud_group_id") || null);
  const [groupCode, setGroupCode] = useState(() => localStorage.getItem("cloud_group_code") || null);
  const [groupName, setGroupName] = useState(() => localStorage.getItem("cloud_group_name") || null);
  const [nickname, setNickname] = useState(() => localStorage.getItem("cloud_nickname") || "");
  const [members, setMembers] = useState([]);
  const [syncStatus, setSyncStatus] = useState("offline");
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
        if (!session) {
          sbRef.current.auth.signInAnonymously();
          return;
        }
        const provider = session.user?.app_metadata?.provider;
        if (provider === "google") {
          setGoogleUser(session.user);
          const meta = session.user.user_metadata;
          if (meta?.cloud_group_id && !localStorage.getItem("cloud_group_id")) {
            setGroupId(meta.cloud_group_id);
            setGroupCode(meta.cloud_group_code || null);
            setGroupName(meta.cloud_group_name || "Mi grupo");
            localStorage.setItem("onboarded_v1", "1");
            setOnboarded(true);
          }
        }
      });
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("data_v4", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("saved_tags", JSON.stringify(savedTags));
  }, [savedTags]);
  useEffect(() => {
    localStorage.setItem("gem_key", key);
  }, [key]);
  useEffect(() => {
    localStorage.setItem("ds_key", dsKey);
  }, [dsKey]);
  useEffect(() => {
    localStorage.setItem("cl_key", claudeKey);
  }, [claudeKey]);
  useEffect(() => {
    localStorage.setItem("oa_key", openaiKey);
  }, [openaiKey]);
  useEffect(() => {
    groupId ? localStorage.setItem("cloud_group_id", groupId) : localStorage.removeItem("cloud_group_id");
  }, [groupId]);
  useEffect(() => {
    groupCode ? localStorage.setItem("cloud_group_code", groupCode) : localStorage.removeItem("cloud_group_code");
  }, [groupCode]);
  useEffect(() => {
    groupName ? localStorage.setItem("cloud_group_name", groupName) : localStorage.removeItem("cloud_group_name");
  }, [groupName]);
  useEffect(() => {
    nickname ? localStorage.setItem("cloud_nickname", nickname) : localStorage.removeItem("cloud_nickname");
  }, [nickname]);
  useEffect(() => {
    if (!cloudMode || !sbRef.current) return;
    const sb = sbRef.current;
    let alive = true;
    setSyncStatus("connecting");
    const itemFromRow = (r) => ({
      id: r.id,
      name: r.name,
      places: r.places || ["General"],
      category: r.category || "Otros",
      status: r.status,
      isEssential: !!r.is_essential,
      lastBought: r.last_bought,
      qty: r.qty || "",
      price: r.price ?? "",
      expiry: r.expiry || "",
      expiryType: r.expiry_type || "",
      photoUrl: r.photo_url || "",
      extraPhotoUrls: r.extra_photo_urls || [],
      unitCount: r.unit_count ?? null,
      unitSize: r.unit_size ?? null,
      unitType: r.unit_type || "",
      purchaseAt: r.purchase_at || "",
      updatedBy: r.updated_by,
      updatedAt: r.updated_at
    });
    const isUuid = (s) => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
    (async () => {
      const [{ data: rows, error: e1 }, { data: tagRows }, { data: memberRows }] = await Promise.all([
        sb.from("items").select("*").eq("group_id", groupId),
        sb.from("saved_tags").select("tag").eq("group_id", groupId),
        sb.from("group_members").select("member_id, nickname").eq("group_id", groupId)
      ]);
      if (!alive) return;
      if (e1) {
        setSyncStatus("error");
        return;
      }
      const fetched = (rows || []).map(itemFromRow);
      const cloudIds = new Set(fetched.map((i) => i.id));
      const localOnly = items.filter((i) => !cloudIds.has(i.id)).map((i) => isUuid(i.id) ? i : { ...i, id: newId() });
      const merged = [...fetched, ...localOnly];
      lastSyncedRef.current = fetched;
      if (localOnly.length === 0) remoteApplyRef.current = true;
      setItems(merged);
      if (tagRows && tagRows.length) setSavedTags((prev) => Array.from(/* @__PURE__ */ new Set(["General", ...prev, ...tagRows.map((t) => t.tag)])));
      setMembers(memberRows || []);
      setSyncStatus("online");
    })();
    channelRef.current = sb.channel(`group:${groupId}`).on("postgres_changes", { event: "*", schema: "public", table: "items", filter: `group_id=eq.${groupId}` }, async () => {
      const { data } = await sb.from("items").select("*").eq("group_id", groupId);
      if (!alive || !data) return;
      const fetched = data.map(itemFromRow);
      remoteApplyRef.current = true;
      lastSyncedRef.current = fetched;
      setItems(fetched);
    }).on("postgres_changes", { event: "*", schema: "public", table: "group_members", filter: `group_id=eq.${groupId}` }, async () => {
      const { data } = await sb.from("group_members").select("member_id, nickname").eq("group_id", groupId);
      if (alive && data) setMembers(data);
    }).on("postgres_changes", { event: "*", schema: "public", table: "saved_tags", filter: `group_id=eq.${groupId}` }, async () => {
      const { data } = await sb.from("saved_tags").select("tag").eq("group_id", groupId);
      if (alive && data) setSavedTags((prev) => Array.from(/* @__PURE__ */ new Set(["General", ...prev.filter((t) => t !== "General"), ...data.map((d) => d.tag)])));
    }).subscribe();
    return () => {
      alive = false;
      if (channelRef.current) {
        sb.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [cloudMode, groupId]);
  useEffect(() => {
    if (!cloudMode || !sbRef.current) return;
    if (remoteApplyRef.current) {
      remoteApplyRef.current = false;
      return;
    }
    const sb = sbRef.current;
    const prev = lastSyncedRef.current;
    const prevMap = new Map(prev.map((i) => [i.id, i]));
    const nextMap = new Map(items.map((i) => [i.id, i]));
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
          const rows = toUpsert.map((i) => ({
            id: i.id,
            group_id: groupId,
            name: i.name,
            places: i.places,
            category: i.category,
            status: i.status,
            is_essential: !!i.isEssential,
            last_bought: i.lastBought || null,
            qty: i.qty || "",
            price: i.price === "" || i.price == null ? null : Number(i.price),
            expiry: i.expiry || null,
            photo_url: i.photoUrl || null,
            extra_photo_urls: i.extraPhotoUrls || [],
            unit_count: i.unitCount == null || i.unitCount === "" ? null : Number(i.unitCount),
            unit_size: i.unitSize == null || i.unitSize === "" ? null : Number(i.unitSize),
            unit_type: i.unitType || null,
            purchase_at: i.purchaseAt || null,
            expiry_type: i.expiryType || null
          }));
          const { error } = await sb.from("items").upsert(rows);
          if (error) throw error;
        }
        if (toDelete.length) {
          const { error } = await sb.from("items").delete().in("id", toDelete);
          if (error) throw error;
        }
        lastSyncedRef.current = items;
        setSyncStatus("online");
      } catch (e) {
        console.error("sync failed", e);
        setSyncStatus("error");
      }
    })();
  }, [items, cloudMode, groupId]);
  useEffect(() => {
    if (!cloudMode) return;
    const onOnline = () => {
      setSyncStatus("connecting");
      lastSyncedRef.current = [];
      setItems((prev) => [...prev]);
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [cloudMode]);
  const cloudCreateGroup = async (gName, gNick) => {
    const sb = sbRef.current;
    if (!sb) return { error: "Supabase no inicializado" };
    await sb.auth.getSession().then(({ data: data2 }) => {
      if (!data2.session) return sb.auth.signInAnonymously();
    });
    const { data, error } = await sb.rpc("create_group", { p_name: gName, p_nickname: gNick });
    if (error) return { error: error.message };
    const row = Array.isArray(data) ? data[0] : data;
    setGroupName(gName);
    setNickname(gNick);
    setGroupId(row.group_id);
    setGroupCode(row.code);
    sb.auth.getSession().then(({ data: s }) => {
      if (s.session?.user?.app_metadata?.provider === "google")
        sb.auth.updateUser({ data: { cloud_group_id: row.group_id, cloud_group_code: row.code, cloud_group_name: gName } });
    });
    return { code: row.code };
  };
  const cloudJoinGroup = async (code, gNick) => {
    const sb = sbRef.current;
    if (!sb) return { error: "Supabase no inicializado" };
    await sb.auth.getSession().then(({ data: data2 }) => {
      if (!data2.session) return sb.auth.signInAnonymously();
    });
    const { data, error } = await sb.rpc("join_group", { p_code: code.trim().toUpperCase(), p_nickname: gNick });
    if (error) return { error: error.message };
    const { data: g } = await sb.from("groups").select("name").eq("id", data).single();
    setGroupName(g?.name || "Grupo");
    setGroupCode(code.trim().toUpperCase());
    setNickname(gNick);
    setGroupId(data);
    sb.auth.getSession().then(({ data: s }) => {
      if (s.session?.user?.app_metadata?.provider === "google")
        sb.auth.updateUser({ data: { cloud_group_id: data, cloud_group_code: code.trim().toUpperCase(), cloud_group_name: g?.name || "Grupo" } });
    });
    return { ok: true };
  };
  const signInWithGoogle = async () => {
    const sb = sbRef.current;
    if (!sb) return;
    await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href.split("#")[0] } });
  };
  const cloudLeaveGroup = () => {
    if (channelRef.current && sbRef.current) {
      sbRef.current.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setGroupId(null);
    setGroupCode(null);
    setGroupName(null);
    setMembers([]);
    setSyncStatus("offline");
    lastSyncedRef.current = [];
  };
  const cloudUploadLocal = async () => {
    const sb = sbRef.current;
    if (!sb || !groupId) return;
    const localItems = items;
    if (!localItems.length) return;
    const isUuid = (s) => typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
    const normalized = localItems.map((i) => isUuid(i.id) ? i : { ...i, id: newId() });
    const rows = normalized.map((i) => ({
      id: i.id,
      group_id: groupId,
      name: i.name,
      places: i.places,
      category: i.category,
      status: i.status,
      is_essential: !!i.isEssential,
      last_bought: i.lastBought || null,
      qty: i.qty || "",
      price: i.price === "" || i.price == null ? null : Number(i.price),
      expiry: i.expiry || null
    }));
    const { error } = await sb.from("items").upsert(rows);
    if (!error) {
      setItems(normalized);
      lastSyncedRef.current = normalized;
    }
    return { error: error?.message };
  };
  const handleSmartDelete = (item) => {
    if (item.status === "stocked") {
      setConfirmData({
        isOpen: true,
        msg: `¿Qué pasó con ${item.name}?`,
        action: () => {
          setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: item.isEssential ? "needed" : "inactive" } : i));
          setConfirmData({ isOpen: false });
        },
        actionText: item.isEssential ? "Falta (Esencial)" : "Se acabó (Guardar)",
        altAction: () => {
          setItems((prev) => prev.filter((i) => i.id !== item.id));
          setConfirmData({ isOpen: false });
        },
        altText: "Borrar Definitivo"
      });
    } else if (item.status === "inactive") {
      setConfirmData({
        isOpen: true,
        msg: `¿Borrar definitivamente del historial?`,
        action: () => {
          setItems((prev) => prev.filter((i) => i.id !== item.id));
          setConfirmData({ isOpen: false });
        },
        actionText: "Sí, borrar",
        altAction: () => setConfirmData({ isOpen: false }),
        altText: "Cancelar"
      });
    } else {
      setConfirmData({
        isOpen: true,
        msg: "¿Eliminar de la lista?",
        action: () => {
          setItems((prev) => prev.filter((i) => i.id !== item.id));
          setConfirmData({ isOpen: false });
        },
        actionText: "Eliminar"
      });
    }
  };
  const requestCheckout = () => {
    const count = items.filter((i) => i.status === "cart").length;
    if (count === 0) return;
    setConfirmData({
      isOpen: true,
      msg: `¿Mover ${count} productos a Casa?`,
      action: () => {
        const snapshot = items;
        setItems((prev) => prev.map((i) => i.status === "cart" ? { ...i, status: "stocked", lastBought: todayISO() } : i));
        setTab("inv");
        setConfirmData({ isOpen: false });
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        setUndoSnapshot({ items: snapshot, label: `${count} productos a Casa` });
        undoTimerRef.current = setTimeout(() => setUndoSnapshot(null), 5e3);
      },
      actionText: "Finalizar Compra"
    });
  };
  const handleExportCSV = () => {
    const headers = ["ID,Nombre,Lugares,Categoria,Estado,Esencial,UltimaCompra,Cantidad,Precio,Caducidad"];
    const rows = items.map(
      (i) => `${i.id},"${i.name.replace(/"/g, '""')}","${i.places.join("|")}","${i.category || "Otros"}","${i.status}","${i.isEssential ? "Si" : "No"}","${i.lastBought || ""}","${i.qty || ""}","${i.price || ""}","${i.expiry || ""}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `misuper_backup_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const parseCSVLine = (line) => {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (q) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          q = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === ",") {
          out.push(cur);
          cur = "";
        } else if (ch === '"' && cur === "") {
          q = true;
        } else {
          cur += ch;
        }
      }
    }
    out.push(cur);
    return out;
  };
  const handleImportCSV = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (evt) => {
      const lines = evt.target.result.split(/\r?\n/);
      const validStatuses = ["needed", "cart", "stocked", "inactive"];
      const n = lines.slice(1).map((line) => {
        if (!line.trim()) return null;
        const c = parseCSVLine(line);
        if (!c[1]) return null;
        const status = validStatuses.includes(c[4]) ? c[4] : "stocked";
        return {
          id: newId(),
          name: c[1] || "Item",
          places: c[2] ? c[2].split("|").filter(Boolean) : ["General"],
          category: c[3] || "Otros",
          status,
          isEssential: c[5] === "Si",
          lastBought: c[6] || null,
          qty: c[7] || "",
          price: c[8] || "",
          expiry: c[9] || ""
        };
      }).filter(Boolean);
      if (n.length) {
        setConfirmData({
          isOpen: true,
          msg: `¿Importar ${n.length} productos?`,
          action: () => {
            setItems((prev) => [...prev, ...n]);
            setConfirmData({ isOpen: false });
          },
          actionText: "Importar"
        });
      }
    };
    r.readAsText(f);
    e.target.value = "";
  };
  const callGemini = async (textPrompt, imageData, wantJson) => {
    const parts = [{ text: textPrompt }];
    if (imageData) parts.push({ inline_data: { mime_type: imageData.mime, data: imageData.data } });
    const body = { contents: [{ parts }] };
    if (wantJson) body.generationConfig = { responseMimeType: "application/json" };
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "Gemini error");
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };
  const callDeepSeek = async (textPrompt, imageData, wantJson) => {
    if (imageData) throw new Error("DeepSeek no soporta imágenes");
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
    if (data.error) throw new Error(data.error.message || "DeepSeek error");
    return data.choices?.[0]?.message?.content || "";
  };
  const callClaude = async (textPrompt, imageData, wantJson) => {
    const userContent = imageData ? [
      { type: "image", source: { type: "base64", media_type: imageData.mime, data: imageData.data } },
      { type: "text", text: textPrompt }
    ] : textPrompt;
    const body = {
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      system: wantJson ? "Eres un asistente de inventario experto. Responde SOLO con JSON válido. Sin markdown, sin explicaciones, solo el JSON." : "Eres un asistente de inventario experto.",
      messages: [{ role: "user", content: userContent }]
    };
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": claudeKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "Claude error");
    return data.content?.[0]?.text || "";
  };
  const callOpenAI = async (textPrompt, imageData, wantJson) => {
    const userContent = imageData ? [
      { type: "text", text: textPrompt },
      { type: "image_url", image_url: { url: `data:${imageData.mime};base64,${imageData.data}` } }
    ] : textPrompt;
    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: wantJson ? "Eres un asistente de inventario experto. Responde SOLO con JSON válido." : "Eres un asistente de inventario experto." },
        { role: "user", content: userContent }
      ]
    };
    if (wantJson) body.response_format = { type: "json_object" };
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "OpenAI error");
    return data.choices?.[0]?.message?.content || "";
  };
  const callAI = async (textPrompt, imageData = null, wantJson = false) => {
    setLoading(true);
    setResult(null);
    const providers = {
      gemini: { has: !!key, vision: true, fn: callGemini },
      claude: { has: !!claudeKey, vision: true, fn: callClaude },
      openai: { has: !!openaiKey, vision: true, fn: callOpenAI },
      deepseek: { has: !!dsKey, vision: false, fn: callDeepSeek }
    };
    const order = imageData ? ["gemini", "claude", "openai"] : wantJson ? ["deepseek", "gemini", "openai", "claude"] : ["claude", "openai", "gemini", "deepseek"];
    const errors = [];
    for (const name2 of order) {
      const p = providers[name2];
      if (!p.has) continue;
      if (imageData && !p.vision) continue;
      try {
        const out = await p.fn(textPrompt, imageData, wantJson);
        setLoading(false);
        return out;
      } catch (e) {
        console.error(`${name2} falló:`, e);
        errors.push(`${name2}: ${e.message}`);
      }
    }
    setLoading(false);
    if (errors.length === 0) {
      setResult(imageData ? "⚠️ Para tickets necesitas API key de Gemini, Claude u OpenAI." : "⚠️ Configura al menos una API Key en Ajustes.");
    } else {
      setResult("Todos los providers fallaron · " + errors.join(" | "));
    }
    return null;
  };
  const cleanJSON = (text) => {
    if (!text) return text;
    const arr = text.indexOf("[");
    const obj = text.indexOf("{");
    let s = -1, e = -1;
    if (arr !== -1 && (obj === -1 || arr < obj)) {
      s = arr;
      e = text.lastIndexOf("]");
    } else if (obj !== -1) {
      s = obj;
      e = text.lastIndexOf("}");
    }
    return s !== -1 && e !== -1 ? text.substring(s, e + 1) : text;
  };
  const handleDictation = async () => {
    if (!prompt.trim()) return;
    const p = `Analiza: "${prompt}". Devuelve JSON con esta forma exacta: {"items":[{"name":"x","places":["y"],"status":"needed|stocked","qty":"1","expiry":"YYYY-MM-DD","category":"Alimentos|Medicamentos|Limpieza|Hogar|Mascotas|Otros"}]}. Si dice "tengo" usa "stocked". Si no hay categoria, adivina. SOLO JSON, sin markdown.`;
    const raw = await callAI(p, null, true);
    if (raw) {
      try {
        const parsed = JSON.parse(cleanJSON(raw));
        const arr = Array.isArray(parsed) ? parsed : parsed.items || [];
        const newItems = arr.map((i) => ({
          id: newId(),
          name: i.name,
          places: i.places || ["General"],
          status: i.status || "needed",
          lastBought: i.status === "stocked" ? todayISO() : null,
          qty: i.qty || "",
          price: "",
          expiry: i.expiry || "",
          category: i.category || "Otros",
          isEssential: false
        }));
        setItems((prev) => [...prev, ...newItems]);
        setResult(`✅ ${newItems.length} items agregados.`);
        setPrompt("");
      } catch (e) {
        setResult("La IA no devolvio un formato valido. Intenta de nuevo.");
      }
    }
  };
  const handleTicketUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModal("ticket");
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      const mimeType = file.type;
      const promptText = `Analiza ticket de compra. Extrae productos y precios. Devuelve JSON con esta forma exacta: {"items":[{"name":"Prod","price":10.50,"qty":"1"}]}. SOLO JSON.`;
      const text = await callAI(promptText, { mime: mimeType, data: base64Data }, true);
      if (text) {
        try {
          const parsed = JSON.parse(cleanJSON(text));
          const ticketItems = Array.isArray(parsed) ? parsed : parsed.items || [];
          if (ticketItems.length === 0) {
            setResult("Ticket procesado pero no se detectaron productos.");
            return;
          }
          let added = 0, updated = 0;
          setItems((prev) => {
            const list2 = [...prev];
            ticketItems.forEach((t) => {
              const idx = list2.findIndex((i) => i.name.toLowerCase().includes(t.name.toLowerCase()));
              if (idx >= 0) {
                list2[idx] = { ...list2[idx], price: t.price, lastBought: todayISO(), status: "stocked" };
                updated++;
              } else {
                list2.push({ id: newId(), name: t.name, places: ["Ticket"], status: "stocked", lastBought: todayISO(), qty: t.qty || "1", price: t.price, expiry: "", category: "Otros", isEssential: false });
                added++;
              }
            });
            return list2;
          });
          setResult(`🧾 Ticket: ${added} nuevos, ${updated} actualizados.`);
        } catch (err) {
          setResult("Error procesando datos del ticket.");
        }
      }
    };
  };
  const handleChef = async () => {
    const stock = items.filter((i) => i.status === "stocked").map((i) => `${i.name} (${i.qty || ""})`).join(", ");
    if (!stock) {
      setResult("Alacena vacía.");
      return;
    }
    const raw = await callAI(`Soy chef. Tengo: ${stock}. Crea receta corta con pasos numerados. Título divertido en la primera línea. Luego los pasos con número y punto.`);
    if (raw) {
      setResult(raw);
      const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
      const title = lines[0]?.replace(/^#+\s*/, "") || "Receta Chef AI";
      const steps = parseRecipeSteps(lines.slice(1).join("\n"));
      if (steps.length >= 2) {
        setResult(raw + '\n\n[Toca "Ver paso a paso" para cocinar]');
        window.__lastChefRecipe = { title, steps };
      }
    }
  };
  const addItem = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    const existing = items.find((i) => i.name.toLowerCase() === name.toLowerCase() && i.status === "inactive");
    if (existing) {
      setItems(items.map((i) => i.id === existing.id ? { ...i, status: tab === "inv" ? "stocked" : "needed" } : i));
    } else {
      const newItem = { id: newId(), name, places: selTags, status: tab === "inv" ? "stocked" : "needed", lastBought: tab === "inv" ? todayISO() : null, qty: "", price: "", expiry: "", category: "Otros", isEssential: false, photoUrl: "", unitCount: null, unitSize: null, unitType: "", purchaseAt: "", expiryType: "" };
      newItem.expiryType = inferExpiryType(newItem) || "";
      setItems([...items, newItem]);
    }
    setName("");
    setSelTags(["General"]);
  };
  const toggleTag = (t) => {
    if (selTags.includes(t)) {
      if (selTags.length > 1) setSelTags(selTags.filter((x) => x !== t));
    } else setSelTags([...selTags, t]);
  };
  const addTag = async () => {
    if (!tagInput || savedTags.includes(tagInput)) return;
    const newTag = tagInput;
    setSavedTags([...savedTags, newTag]);
    setSelTags([...selTags, newTag]);
    setTagInput("");
    if (cloudMode && sbRef.current) {
      try {
        const { error } = await sbRef.current.from("saved_tags").insert({ group_id: groupId, tag: newTag });
        if (error && error.code !== "23505") console.error("saved_tags insert failed", error);
      } catch (e) {
        console.error("saved_tags insert threw", e);
      }
    }
  };
  const openEdit = (item) => {
    setEditItem({ ...item });
    setModal("edit");
  };
  const saveEdit = () => {
    const { _structured, ...clean } = editItem;
    setItems(items.map((i) => i.id === clean.id ? clean : i));
    setModal(null);
    setEditItem(null);
  };
  const compressImage = (file) => new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return resolve(file);
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("No se pudo leer la foto"));
    img.onload = () => {
      const MAX = 1600;
      let { width: w, height: h } = img;
      if (w > MAX || h > MAX) {
        const r = Math.min(MAX / w, MAX / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("No se pudo comprimir la foto"));
        resolve(new File([blob], (file.name || "photo").replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.85);
    };
    img.onerror = () => reject(new Error("No se pudo decodificar la foto (HEIC sin convertir?)"));
    reader.readAsDataURL(file);
  });
  const uploadItemPhoto = async (item, file) => {
    if (!cloudMode || !sbRef.current) throw new Error("Sin sesión / grupo — no se puede subir.");
    const sb = sbRef.current;
    let payload;
    try {
      payload = await compressImage(file);
    } catch (e) {
      console.warn("compress failed, uploading original", e);
      payload = file;
    }
    const ext = payload.type && payload.type.startsWith("image/") ? payload.type.split("/")[1].split("+")[0].slice(0, 6) : "jpg";
    const path = `${groupId}/${item.id}-${Date.now()}.${ext}`;
    const doUpload = () => sb.storage.from("item-photos").upload(path, payload, { upsert: true, cacheControl: "3600", contentType: payload.type || "image/jpeg" });
    let { error } = await doUpload();
    if (error && /401|403|auth|jwt|unauthor/i.test(String(error.message || error.statusCode || ""))) {
      console.warn("upload auth failed, re-auth + retry", error);
      try {
        await sb.auth.signInAnonymously();
      } catch (e) {
        console.warn("re-auth failed", e);
      }
      ({ error } = await doUpload());
    }
    if (error) {
      const detail = [error.message, error.statusCode, error.error].filter(Boolean).join(" · ");
      console.error("upload failed", { error, path, size: payload.size, type: payload.type });
      throw new Error(detail || "Upload falló");
    }
    const { data: pub } = sb.storage.from("item-photos").getPublicUrl(path);
    return pub.publicUrl;
  };
  const handleItemPhotoUpload = async (file) => {
    if (!file || !editItem) return;
    try {
      const url = await uploadItemPhoto(editItem, file);
      setEditItem({ ...editItem, photoUrl: url });
    } catch (e) {
      console.error("photo upload", e);
      alert("Subida falló: " + e.message);
    }
  };
  const handleQuickPhoto = async (item, file) => {
    if (!file) return;
    let url;
    try {
      url = await uploadItemPhoto(item, file);
      setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, photoUrl: url } : x));
    } catch (e) {
      console.error("quick photo", e);
      alert("Foto no subió: " + e.message);
      return;
    }
    const needsEnrich = !item.unitSize && !item.unitCount;
    if (!needsEnrich) return;
    try {
      const enriched = await identifyItemFromPhoto(url);
      setItems((prev) => prev.map((x) => x.id === item.id ? (() => {
        const next = {
          ...x,
          // never overwrite a name the user typed; only fill if blank
          name: x.name && !x.name.startsWith("Identificando") && !x.name.startsWith("Sin identificar") ? x.name : enriched.name || x.name,
          category: x.category && x.category !== "Otros" ? x.category : enriched.category,
          unitCount: x.unitCount ?? enriched.unitCount,
          unitSize: x.unitSize ?? enriched.unitSize,
          unitType: x.unitType || enriched.unitType
        };
        next.expiryType = next.expiryType || inferExpiryType(next) || "";
        return next;
      })() : x));
    } catch (e) {
      console.error("quick photo enrich", e);
    }
  };
  const removeItemPhoto = () => {
    if (editItem) setEditItem({ ...editItem, photoUrl: "" });
  };
  const editAddPhoto = async (file) => {
    if (!editItem || !file) return;
    try {
      const url = await uploadItemPhoto(editItem, file);
      const newExtras = [...editItem.extraPhotoUrls || [], url];
      setEditItem({ ...editItem, extraPhotoUrls: newExtras, photoUrl: editItem.photoUrl || url });
    } catch (e) {
      console.error("edit add photo", e);
      alert("Foto no subió: " + e.message);
    }
  };
  const editAddPhotos = async (files) => {
    const list2 = Array.from(files || []);
    for (let i = 0; i < list2.length; i++) {
      setResult("Subiendo " + (i + 1) + "/" + list2.length + "…");
      await editAddPhoto(list2[i]);
    }
    setResult(null);
  };
  const editRemovePhoto = (url) => {
    if (!editItem) return;
    const newExtras = (editItem.extraPhotoUrls || []).filter((u) => u !== url);
    let newMain = editItem.photoUrl;
    if (newMain === url) newMain = newExtras[0] || "";
    setEditItem({ ...editItem, extraPhotoUrls: newExtras, photoUrl: newMain });
  };
  const editSetMainPhoto = (url) => {
    if (!editItem) return;
    setEditItem({ ...editItem, photoUrl: url });
  };
  const openView = (item) => {
    setViewItem(item);
    const all = [...item.extraPhotoUrls || []];
    if (item.photoUrl && !all.includes(item.photoUrl)) all.unshift(item.photoUrl);
    setViewItemPhotos(all);
    setModal("view");
  };
  const handleAddItemPhoto = async (file) => {
    if (!viewItem || !file) return;
    try {
      const url = await uploadItemPhoto(viewItem, file);
      const newExtras = [...viewItem.extraPhotoUrls || [], url];
      const patch = { extraPhotoUrls: newExtras };
      if (!viewItem.photoUrl) patch.photoUrl = url;
      if (cloudMode && sbRef.current) {
        const dbPatch = { extra_photo_urls: newExtras };
        if (!viewItem.photoUrl) dbPatch.photo_url = url;
        await sbRef.current.from("items").update(dbPatch).eq("id", viewItem.id);
      }
      setItems((prev) => prev.map((x) => x.id === viewItem.id ? { ...x, ...patch } : x));
      setViewItem((prev) => prev ? { ...prev, ...patch } : prev);
      setViewItemPhotos((prev) => [...prev, url]);
    } catch (e) {
      console.error("add item photo", e);
      alert("Foto no subió: " + e.message);
    }
  };
  const handleAddItemPhotos = async (files) => {
    const list2 = Array.from(files || []);
    for (let i = 0; i < list2.length; i++) {
      setResult("Subiendo " + (i + 1) + "/" + list2.length + "…");
      await handleAddItemPhoto(list2[i]);
    }
    setResult(list2.length + " foto(s) agregada(s)");
    setTimeout(() => setResult(null), 3e3);
  };
  const handlePhotoOnlyAdd = async (file, opts = {}) => {
    const { silent = false } = opts;
    if (!file) return { ok: false, reason: "no-file" };
    if (!cloudMode || !sbRef.current) {
      if (!silent) alert("Inicia sesión / únete a un grupo para usar Auto-foto.");
      return { ok: false, reason: "no-session" };
    }
    const placeholderId = newId();
    const placeholder = {
      id: placeholderId,
      name: "Identificando…",
      places: selTags,
      status: tab === "inv" ? "stocked" : "needed",
      lastBought: tab === "inv" ? todayISO() : null,
      qty: "",
      price: "",
      expiry: "",
      category: "Otros",
      isEssential: false,
      photoUrl: "",
      unitCount: null,
      unitSize: null,
      unitType: "",
      purchaseAt: "",
      expiryType: ""
    };
    setItems((prev) => [...prev, placeholder]);
    let photoUrl;
    try {
      photoUrl = await uploadItemPhoto(placeholder, file);
      setItems((prev) => prev.map((x) => x.id === placeholderId ? { ...x, photoUrl } : x));
    } catch (e) {
      console.error("photo-only upload", e);
      if (!silent) alert("Foto no subió: " + e.message);
      setItems((prev) => prev.filter((x) => x.id !== placeholderId));
      return { ok: false, reason: "upload", error: e.message };
    }
    try {
      const enriched = await identifyItemFromPhoto(photoUrl);
      setItems((prev) => prev.map((x) => x.id === placeholderId ? (() => {
        const next = {
          ...x,
          name: enriched.name || "Sin identificar — toca para editar",
          category: enriched.category,
          unitCount: enriched.unitCount,
          unitSize: enriched.unitSize,
          unitType: enriched.unitType
        };
        next.expiryType = inferExpiryType(next) || "";
        return next;
      })() : x));
      return { ok: true, identified: true };
    } catch (e) {
      console.error("vision identify", e);
      setItems((prev) => prev.map((x) => x.id === placeholderId ? { ...x, name: "Sin identificar — toca para editar" } : x));
      if (!silent) setResult("Foto subida pero no se pudo identificar (" + e.message + "). Edita manual.");
      return { ok: true, identified: false, reason: "vision", error: e.message };
    }
  };
  const handleBulkPhotoAdd = async (files) => {
    const list2 = Array.from(files || []);
    if (!list2.length) return;
    if (!cloudMode || !sbRef.current) {
      alert("Inicia sesión / únete a un grupo para subir fotos.");
      return;
    }
    if (list2.length === 1) return handlePhotoOnlyAdd(list2[0]);
    let okUploaded = 0, okIdentified = 0, failed = 0;
    const failures = [];
    for (let i = 0; i < list2.length; i++) {
      setResult("Subiendo " + (i + 1) + " / " + list2.length + "…");
      const res = await handlePhotoOnlyAdd(list2[i], { silent: true });
      if (res.ok) {
        okUploaded++;
        if (res.identified) okIdentified++;
      } else {
        failed++;
        failures.push((list2[i].name || "foto") + ": " + (res.error || res.reason));
      }
    }
    let summary = okUploaded + "/" + list2.length + " subidas";
    if (okIdentified < okUploaded) summary += " · " + (okUploaded - okIdentified) + " sin identificar (toca para editar)";
    if (failed) summary += " · " + failed + " fallaron";
    setResult(summary);
    if (failed) console.error("bulk upload failures", failures);
    setTimeout(() => setResult(null), 6e3);
  };
  const urlToImageData = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("No se pudo bajar la foto (" + resp.status + ")");
    const blob = await resp.blob();
    const mime = blob.type || "image/jpeg";
    const data = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result).split(",")[1]);
      r.onerror = () => rej(r.error);
      r.readAsDataURL(blob);
    });
    return { mime, data };
  };
  const identifyItemFromPhoto = async (photoUrl) => {
    const img = await urlToImageData(photoUrl);
    const prompt2 = `Identifica el producto en la foto y devuelve JSON exactamente con este schema:
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
    const raw = await callAI(prompt2, img, true);
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^```json\n?|\n?```$/g, "").trim());
    } catch (e) {
      throw new Error("Vision devolvió JSON inválido: " + raw.slice(0, 120));
    }
    const valid = ["Alimentos", "Medicamentos", "Limpieza", "Hogar", "Mascotas", "Otros"];
    const units = ["g", "kg", "mg", "oz", "lb", "ml", "l", "oz_fl", "pz", "pkg", "bolsa", "lata", "caja", "botella"];
    return {
      name: parsed.name && String(parsed.name).trim() || "",
      category: valid.includes(parsed.category) ? parsed.category : "Otros",
      unitCount: Number.isFinite(parsed.unit_count) ? Math.round(parsed.unit_count) : null,
      unitSize: Number.isFinite(parsed.unit_size) ? Number(parsed.unit_size) : null,
      unitType: units.includes(parsed.unit_type) ? parsed.unit_type : ""
    };
  };
  const inferExpiryType = (it) => {
    const t = ((it.name || "") + " " + (it.category || "")).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
    const strictHits = [
      "leche",
      "yogurt",
      "yoghurt",
      "crema",
      "queso fresco",
      "queso panela",
      "queso oaxaca",
      "queso ricotta",
      "cottage",
      "jamon",
      "jamón",
      "salchich",
      "tocino",
      "chorizo",
      "pollo",
      "carne",
      "pescado",
      "mariscos",
      "camaron",
      "atun fresco",
      "pan ",
      "tortill",
      "baguette",
      "bolillo",
      "muffin",
      "pastel",
      "panque",
      "crepa",
      "mayonesa abierta",
      "aderezo abierto",
      "hummus abierto",
      "pure abierto",
      "huevo",
      "clara liquida",
      "fruta",
      "manzana",
      "platano",
      "pera",
      "sandia",
      "melon",
      "papaya",
      "mango",
      "uva",
      "fresa",
      "arandano",
      "frambuesa",
      "verdura",
      "lechuga",
      "espinaca",
      "jitomate",
      "tomate fresco",
      "cebolla fresca",
      "aguacate",
      "pepino",
      "zanahoria",
      "tofu",
      "tempeh",
      "seitan",
      "leche vegetal",
      "leche de almendra abierta",
      "leche de soya abierta"
    ];
    const bestBeforeHits = [
      "especia",
      "sazonador",
      "sal",
      "azucar",
      "mascabad",
      "miel",
      "vinagre",
      "aceite",
      "salsa de soya",
      "soya",
      "ponzu",
      "mirin",
      "teriyaki",
      "salsa botanera",
      "valentina",
      "tajin",
      "chamoy",
      "chipotle",
      "adobo",
      "achiote",
      "pimient",
      "paprika",
      "comino",
      "oregano",
      "laurel",
      "tomillo",
      "romero",
      "clavo",
      "canela",
      "curcuma",
      "nuez moscada",
      "jengibre en polvo",
      "ajo en polvo",
      "cebolla en polvo",
      "furikake",
      "togarashi",
      "everything bagel",
      "consome",
      "caldo",
      "msg",
      "glutamato",
      "harina",
      "maicena",
      "levadura",
      "royal",
      "polvo para hornear",
      "chia",
      "linaza",
      "semilla",
      "arroz",
      "quinoa",
      "mijo",
      "frijol",
      "garbanzo",
      "lenteja",
      "cebada",
      "avena",
      "espagueti",
      "pasta",
      "fideo",
      "panini",
      "noodle",
      "cafe molido",
      "cafe",
      "te ",
      "infusion",
      "chocolate",
      "cocoa",
      "mantequilla de mani",
      "peanut butter",
      "tahini",
      "nutella",
      "crema de cacahuate",
      "mermelada",
      "jam ",
      "jalea",
      "compota",
      "salmas",
      "pita",
      "crisp",
      "tostada",
      "galleta",
      "crackers",
      "salada",
      "salsa de pescado",
      "tiparos",
      "soja",
      "wasabi en polvo"
    ];
    for (const k of strictHits) if (t.includes(k)) return "strict";
    for (const k of bestBeforeHits) if (t.includes(k)) return "best_before";
    return null;
  };
  const formatUnits = (it) => {
    const c = it.unitCount, s = it.unitSize, u = it.unitType;
    if (c && s && u) {
      const total = c * s;
      return c > 1 ? `${c}×${s} ${u} (${total} ${u})` : `${s} ${u}`;
    }
    if (s && u) return `${s} ${u}`;
    if (it.qty) return it.qty;
    return "";
  };
  const todayStr = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const monthsBetween = (iso, today) => {
    if (!iso) return Infinity;
    const a = new Date(iso), b = new Date(today);
    return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  };
  const isExpired = (i) => i.expiry && i.expiry < todayStr();
  const effectiveExpiryType = (i) => i.expiryType || inferExpiryType(i) || "best_before";
  const isCriticalExpired = (i) => isExpired(i) && effectiveExpiryType(i) === "strict";
  const isSoftExpired = (i) => isExpired(i) && effectiveExpiryType(i) !== "strict";
  const isStale = (i) => !i.lastBought || monthsBetween(i.lastBought, todayStr()) >= 6;
  const noPhoto = (i) => !i.photoUrl;
  const duplicateNameSet = React.useMemo(() => {
    const counts = {};
    for (const i of items) {
      const k = (i.name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\([^)]*\)/g, "").trim();
      if (!k || k.startsWith("identificando") || k.startsWith("sin identificar")) continue;
      counts[k] = (counts[k] || 0) + 1;
    }
    return new Set(Object.entries(counts).filter(([_, n]) => n > 1).map(([k]) => k));
  }, [items]);
  const isDuplicate = (i) => {
    const k = (i.name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/\([^)]*\)/g, "").trim();
    return duplicateNameSet.has(k);
  };
  const displayItems = () => {
    let base;
    if (tab === "shop") base = items.filter((i) => (i.status === "needed" || i.status === "cart") && (filter === "Todos" || i.places.includes(filter) || i.places.includes("General")));
    else if (tab === "inv") {
      if (invFilter === "Agotados") base = items.filter((i) => i.status === "inactive");
      else if (invFilter === "MariKondo") base = items.filter((i) => i.status === "stocked" && (isCriticalExpired(i) || isDuplicate(i) || isStale(i) || noPhoto(i) || isSoftExpired(i)));
      else if (invFilter === "Todos") base = items.filter((i) => i.status === "stocked");
      else base = items.filter((i) => i.status === "stocked" && i.category === invFilter);
    } else if (tab === "hist") base = items.filter((i) => i.lastBought);
    else return [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
      base = base.filter((i) => {
        const n = (i.name || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
        return n.includes(q) || (i.category || "").toLowerCase().includes(q) || (i.purchaseAt || "").toLowerCase().includes(q);
      });
    }
    const cmp = {
      name: (a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }),
      recent: (a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""),
      expiry: (a, b) => (a.expiry || "9999").localeCompare(b.expiry || "9999"),
      price: (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
    }[sortBy] || ((a, b) => 0);
    base = [...base].sort(cmp);
    return base;
  };
  const list = displayItems();
  const showCheckout = tab === "shop" && items.some((i) => i.status === "cart");
  const groupedList = React.useMemo(() => {
    if (!groupByPlace || tab !== "inv") return null;
    const g = {};
    for (const i of list) {
      const place = i.places && i.places[0] || "General";
      (g[place] = g[place] || []).push(i);
    }
    return Object.entries(g).sort(([a], [b]) => a.localeCompare(b, "es"));
  }, [list, groupByPlace, tab]);
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Navegador no soporta dictado.");
      return;
    }
    const rec = new SR();
    rec.lang = "es-MX";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = (e) => {
      setIsListening(false);
      if (e.error !== "no-speech") alert("Error: " + e.error);
    };
    rec.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
      if (final) setPrompt((p) => (p + " " + final).trim());
    };
    recognitionRef.current = rec;
    rec.start();
  };
  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else startListening();
  };
  return /* @__PURE__ */ React.createElement("div", { className: "w-full h-full sm:h-[90vh] sm:max-w-[420px] bg-white sm:rounded-[30px] shadow-2xl flex flex-col relative overflow-hidden text-gray-800" }, updateReady && /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 right-0 bg-amber-500 text-white px-4 pb-2 text-xs flex justify-between items-center gap-3 z-[70] shadow-md", style: { paddingTop: "max(44px, calc(env(safe-area-inset-top) + 8px))" } }, /* @__PURE__ */ React.createElement("span", { className: "font-bold flex-1" }, "Hay una versión nueva"), /* @__PURE__ */ React.createElement("button", { onClick: applyUpdate, className: "bg-white text-amber-700 px-4 py-2 rounded-md font-bold text-[12px] shrink-0" }, "Recargar")), /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-600 px-5 pb-4 ios-header text-white rounded-b-[24px] shadow-lg shrink-0 z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4 mt-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("h1", { className: "text-xl font-bold flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "ShoppingBag" }), " Mi Súper"), cloudMode && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-indigo-200 mt-0.5 flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", { className: `w-1.5 h-1.5 rounded-full ${syncStatus === "online" ? "bg-green-400" : syncStatus === "connecting" ? "bg-yellow-400 animate-pulse" : "bg-red-400"}` }), groupName, " · ", members.length || 1, " ", members.length === 1 ? "miembro" : "miembros"), /* @__PURE__ */ React.createElement("button", { onClick: hardRefresh, title: "Limpiar cache y recargar", className: "mt-0.5 py-1 pr-2 text-[9px] text-indigo-200 hover:text-white flex items-center gap-1 active:scale-95 transition self-start" }, /* @__PURE__ */ React.createElement("span", null, "v", APP_VERSION), /* @__PURE__ */ React.createElement("span", null, "·"), /* @__PURE__ */ React.createElement("span", { className: "underline" }, "↻ refrescar"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("label", { className: "p-2 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer" }, /* @__PURE__ */ React.createElement(Icon, { name: "Camera" }), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleTicketUpload })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setModal("dictate");
    setResult(null);
  }, className: "p-2 bg-white/20 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "Mic" })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setModal("chef");
    setResult(null);
    handleChef();
  }, className: "p-2 bg-white/20 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "Chef" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setModal("suggest"), className: "p-2 bg-white/20 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "Sparkles" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setModal("settings"), className: "p-2 bg-white/20 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "Settings" })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white/10 backdrop-blur p-2 rounded-xl border border-white/20" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-2 items-center" }, /* @__PURE__ */ React.createElement("input", { value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) addItem(e);
  }, enterKeyHint: "done", placeholder: tab === "inv" ? "Agregar a Casa..." : "¿Qué falta?", className: "bg-transparent w-full text-white placeholder-indigo-200 outline-none font-medium" }), /* @__PURE__ */ React.createElement("label", { className: "bg-emerald-400 text-emerald-900 p-2 rounded-lg cursor-pointer flex items-center", title: "Tomar foto o elegir varias del rollo" }, /* @__PURE__ */ React.createElement(Icon, { name: "Camera", size: 18 }), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
    const fs = e.target.files;
    if (fs && fs.length) handleBulkPhotoAdd(fs);
    e.target.value = "";
  } })), /* @__PURE__ */ React.createElement("button", { onClick: addItem, disabled: !name, className: "bg-white text-indigo-600 p-2 rounded-lg disabled:opacity-40" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus" }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto no-scrollbar pb-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 10 }), /* @__PURE__ */ React.createElement("input", { value: tagInput, onChange: (e) => setTagInput(e.target.value), onBlur: addTag, onKeyDown: (e) => e.key === "Enter" && addTag(), placeholder: "Etiqueta", className: "bg-transparent w-14 text-xs text-white outline-none placeholder-indigo-300" })), savedTags.map((t) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => toggleTag(t), className: `px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${selTags.includes(t) ? "bg-white text-indigo-700" : "bg-indigo-800/50 text-indigo-200 border border-indigo-500/30"}` }, t, " ", selTags.includes(t) && "✓"))))), /* @__PURE__ */ React.createElement("div", { className: "flex border-b border-gray-100 shrink-0" }, [{ id: "shop", icon: "ShoppingBag", l: "Lista" }, { id: "inv", icon: "Home", l: "Casa" }, { id: "hist", icon: "History", l: "Historial" }].map((x) => /* @__PURE__ */ React.createElement("button", { key: x.id, onClick: () => setTab(x.id), className: `flex-1 py-3 flex flex-col items-center gap-1 text-[10px] font-bold ${tab === x.id ? "text-indigo-600 bg-indigo-50" : "text-gray-400"}` }, /* @__PURE__ */ React.createElement(Icon, { name: x.icon, size: 20, className: tab === x.id ? "stroke-[2.5]" : "stroke-2" }), " ", x.l))), /* @__PURE__ */ React.createElement("div", { "data-testid": "scroll", className: `flex-1 overflow-y-auto overscroll-contain pt-4 px-4 space-y-3 bg-gray-50 ${showCheckout ? "scroll-pad-bar" : "scroll-pad"}` }, tab === "shop" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto no-scrollbar pb-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setFilter("Todos"), className: `px-3 py-1.5 rounded-full text-xs font-bold border ${filter === "Todos" ? "bg-gray-800 text-white" : "bg-white text-gray-500"}` }, "Todos"), savedTags.filter((x) => x !== "General").map((t) => /* @__PURE__ */ React.createElement("button", { key: t, onClick: () => setFilter(t), className: `px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${filter === t ? "bg-gray-800 text-white" : "bg-white text-gray-500"}` }, t)))), tab === "inv" && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setInvFilter("Todos"), className: `px-3 py-1.5 rounded-full text-xs font-bold border ${invFilter === "Todos" ? "bg-green-600 text-white" : "bg-white text-gray-500"}` }, "Todos"), /* @__PURE__ */ React.createElement("button", { onClick: () => setInvFilter("MariKondo"), className: `px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${invFilter === "MariKondo" ? "bg-pink-600 text-white border-pink-600" : "bg-pink-50 text-pink-700 border-pink-200"}` }, "✨ Mari Kondo"), categories.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => setInvFilter(c), className: `px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${invFilter === c ? "bg-green-600 text-white" : "bg-white text-gray-500"}` }, c)), /* @__PURE__ */ React.createElement("button", { onClick: () => setInvFilter("Agotados"), className: `px-3 py-1.5 rounded-full text-xs font-bold border bg-gray-200 text-gray-600 whitespace-nowrap ${invFilter === "Agotados" ? "border-gray-400 bg-gray-300" : ""}` }, "Agotados")), (tab === "inv" || tab === "shop") && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 items-center mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center bg-white border rounded-lg px-2 py-1 flex-1 min-w-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 14, className: "text-gray-400 shrink-0" }), /* @__PURE__ */ React.createElement("input", { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "Buscar…", className: "bg-transparent outline-none px-2 py-0.5 text-xs flex-1 min-w-0" }), searchQuery && /* @__PURE__ */ React.createElement("button", { onClick: () => setSearchQuery(""), className: "text-gray-400 text-xs" }, "×")), /* @__PURE__ */ React.createElement("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "bg-white border rounded-lg text-xs px-2 py-1.5 font-bold text-gray-600" }, /* @__PURE__ */ React.createElement("option", { value: "name" }, "A-Z"), /* @__PURE__ */ React.createElement("option", { value: "recent" }, "Recientes"), /* @__PURE__ */ React.createElement("option", { value: "expiry" }, "Por caducidad"), /* @__PURE__ */ React.createElement("option", { value: "price" }, "Por precio")), tab === "inv" && /* @__PURE__ */ React.createElement("button", { onClick: () => setGroupByPlace(!groupByPlace), title: "Agrupar por área", className: `px-2 py-1.5 rounded-lg border text-xs font-bold ${groupByPlace ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600"}` }, /* @__PURE__ */ React.createElement(Icon, { name: "Layers", size: 14 }))), (tab === "inv" || tab === "hist") && /* @__PURE__ */ React.createElement("div", { className: "flex justify-end mb-2 gap-2 flex-wrap" }, /* @__PURE__ */ React.createElement("button", { onClick: handleExportCSV, className: "bg-white border text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Download", size: 12 }), " Exportar CSV"), tab === "inv" && /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden" }, /* @__PURE__ */ React.createElement("button", { className: "bg-white border text-gray-600 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Upload", size: 12 }), " Importar"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".csv", onChange: handleImportCSV, className: "absolute inset-0 opacity-0" }))), !list.length && /* @__PURE__ */ React.createElement("div", { className: "text-center py-10 text-gray-400 text-sm" }, searchQuery.trim() ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Nada coincide con “", searchQuery.trim(), "”.") : tab === "shop" ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Tu lista está vacía.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-xs" }, "Escribe arriba lo que falta o usa el micrófono.")) : tab === "hist" ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Aún no hay compras registradas.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Nada por aquí 🦗")), invFilter === "MariKondo" && tab === "inv" && list.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-pink-50 border border-pink-200 text-pink-800 text-xs rounded-lg px-3 py-2 mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, list.length), " candidatos a mari-kondear: caducados, duplicados, sin foto o no usados en 6+ meses."), (() => {
    const renderItem = (i) => /* @__PURE__ */ React.createElement("div", { key: i.id, className: `p-3 rounded-xl border flex flex-col gap-2 shadow-sm transition animate-enter bg-white ${i.status === "cart" ? "bg-green-50 border-green-200 opacity-60" : ""} ${i.status === "inactive" ? "opacity-70 bg-gray-50" : ""} ${isCriticalExpired(i) ? "border-red-400" : ""} ${isSoftExpired(i) ? "border-amber-300" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 overflow-hidden flex-1 cursor-pointer", onClick: () => {
      if (tab === "shop") setItems(items.map((x) => x.id === i.id ? { ...x, status: i.status === "needed" ? "cart" : "needed" } : x));
      if (i.status === "inactive") setItems(items.map((x) => x.id === i.id ? { ...x, status: "stocked" } : x));
    } }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${i.status === "cart" ? "bg-green-500 border-green-500" : "border-gray-300"}` }, i.status === "cart" && /* @__PURE__ */ React.createElement(Icon, { name: "Check", size: 12, className: "text-white" })), i.photoUrl && /* @__PURE__ */ React.createElement(
      "img",
      {
        src: i.photoUrl,
        alt: i.name,
        loading: "lazy",
        onClick: (e) => {
          e.stopPropagation();
          openView(i);
        },
        className: "w-10 h-10 rounded-lg object-cover border shrink-0 cursor-pointer active:opacity-70"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: `font-semibold text-sm ${i.status === "cart" && "line-through"} flex items-center gap-1` }, i.name, i.isEssential && /* @__PURE__ */ React.createElement(Icon, { name: "Star", size: 12, className: "text-yellow-400 fill-current" })), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500" }, i.category, " • ", i.places.join(", ")), cloudMode && i.updatedBy && /* @__PURE__ */ React.createElement("p", { className: "text-[9px] text-gray-400" }, "Editado por ", nicknameOf(i.updatedBy), " · ", relativeTime(i.updatedAt)))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 items-center" }, tab === "inv" && i.status !== "inactive" && /* @__PURE__ */ React.createElement("button", { onClick: () => setItems(items.map((x) => x.id === i.id ? { ...x, status: "needed" } : x)), "aria-label": "Pasar a la lista", className: "p-2 bg-indigo-50 text-indigo-600 rounded-lg" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 16 })), tab === "inv" && /* @__PURE__ */ React.createElement("label", { className: `p-2 rounded-lg cursor-pointer ${i.photoUrl ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`, title: i.photoUrl ? "Cambiar foto" : "Tomar foto", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(Icon, { name: "Camera", size: 16 }), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) handleQuickPhoto(i, f);
      e.target.value = "";
    } })), /* @__PURE__ */ React.createElement("button", { onClick: () => openEdit(i), "aria-label": "Editar", className: "p-2 -m-1 rounded-lg text-gray-400 hover:text-indigo-500 active:bg-gray-100" }, /* @__PURE__ */ React.createElement(Icon, { name: "Edit", size: 16 })), /* @__PURE__ */ React.createElement("button", { onClick: () => handleSmartDelete(i), "aria-label": "Borrar", className: "p-2 -m-1 rounded-lg text-gray-400 hover:text-red-500 active:bg-gray-100" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash", size: 16 })))), (i.qty || i.price || i.expiry || tab === "inv" || formatUnits(i)) && /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 text-[10px] text-gray-500 border-t pt-1 mt-1 items-center flex-wrap" }, tab === "inv" ? i.unitCount || i.unitSize ? /* @__PURE__ */ React.createElement("span", { className: "bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium", onClick: (e) => {
      e.stopPropagation();
      openEdit(i);
    } }, formatUnits(i)) : /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-1 flex-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-gray-400 shrink-0" }, "Cantidad:"), /* @__PURE__ */ React.createElement(
      "input",
      {
        value: i.qty || "",
        placeholder: "ej: 2 kg",
        onClick: (e) => e.stopPropagation(),
        onChange: (e) => setItems(items.map((x) => x.id === i.id ? { ...x, qty: e.target.value } : x)),
        className: "bg-gray-100 px-1.5 py-0.5 rounded outline-none border border-transparent focus:border-indigo-300 w-28 text-[10px]"
      }
    )) : formatUnits(i) && /* @__PURE__ */ React.createElement("span", { className: "bg-gray-100 px-1 rounded" }, formatUnits(i)), i.price && /* @__PURE__ */ React.createElement("span", { className: "bg-green-50 text-green-700 px-1 rounded" }, "$", i.price), i.expiry && /* @__PURE__ */ React.createElement("span", { className: `flex items-center gap-1 px-1 rounded ${isCriticalExpired(i) ? "bg-red-100 text-red-700 font-bold" : isSoftExpired(i) ? "bg-amber-100 text-amber-700" : "bg-red-50 text-red-600"}`, title: isCriticalExpired(i) ? "Caducado — tirar" : isSoftExpired(i) ? "Consumo preferente vencido — revisa visualmente, aún puede estar bien" : "" }, /* @__PURE__ */ React.createElement(Icon, { name: "Clock", size: 10 }), " ", i.expiry, isSoftExpired(i) ? " (rec.)" : ""), i.purchaseAt && /* @__PURE__ */ React.createElement("span", { className: "bg-blue-50 text-blue-700 px-1 rounded text-[10px]" }, i.purchaseAt), tab === "inv" && (isCriticalExpired(i) || isSoftExpired(i) || isDuplicate(i) || noPhoto(i)) && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] ml-auto flex items-center gap-0.5", title: `${isCriticalExpired(i) ? "Caducado (peligroso) " : ""}${isSoftExpired(i) ? "Caducado (recomendación) " : ""}${isDuplicate(i) ? "Duplicado " : ""}${noPhoto(i) ? "Sin foto" : ""}` }, isCriticalExpired(i) && /* @__PURE__ */ React.createElement("span", { className: "text-red-600" }, "⚠"), isSoftExpired(i) && /* @__PURE__ */ React.createElement("span", { className: "text-amber-600" }, "⏰"), isDuplicate(i) && /* @__PURE__ */ React.createElement("span", { className: "text-pink-600" }, "⧉"), noPhoto(i) && /* @__PURE__ */ React.createElement("span", { className: "text-gray-400" }, "📷"))));
    return groupedList ? groupedList.flatMap(([place, gitems]) => [/* @__PURE__ */ React.createElement("div", { key: "_g_" + place, className: "text-xs font-bold text-gray-500 uppercase tracking-wider mt-3 mb-1 px-1" }, place, " ", /* @__PURE__ */ React.createElement("span", { className: "text-gray-300" }, "· ", gitems.length)), ...gitems.map(renderItem)]) : list.map(renderItem);
  })()), showCheckout && /* @__PURE__ */ React.createElement("div", { "data-floating": true, className: "absolute left-4 right-4 animate-enter float-bottom" }, /* @__PURE__ */ React.createElement("button", { onClick: requestCheckout, className: "w-full bg-gray-900 text-white p-4 rounded-xl shadow-xl flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm ml-2" }, "Finalizar Compra (", items.filter((i) => i.status === "cart").length, ")"), /* @__PURE__ */ React.createElement("div", { className: "bg-white/20 p-1 rounded-full mr-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "ArrowRight" })))), undoSnapshot && /* @__PURE__ */ React.createElement("div", { "data-floating": true, className: "absolute left-4 right-4 toast-enter float-bottom z-30" }, /* @__PURE__ */ React.createElement("div", { className: "bg-gray-900 text-white p-3 rounded-xl shadow-xl flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "✓ ", undoSnapshot.label), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setItems(undoSnapshot.items);
    setUndoSnapshot(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  }, className: "bg-white/20 px-3 py-1 rounded-lg text-xs font-bold" }, "Deshacer"))), confirmData.isOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg mb-2 text-gray-800" }, confirmData.msg), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: confirmData.action, className: "w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg" }, confirmData.actionText), confirmData.altAction && /* @__PURE__ */ React.createElement("button", { onClick: confirmData.altAction, className: "w-full py-3 bg-red-100 text-red-600 rounded-xl font-bold" }, confirmData.altText), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmData({ isOpen: false }), className: "w-full py-2 text-gray-400 text-sm font-bold" }, "Cancelar")))), modal && !confirmData.isOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sheet-safe" }, /* @__PURE__ */ React.createElement("div", { "data-testid": "sheet", className: "bg-white w-full rounded-2xl p-5 shadow-2xl animate-enter max-h-full overflow-auto overscroll-contain" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg flex gap-2 items-center" }, modal === "settings" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Settings" }), " Ajustes"), modal === "edit" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Edit" }), " Editar"), modal === "dictate" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Mic" }), " Dictado AI"), modal === "chef" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Chef" }), " Chef AI"), modal === "ticket" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Camera" }), " Ticket AI"), modal === "suggest" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Sparkles" }), " Sugerencias")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setModal(null);
    setEditItem(null);
    setResult(null);
  }, className: "bg-gray-100 p-1 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "X" }))), modal === "edit" && editItem && /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, (() => {
    const allPhotos = Array.from(/* @__PURE__ */ new Set([
      ...editItem.photoUrl ? [editItem.photoUrl] : [],
      ...editItem.extraPhotoUrls || []
    ]));
    return /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 rounded-xl p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-gray-500 uppercase" }, "Fotos · ", allPhotos.length), /* @__PURE__ */ React.createElement("label", { className: "bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 active:scale-95" }, /* @__PURE__ */ React.createElement(Icon, { name: "Camera", size: 12 }), " + foto", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
      const fs = e.target.files;
      if (fs && fs.length) editAddPhotos(fs);
      e.target.value = "";
    } }))), allPhotos.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-1.5" }, allPhotos.map((url) => /* @__PURE__ */ React.createElement("div", { key: url, className: "relative aspect-square rounded-lg overflow-hidden border group" }, /* @__PURE__ */ React.createElement("img", { src: url, className: "w-full h-full object-cover" }), url === editItem.photoUrl && /* @__PURE__ */ React.createElement("span", { className: "absolute top-0.5 left-0.5 bg-indigo-600 text-white text-[8px] font-bold px-1 py-0.5 rounded" }, "PRINCIPAL"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => editRemovePhoto(url), className: "absolute top-0.5 right-0.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-md active:scale-90", title: "Quitar" }, "×"), url !== editItem.photoUrl && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => editSetMainPhoto(url), className: "absolute bottom-0.5 left-0.5 bg-white/90 text-indigo-600 text-[8px] font-bold px-1 py-0.5 rounded active:scale-95", title: "Hacer principal" }, "★ principal")))) : /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-gray-400 text-center py-3" }, "Sin fotos · agrega frente, ingredientes, caducidad, etc."));
  })(), /* @__PURE__ */ React.createElement("input", { value: editItem.name, onChange: (e) => setEditItem({ ...editItem, name: e.target.value }), className: "w-full border p-2 rounded-lg font-bold", placeholder: "Nombre" }), /* @__PURE__ */ React.createElement("div", { className: "border rounded-lg p-2 bg-gray-50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Cantidad"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditItem({ ...editItem, _structured: !editItem._structured && !(editItem.unitCount || editItem.unitSize) }), className: "text-[10px] text-indigo-500 underline" }, editItem._structured || editItem.unitCount || editItem.unitSize ? "Modo simple" : "Modo estructurado")), editItem._structured || editItem.unitCount || editItem.unitSize ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("input", { type: "number", inputMode: "numeric", min: "0", placeholder: "3", value: editItem.unitCount ?? "", onChange: (e) => setEditItem({ ...editItem, unitCount: e.target.value === "" ? null : Number(e.target.value) }), className: "border p-2 rounded-lg w-16 text-center" }), /* @__PURE__ */ React.createElement("span", { className: "text-gray-400" }, "×"), /* @__PURE__ */ React.createElement("input", { type: "number", inputMode: "decimal", min: "0", step: "0.01", placeholder: "250", value: editItem.unitSize ?? "", onChange: (e) => setEditItem({ ...editItem, unitSize: e.target.value === "" ? null : Number(e.target.value) }), className: "border p-2 rounded-lg flex-1 text-center" }), /* @__PURE__ */ React.createElement("select", { value: editItem.unitType || "", onChange: (e) => setEditItem({ ...editItem, unitType: e.target.value }), className: "border p-2 rounded-lg bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "" }, "—"), /* @__PURE__ */ React.createElement("optgroup", { label: "Peso" }, /* @__PURE__ */ React.createElement("option", { value: "g" }, "g"), /* @__PURE__ */ React.createElement("option", { value: "kg" }, "kg"), /* @__PURE__ */ React.createElement("option", { value: "mg" }, "mg"), /* @__PURE__ */ React.createElement("option", { value: "oz" }, "oz"), /* @__PURE__ */ React.createElement("option", { value: "lb" }, "lb")), /* @__PURE__ */ React.createElement("optgroup", { label: "Volumen" }, /* @__PURE__ */ React.createElement("option", { value: "ml" }, "ml"), /* @__PURE__ */ React.createElement("option", { value: "l" }, "l"), /* @__PURE__ */ React.createElement("option", { value: "oz_fl" }, "oz fl")), /* @__PURE__ */ React.createElement("optgroup", { label: "Conteo" }, /* @__PURE__ */ React.createElement("option", { value: "pz" }, "pz"), /* @__PURE__ */ React.createElement("option", { value: "pkg" }, "pkg"), /* @__PURE__ */ React.createElement("option", { value: "bolsa" }, "bolsa"), /* @__PURE__ */ React.createElement("option", { value: "lata" }, "lata"), /* @__PURE__ */ React.createElement("option", { value: "caja" }, "caja"), /* @__PURE__ */ React.createElement("option", { value: "botella" }, "botella")))), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mt-1 text-center" }, formatUnits(editItem) || "Captura número × tamaño + unidad")) : /* @__PURE__ */ React.createElement("input", { value: editItem.qty, placeholder: "ej: 2 kg", onChange: (e) => setEditItem({ ...editItem, qty: e.target.value }), className: "w-full border p-2 rounded-lg" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Precio"), /* @__PURE__ */ React.createElement("input", { type: "number", inputMode: "decimal", value: editItem.price, onChange: (e) => setEditItem({ ...editItem, price: e.target.value }), className: "w-full border p-2 rounded-lg" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Categoría"), /* @__PURE__ */ React.createElement("select", { value: editItem.category, onChange: (e) => setEditItem({ ...editItem, category: e.target.value }), className: "w-full border p-2 rounded-lg bg-white" }, categories.map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, c)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Caducidad"), /* @__PURE__ */ React.createElement("input", { type: "date", value: editItem.expiry, onChange: (e) => setEditItem({ ...editItem, expiry: e.target.value }), className: "w-full border p-2 rounded-lg" }), /* @__PURE__ */ React.createElement("select", { value: editItem.expiryType || "", onChange: (e) => setEditItem({ ...editItem, expiryType: e.target.value }), className: "w-full border p-1 rounded mt-1 text-[10px] bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "" }, "— tipo (auto: ", inferExpiryType(editItem) || "best_before", ") —"), /* @__PURE__ */ React.createElement("option", { value: "strict" }, "Importante (tirar al caducar)"), /* @__PURE__ */ React.createElement("option", { value: "best_before" }, "Recomendación (consumo preferente)")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Lugares (separados por coma)"), /* @__PURE__ */ React.createElement("input", { value: editItem.places.join(", "), onChange: (e) => setEditItem({ ...editItem, places: e.target.value.split(",").map((s) => s.trim()) }), className: "w-full border p-2 rounded-lg" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[10px] font-bold text-gray-500" }, "Dónde comprar"), /* @__PURE__ */ React.createElement("input", { list: "purchase-stores", value: editItem.purchaseAt || "", onChange: (e) => setEditItem({ ...editItem, purchaseAt: e.target.value }), placeholder: "Costco, Sumesa, City Market…", className: "w-full border p-2 rounded-lg" }), /* @__PURE__ */ React.createElement("datalist", { id: "purchase-stores" }, Array.from(new Set(items.map((it) => it.purchaseAt).filter(Boolean))).map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s })), /* @__PURE__ */ React.createElement("option", { value: "Costco" }), /* @__PURE__ */ React.createElement("option", { value: "Sumesa" }), /* @__PURE__ */ React.createElement("option", { value: "Walmart" }), /* @__PURE__ */ React.createElement("option", { value: "City Market" }), /* @__PURE__ */ React.createElement("option", { value: "La Comer" }), /* @__PURE__ */ React.createElement("option", { value: "Soriana" }), /* @__PURE__ */ React.createElement("option", { value: "Mercado Roma" }), /* @__PURE__ */ React.createElement("option", { value: "Tianguis" }), /* @__PURE__ */ React.createElement("option", { value: "Online" }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 border p-3 rounded-lg bg-yellow-50 border-yellow-100", onClick: () => setEditItem({ ...editItem, isEssential: !editItem.isEssential }) }, /* @__PURE__ */ React.createElement("div", { className: `w-5 h-5 rounded border flex items-center justify-center ${editItem.isEssential ? "bg-yellow-400 border-yellow-400" : "bg-white border-gray-300"}` }, editItem.isEssential && /* @__PURE__ */ React.createElement(Icon, { name: "Check", size: 12, className: "text-white" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-yellow-800 flex items-center gap-1" }, "Marcar Esencial ", /* @__PURE__ */ React.createElement(Icon, { name: "Star", size: 14 }))), /* @__PURE__ */ React.createElement("button", { onClick: saveEdit, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-2" }, "Guardar Cambios")), modal === "view" && viewItem && /* @__PURE__ */ React.createElement("div", { className: "space-y-3 -m-2" }, viewItem.photoUrl ? /* @__PURE__ */ React.createElement("a", { href: viewItem.photoUrl, target: "_blank", rel: "noopener", className: "block" }, /* @__PURE__ */ React.createElement("img", { src: viewItem.photoUrl, alt: viewItem.name, className: "w-full max-h-[45vh] object-contain rounded-xl bg-gray-100" })) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm" }, "Sin foto principal"), /* @__PURE__ */ React.createElement("div", { className: "px-1" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold flex items-center gap-2" }, viewItem.name, viewItem.isEssential && /* @__PURE__ */ React.createElement(Icon, { name: "Star", size: 16, className: "text-yellow-400 fill-current" })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mt-0.5" }, viewItem.category, " · ", viewItem.places.join(", ") || "General")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-1.5 px-1" }, formatUnits(viewItem) && /* @__PURE__ */ React.createElement("span", { className: "bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-medium" }, "📦 ", formatUnits(viewItem)), viewItem.qty && !formatUnits(viewItem) && /* @__PURE__ */ React.createElement("span", { className: "bg-gray-100 px-2.5 py-1 rounded-lg text-xs" }, viewItem.qty), viewItem.price && /* @__PURE__ */ React.createElement("span", { className: "bg-green-50 text-green-700 px-2.5 py-1 rounded-lg text-xs" }, "$", viewItem.price), viewItem.expiry && /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 ${isCriticalExpired(viewItem) ? "bg-red-100 text-red-700 font-bold" : isSoftExpired(viewItem) ? "bg-amber-100 text-amber-700" : "bg-red-50 text-red-600"}` }, /* @__PURE__ */ React.createElement(Icon, { name: "Clock", size: 11 }), " ", viewItem.expiry, isSoftExpired(viewItem) ? " (rec.)" : ""), viewItem.purchaseAt && /* @__PURE__ */ React.createElement("span", { className: "bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs" }, viewItem.purchaseAt)), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setModal("edit");
    setEditItem({ ...viewItem });
  }, className: "w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm" }, "Editar item"), /* @__PURE__ */ React.createElement("div", { className: "border-t pt-3 px-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-xs text-gray-600 uppercase tracking-wider" }, "Fotos · ", viewItemPhotos.length), /* @__PURE__ */ React.createElement("label", { className: "bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 active:scale-95 transition" }, /* @__PURE__ */ React.createElement(Icon, { name: "Camera", size: 13 }), " + foto", /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: (e) => {
    const fs = e.target.files;
    if (fs && fs.length) handleAddItemPhotos(fs);
    e.target.value = "";
  } }))), viewItemPhotos.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-1.5" }, viewItemPhotos.map((url, idx) => /* @__PURE__ */ React.createElement("a", { key: url + idx, href: url, target: "_blank", rel: "noopener", className: "aspect-square rounded-lg overflow-hidden border block" }, /* @__PURE__ */ React.createElement("img", { src: url, className: "w-full h-full object-cover", loading: "lazy" })))) : /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-gray-400 text-center py-3" }, "+ foto para agregar ingredientes, caducidad, marca, vista trasera..."))), modal === "settings" && /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, cloudConfigured && cloudMode && /* @__PURE__ */ React.createElement("div", { className: "bg-green-50 border border-green-200 rounded-lg p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-green-900" }, "Grupo: ", groupName), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-green-700" }, members.length || 1, " miembros")), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-green-700 mb-2" }, "Código: ", /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold tracking-wider" }, groupCode)), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    const text = `Únete a "${groupName}" en Mi Súper con el código ${groupCode}
${location.origin}${location.pathname}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Copiado");
      }
    } catch {
    }
  }, className: "flex-1 bg-white border border-green-300 text-green-700 py-1.5 rounded text-xs font-bold" }, "Compartir código"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setConfirmData({
      isOpen: true,
      msg: `¿Salir de "${groupName}"? Tus listas locales no se borran.`,
      actionText: "Salir",
      action: () => {
        cloudLeaveGroup();
        setConfirmData({ isOpen: false });
        setModal(null);
      },
      altAction: () => setConfirmData({ isOpen: false }),
      altText: "Cancelar"
    });
  }, className: "flex-1 bg-white border border-red-300 text-red-700 py-1.5 rounded text-xs font-bold" }, "Salir")), items.length > 0 && /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    const r = await cloudUploadLocal();
    alert(r?.error ? `Error: ${r.error}` : "Inventario subido al grupo");
  }, className: "w-full mt-2 bg-indigo-600 text-white py-1.5 rounded text-xs font-bold" }, "Subir mi inventario actual al grupo")), cloudConfigured && !cloudMode && /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 border rounded-lg p-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-2" }, "Modo: solo este dispositivo"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setObStep("create");
    setObError(null);
    setObName("");
    setObNick("");
    setOnboarded(false);
    setModal(null);
  }, className: "flex-1 bg-indigo-600 text-white py-1.5 rounded text-xs font-bold" }, "Crear grupo"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setObStep("join");
    setObError(null);
    setObCode("");
    setObNick("");
    setOnboarded(false);
    setModal(null);
  }, className: "flex-1 bg-white border-2 border-indigo-600 text-indigo-600 py-1.5 rounded text-xs font-bold" }, "Unirme"))), /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-900" }, /* @__PURE__ */ React.createElement("p", { className: "font-bold mb-1" }, "Tus datos viven en tu navegador."), /* @__PURE__ */ React.createElement("p", null, "Las API keys se guardan localmente y solo se envían a Google/DeepSeek cuando usas voz, tickets o chef.")), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-gray-500 -mb-2" }, "Configura uno o varios. La app usa el mejor disponible para cada tarea (visión: Gemini → Claude → OpenAI; texto: DeepSeek → Gemini → OpenAI → Claude)."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-1" }, "Google Gemini"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mb-1" }, "Gratis. ", /* @__PURE__ */ React.createElement("a", { href: "https://aistudio.google.com/apikey", target: "_blank", rel: "noopener", className: "text-indigo-600 underline" }, "aistudio.google.com")), /* @__PURE__ */ React.createElement("input", { value: key, onChange: (e) => setKey(e.target.value), className: "w-full border p-2 rounded font-mono text-xs", placeholder: "AIza..." })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-1" }, "Anthropic Claude"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mb-1" }, "Pago, modelo Haiku. ", /* @__PURE__ */ React.createElement("a", { href: "https://console.anthropic.com/settings/keys", target: "_blank", rel: "noopener", className: "text-indigo-600 underline" }, "console.anthropic.com")), /* @__PURE__ */ React.createElement("input", { value: claudeKey, onChange: (e) => setClaudeKey(e.target.value), className: "w-full border p-2 rounded font-mono text-xs", placeholder: "sk-ant-..." })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-1" }, "OpenAI"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mb-1" }, "Pago, modelo gpt-4o-mini. ", /* @__PURE__ */ React.createElement("a", { href: "https://platform.openai.com/api-keys", target: "_blank", rel: "noopener", className: "text-indigo-600 underline" }, "platform.openai.com")), /* @__PURE__ */ React.createElement("input", { value: openaiKey, onChange: (e) => setOpenaiKey(e.target.value), className: "w-full border p-2 rounded font-mono text-xs", placeholder: "sk-..." })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-1" }, "DeepSeek"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500 mb-1" }, "Más barato para texto, sin visión. ", /* @__PURE__ */ React.createElement("a", { href: "https://platform.deepseek.com/api_keys", target: "_blank", rel: "noopener", className: "text-indigo-600 underline" }, "platform.deepseek.com")), /* @__PURE__ */ React.createElement("input", { value: dsKey, onChange: (e) => setDsKey(e.target.value), className: "w-full border p-2 rounded font-mono text-xs", placeholder: "sk-..." })), /* @__PURE__ */ React.createElement("button", { onClick: () => setModal(null), className: "w-full bg-indigo-600 text-white py-2 rounded-lg font-bold" }, "Guardar")), (modal === "dictate" || modal === "chef" || modal === "ticket") && /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, modal === "dictate" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, 'Dicta: "Compré leche, falta huevo..."'), /* @__PURE__ */ React.createElement("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), className: "w-full border p-2 rounded-lg text-sm", rows: "3" }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: toggleListening, className: `flex-1 py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 ${isListening ? "mic-active" : "bg-red-500"}` }, isListening ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Stop" }), " Parar") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Mic" }), " Hablar")), /* @__PURE__ */ React.createElement("button", { onClick: handleDictation, disabled: loading, className: "flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2" }, loading ? "Pensando..." : "Procesar"))), (loading || result) && /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-sm mt-2 text-center" }, loading ? /* @__PURE__ */ React.createElement("p", { className: "text-indigo-600 animate-pulse" }, "Pensando...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "prose prose-sm text-left whitespace-pre-wrap" }, result), modal === "chef" && window.__lastChefRecipe && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    openRecipeWizard(window.__lastChefRecipe.title, window.__lastChefRecipe.steps);
    setModal(null);
  }, className: "mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold" }, "Ver paso a paso"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setResult(null);
    setPrompt("");
    window.__lastChefRecipe = null;
  }, className: "mt-2 w-full bg-white py-1 rounded text-xs font-bold border" }, "Limpiar")))), modal === "suggest" && (() => {
    const today = /* @__PURE__ */ new Date();
    const suggested = items.filter((i) => {
      if (!i.isEssential || i.status !== "stocked" || !i.lastBought) return false;
      const lb = new Date(i.lastBought);
      if (isNaN(lb)) return false;
      const days = Math.floor((today - lb) / (1e3 * 60 * 60 * 24));
      return days > 7;
    });
    if (suggested.length === 0) {
      return /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 text-center py-4" }, "Tu alacena se ve bien, nada por sugerir.");
    }
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mb-2" }, "Estos esenciales llevan más de 7 días sin volver a comprarse:"), suggested.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.id, className: "flex items-center justify-between bg-gray-50 border rounded-lg p-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold" }, s.name), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-gray-500" }, "Última compra: ", s.lastBought)), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setItems((prev) => prev.map((i) => i.id === s.id ? { ...i, status: "needed" } : i));
    }, className: "bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg" }, "A la lista"))));
  })())), !onboarded && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-enter" }, obStep === "welcome" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex p-3 bg-indigo-100 rounded-2xl mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "ShoppingBag", size: 32, className: "text-indigo-600" })), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold" }, "Bienvenido a Mi Súper"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mt-1" }, "Tu lista inteligente del super.")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-2 text-sm text-gray-600 mb-4" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-indigo-600" }, "✓"), " Lista, casa e historial en un tap"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-indigo-600" }, "✓"), " Voz, tickets y chef con AI (opcional)"), /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-indigo-600" }, "✓"), " Funciona offline en el super"), cloudConfigured && /* @__PURE__ */ React.createElement("li", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-indigo-600" }, "✓"), " Compartir lista con amigos en tiempo real")), cloudConfigured ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: signInWithGoogle, className: "w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-800 py-3 rounded-xl font-bold mb-3 hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 18 18" }, /* @__PURE__ */ React.createElement("path", { d: "M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z", fill: "#4285F4" }), /* @__PURE__ */ React.createElement("path", { d: "M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z", fill: "#34A853" }), /* @__PURE__ */ React.createElement("path", { d: "M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z", fill: "#FBBC05" }), /* @__PURE__ */ React.createElement("path", { d: "M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z", fill: "#EA4335" })), "Continuar con Google"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-px bg-gray-200" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-400" }, "o"), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-px bg-gray-200" })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setObStep("create");
    setObError(null);
  }, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-2" }, "Crear grupo nuevo"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setObStep("join");
    setObError(null);
  }, className: "w-full bg-white border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold mb-2" }, "Unirme con código"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    localStorage.setItem("onboarded_v1", "1");
    setOnboarded(true);
  }, className: "w-full bg-gray-100 text-gray-600 py-2 rounded-xl text-sm font-bold" }, "Solo este dispositivo")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-gray-500 bg-gray-50 border rounded-lg p-3 mb-4" }, "Tus datos viven en tu navegador. Para voz/tickets/chef necesitas una API key (Gemini gratis, o Claude/OpenAI/DeepSeek de pago). Configurable desde Ajustes."), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    localStorage.setItem("onboarded_v1", "1");
    setOnboarded(true);
    setModal("settings");
  }, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-2" }, "Configurar API Key"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    localStorage.setItem("onboarded_v1", "1");
    setOnboarded(true);
  }, className: "w-full bg-gray-100 text-gray-600 py-2 rounded-xl text-sm font-bold" }, "Empezar sin AI"))), obStep === "create" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-1" }, "Crear grupo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mb-4" }, "Tú serás el primer miembro. Comparte el código con tus amigos para que se unan."), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold text-gray-700 block mb-1" }, "Nombre del grupo"), /* @__PURE__ */ React.createElement("input", { value: obName, onChange: (e) => setObName(e.target.value), placeholder: "Familia, Roomies, etc.", className: "w-full border p-2 rounded-lg mb-3" }), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold text-gray-700 block mb-1" }, "Tu nombre en el grupo"), /* @__PURE__ */ React.createElement("input", { value: obNick, onChange: (e) => setObNick(e.target.value), placeholder: "Pedro", className: "w-full border p-2 rounded-lg mb-3" }), obError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-600 mb-2" }, obError), /* @__PURE__ */ React.createElement("button", { disabled: !obName.trim() || !obNick.trim() || obLoading, onClick: async () => {
    setObLoading(true);
    setObError(null);
    const r = await cloudCreateGroup(obName.trim(), obNick.trim());
    setObLoading(false);
    if (r.error) {
      setObError(r.error);
      return;
    }
    setObShareCode(r.code);
    setObShareName(obName.trim());
    setObStep("success");
  }, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-2 disabled:opacity-50" }, obLoading ? "Creando..." : "Crear grupo"), /* @__PURE__ */ React.createElement("button", { onClick: () => setObStep("welcome"), className: "w-full text-gray-500 text-sm py-2" }, "Volver")), obStep === "join" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold mb-1" }, "Unirme con código"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mb-4" }, "Pega el código de 8 letras que te compartieron."), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold text-gray-700 block mb-1" }, "Código del grupo"), /* @__PURE__ */ React.createElement("input", { value: obCode, onChange: (e) => setObCode(e.target.value.toUpperCase()), placeholder: "AB23PQ12", maxLength: 8, className: "w-full border p-2 rounded-lg mb-3 font-mono uppercase tracking-widest" }), /* @__PURE__ */ React.createElement("label", { className: "text-xs font-bold text-gray-700 block mb-1" }, "Tu nombre en el grupo"), /* @__PURE__ */ React.createElement("input", { value: obNick, onChange: (e) => setObNick(e.target.value), placeholder: "Steph", className: "w-full border p-2 rounded-lg mb-3" }), obError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-red-600 mb-2" }, obError), /* @__PURE__ */ React.createElement("button", { disabled: obCode.trim().length < 4 || !obNick.trim() || obLoading, onClick: async () => {
    setObLoading(true);
    setObError(null);
    const r = await cloudJoinGroup(obCode, obNick.trim());
    setObLoading(false);
    if (r.error) {
      setObError(r.error === "group not found" ? "No encontré ese grupo. Revisa el código." : r.error);
      return;
    }
    localStorage.setItem("onboarded_v1", "1");
    setOnboarded(true);
  }, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-2 disabled:opacity-50" }, obLoading ? "Uniéndome..." : "Unirme"), /* @__PURE__ */ React.createElement("button", { onClick: () => setObStep("welcome"), className: "w-full text-gray-500 text-sm py-2" }, "Volver")), obStep === "success" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex p-3 bg-green-100 rounded-2xl mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "Check", size: 32, className: "text-green-600" })), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold" }, obShareName, " listo"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 mt-1" }, "Comparte este código con tus amigos:")), /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-50 border-2 border-dashed border-indigo-300 rounded-xl p-4 mb-4 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "font-mono text-2xl font-bold tracking-widest text-indigo-700" }, obShareCode)), /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    const text = `Únete a "${obShareName}" en Mi Súper con el código ${obShareCode}
${location.origin}${location.pathname}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        alert("Copiado al portapapeles");
      }
    } catch {
    }
  }, className: "w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-2" }, "Compartir código"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    localStorage.setItem("onboarded_v1", "1");
    setOnboarded(true);
  }, className: "w-full bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-bold" }, "Empezar")))), recipeWizard && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-5 animate-enter" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden", style: { maxHeight: "90%" } }, /* @__PURE__ */ React.createElement("div", { className: "bg-indigo-600 px-5 py-4 flex justify-between items-start" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-indigo-200 text-xs font-medium mb-1" }, recipeWizard.title), /* @__PURE__ */ React.createElement("p", { className: "text-white text-[11px]" }, "Paso ", recipeWizard.step + 1, " de ", recipeWizard.steps.length)), /* @__PURE__ */ React.createElement("button", { onClick: () => setRecipeWizard(null), className: "bg-white/20 p-1.5 rounded-full" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 16, className: "text-white" }))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-8" }, recipeWizard.step < recipeWizard.steps.length ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-5 shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: "text-indigo-700 font-bold text-lg" }, recipeWizard.step + 1)), /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-800 font-medium text-center leading-relaxed" }, recipeWizard.steps[recipeWizard.step])) : /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(Icon, { name: "Check", size: 32, className: "text-green-600" })), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-gray-800" }, "Listo!"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm mt-1" }, "Que te aproveche."))), /* @__PURE__ */ React.createElement("div", { className: "px-5 pb-6 flex gap-3" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: recipeWizard.step === 0,
      onClick: () => setRecipeWizard((w) => ({ ...w, step: w.step - 1 })),
      className: "flex-1 py-4 rounded-xl font-bold text-base border-2 border-gray-200 text-gray-600 disabled:opacity-30"
    },
    "Anterior"
  ), recipeWizard.step < recipeWizard.steps.length ? /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setRecipeWizard((w) => ({ ...w, step: w.step + 1 })),
      className: "flex-1 py-4 rounded-xl font-bold text-base bg-indigo-600 text-white"
    },
    "Siguiente"
  ) : /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setRecipeWizard(null),
      className: "flex-1 py-4 rounded-xl font-bold text-base bg-green-600 text-white"
    },
    "Cerrar"
  )))));
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(SuperApp, null));

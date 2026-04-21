/* Cloud File Organizer - Dashboard JS */

let currentPage = 1;
const perPage = 100;
let totalFiles = 0;
let currentTagFileId = null;

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
    loadStats();
    loadFilters();
    loadFiles();

    // Filter events
    document.getElementById("filter-search").addEventListener("input", debounce(loadFiles, 400));
    document.getElementById("filter-cloud").addEventListener("change", loadFiles);
    document.getElementById("filter-type").addEventListener("change", loadFiles);
    document.getElementById("filter-tag").addEventListener("change", loadFiles);

    // Tag modal enter key
    document.getElementById("tag-modal-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTagFromModal();
    });
});

// --- Stats ---
async function loadStats() {
    try {
        const res = await fetch("/api/stats");
        const data = await res.json();

        const clouds = { gdrive: "Google Drive", onedrive: "OneDrive", dropbox: "Dropbox", icloud: "iCloud" };
        let html = `<div class="stat-card"><div class="stat-value">${data.total_files}</div><div class="stat-label">Total archivos</div></div>`;

        for (const [key, label] of Object.entries(clouds)) {
            const count = (data.by_cloud && data.by_cloud[key]) || 0;
            html += `<div class="stat-card"><div class="stat-value">${count}</div><div class="stat-label">${label}</div></div>`;
        }

        document.getElementById("stats-cards").innerHTML = html;
    } catch (e) {
        console.error("Error loading stats:", e);
    }
}

// --- Filters ---
async function loadFilters() {
    try {
        const res = await fetch("/api/filters");
        const data = await res.json();

        const cloudLabels = { gdrive: "Google Drive", onedrive: "OneDrive", dropbox: "Dropbox", icloud: "iCloud" };

        const cloudSelect = document.getElementById("filter-cloud");
        for (const c of data.clouds) {
            const opt = document.createElement("option");
            opt.value = c;
            opt.textContent = cloudLabels[c] || c;
            cloudSelect.appendChild(opt);
        }

        const typeSelect = document.getElementById("filter-type");
        for (const t of data.extensions) {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t.replace(".", "").toUpperCase();
            typeSelect.appendChild(opt);
        }

        const tagSelect = document.getElementById("filter-tag");
        for (const t of data.tags) {
            const opt = document.createElement("option");
            opt.value = t;
            opt.textContent = t;
            tagSelect.appendChild(opt);
        }
    } catch (e) {
        console.error("Error loading filters:", e);
    }
}

function clearFilters() {
    document.getElementById("filter-search").value = "";
    document.getElementById("filter-cloud").value = "";
    document.getElementById("filter-type").value = "";
    document.getElementById("filter-tag").value = "";
    currentPage = 1;
    loadFiles();
}

// --- Files Table ---
async function loadFiles() {
    const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
    });

    const search = document.getElementById("filter-search").value;
    const cloud = document.getElementById("filter-cloud").value;
    const type = document.getElementById("filter-type").value;
    const tag = document.getElementById("filter-tag").value;

    if (search) params.set("search", search);
    if (cloud) params.set("cloud", cloud);
    if (type) params.set("type", type);
    if (tag) params.set("tag", tag);

    try {
        const res = await fetch(`/api/files?${params}`);
        const data = await res.json();
        totalFiles = data.total;
        renderTable(data.files);
        renderPagination();
    } catch (e) {
        console.error("Error loading files:", e);
    }
}

function renderTable(files) {
    const tbody = document.getElementById("files-table-body");

    if (!files.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-12 text-center text-gray-500">
            No se encontraron archivos. Ejecuta un scan primero.
        </td></tr>`;
        return;
    }

    const cloudLabels = { gdrive: "G Drive", onedrive: "OneDrive", dropbox: "Dropbox", icloud: "iCloud" };

    tbody.innerHTML = files.map(f => {
        const ext = (f.extension || "").replace(".", "").toUpperCase();
        const size = humanSize(f.size_bytes || 0);
        const cloud = f.cloud_source;
        const cloudLabel = cloudLabels[cloud] || cloud;
        const tags = (f.tags || "").split(",").filter(t => t.trim());
        const modified = (f.last_modified || "").substring(0, 10);
        const link = f.direct_link;
        const notionId = f.notion_page_id;

        const tagsHtml = tags.map(t =>
            `<span class="tag-chip" title="${t.trim()}">${t.trim()}</span>`
        ).join(" ");

        const linkHtml = link
            ? `<a href="${escapeHtml(link)}" target="_blank" class="text-blue-400 hover:text-blue-300 text-sm">Abrir</a>`
            : '<span class="text-gray-600 text-sm">-</span>';

        const notionDot = notionId
            ? '<span class="inline-block w-2 h-2 bg-green-500 rounded-full ml-1" title="Synced to Notion"></span>'
            : '';

        return `<tr class="border-b border-gray-800/50">
            <td class="px-4 py-3 text-sm">
                <span class="text-white">${escapeHtml(f.filename)}</span>${notionDot}
                <div class="text-xs text-gray-500 truncate max-w-xs">${escapeHtml(f.cloud_path || "")}</div>
            </td>
            <td class="px-4 py-3"><span class="text-xs text-gray-400">${ext}</span></td>
            <td class="px-4 py-3 text-right text-sm text-gray-300">${size}</td>
            <td class="px-4 py-3"><span class="cloud-badge ${cloud}">${cloudLabel}</span></td>
            <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1 items-center">
                    ${tagsHtml}
                    <button onclick="openTagModal('${f.id}', '${escapeHtml(f.filename)}', '${escapeHtml(f.tags || "")}')"
                        class="text-gray-600 hover:text-blue-400 text-xs ml-1" title="Editar tags">+</button>
                </div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-400">${modified}</td>
            <td class="px-4 py-3">${linkHtml}</td>
        </tr>`;
    }).join("");
}

function renderPagination() {
    const totalPages = Math.ceil(totalFiles / perPage);
    document.getElementById("pagination-info").textContent =
        `${totalFiles} archivos, página ${currentPage} de ${totalPages || 1}`;
    document.getElementById("btn-prev").disabled = currentPage <= 1;
    document.getElementById("btn-next").disabled = currentPage >= totalPages;
}

function goToPage(page) {
    const totalPages = Math.ceil(totalFiles / perPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    loadFiles();
}

// --- Actions ---
async function triggerScan() {
    const btn = document.getElementById("btn-scan");
    btn.innerHTML = '<span class="spinner"></span> Escaneando...';
    btn.disabled = true;

    try {
        await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: "all" }) });
        showToast("Scan iniciado. Esto puede tomar unos minutos...");
        // Poll for completion
        setTimeout(() => { loadStats(); loadFiles(); btn.innerHTML = "Escanear"; btn.disabled = false; }, 5000);
    } catch (e) {
        showToast("Error al iniciar scan");
        btn.innerHTML = "Escanear";
        btn.disabled = false;
    }
}

async function triggerAutoTag() {
    const btn = document.getElementById("btn-tag");
    btn.innerHTML = '<span class="spinner"></span> Taggeando...';
    btn.disabled = true;

    try {
        await fetch("/api/auto-tag", { method: "POST" });
        showToast("Auto-tagging iniciado con Gemini AI...");
        setTimeout(() => { loadFiles(); btn.innerHTML = "Auto-Tag AI"; btn.disabled = false; }, 8000);
    } catch (e) {
        showToast("Error al iniciar auto-tag");
        btn.innerHTML = "Auto-Tag AI";
        btn.disabled = false;
    }
}

async function triggerNotionSync() {
    const btn = document.getElementById("btn-notion");
    btn.innerHTML = '<span class="spinner"></span> Sincronizando...';
    btn.disabled = true;

    try {
        await fetch("/api/sync-notion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
        showToast("Sincronización con Notion iniciada...");
        setTimeout(() => { loadStats(); loadFiles(); btn.innerHTML = "Sync Notion"; btn.disabled = false; }, 5000);
    } catch (e) {
        showToast("Error al sincronizar con Notion");
        btn.innerHTML = "Sync Notion";
        btn.disabled = false;
    }
}

// --- Duplicates ---
function showDuplicates() {
    document.getElementById("dupes-modal").classList.remove("hidden");
    loadDuplicates();
}

function closeDuplicates() {
    document.getElementById("dupes-modal").classList.add("hidden");
}

async function loadDuplicates() {
    const method = document.getElementById("dupes-method").value;
    const container = document.getElementById("dupes-content");
    container.innerHTML = '<div class="text-center py-8 text-gray-400"><span class="spinner"></span> Buscando duplicados...</div>';

    try {
        const res = await fetch(`/api/duplicates?method=${method}`);
        const data = await res.json();

        if (!data.groups.length) {
            container.innerHTML = '<div class="text-center py-8 text-green-400">No se encontraron duplicados.</div>';
            return;
        }

        const cloudLabels = { gdrive: "G Drive", onedrive: "OneDrive", dropbox: "Dropbox", icloud: "iCloud" };

        container.innerHTML = data.groups.map((group, i) => {
            const filesHtml = group.map(f => {
                const cl = cloudLabels[f.cloud_source] || f.cloud_source;
                return `<div class="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-lg mb-1">
                    <div>
                        <span class="cloud-badge ${f.cloud_source} mr-2">${cl}</span>
                        <span class="text-sm text-gray-300">${escapeHtml(f.cloud_path)}</span>
                    </div>
                    <span class="text-sm text-gray-500">${humanSize(f.size_bytes || 0)}</span>
                </div>`;
            }).join("");

            return `<div class="dupe-group">
                <h4 class="text-white">Grupo ${i + 1}: ${escapeHtml(group[0].filename)}</h4>
                <p class="text-xs text-gray-500 mb-3">${group.length} copias encontradas</p>
                ${filesHtml}
            </div>`;
        }).join("");
    } catch (e) {
        container.innerHTML = '<div class="text-center py-8 text-red-400">Error al buscar duplicados.</div>';
    }
}

// --- Tag Modal ---
function openTagModal(fileId, filename, tagsStr) {
    currentTagFileId = fileId;
    document.getElementById("tag-modal-filename").textContent = filename;
    document.getElementById("tag-modal-input").value = "";

    const tags = tagsStr.split(",").filter(t => t.trim());
    renderTagModalTags(tags);

    document.getElementById("tag-modal").classList.remove("hidden");
    document.getElementById("tag-modal-input").focus();
}

function closeTagModal() {
    document.getElementById("tag-modal").classList.add("hidden");
    currentTagFileId = null;
    loadFiles();
}

function renderTagModalTags(tags) {
    const container = document.getElementById("tag-modal-tags");
    if (!tags.length) {
        container.innerHTML = '<span class="text-sm text-gray-500">Sin tags</span>';
        return;
    }
    container.innerHTML = tags.map(t =>
        `<span class="tag-chip" onclick="removeTagFromModal('${escapeHtml(t.trim())}')">
            ${escapeHtml(t.trim())} <span class="remove">x</span>
        </span>`
    ).join("");
}

async function addTagFromModal() {
    const input = document.getElementById("tag-modal-input");
    const tag = input.value.trim();
    if (!tag || !currentTagFileId) return;

    try {
        await fetch(`/api/files/${currentTagFileId}/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: [tag] }),
        });
        input.value = "";
        // Refresh tags display
        const res = await fetch(`/api/files?search=&page=1&per_page=10000`);
        const data = await res.json();
        const file = data.files.find(f => f.id === currentTagFileId);
        if (file) {
            const tags = (file.tags || "").split(",").filter(t => t.trim());
            renderTagModalTags(tags);
        }
        showToast(`Tag "${tag}" agregado`);
    } catch (e) {
        showToast("Error al agregar tag");
    }
}

async function removeTagFromModal(tagName) {
    if (!currentTagFileId) return;

    try {
        await fetch(`/api/files/${currentTagFileId}/tags`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tag: tagName }),
        });
        // Refresh
        const res = await fetch(`/api/files?search=&page=1&per_page=10000`);
        const data = await res.json();
        const file = data.files.find(f => f.id === currentTagFileId);
        if (file) {
            const tags = (file.tags || "").split(",").filter(t => t.trim());
            renderTagModalTags(tags);
        }
        showToast(`Tag "${tagName}" eliminado`);
    } catch (e) {
        showToast("Error al eliminar tag");
    }
}

// --- Utilities ---
function humanSize(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
    return size.toFixed(1) + " " + units[i];
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 4000);
}

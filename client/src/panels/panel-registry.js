// Maps module type strings to renderer functions
// Renderers are lazy-loaded for progressive loading

const registry = new Map();

export function registerModule(id, loader) {
  registry.set(id, loader);
}

export async function renderModule(moduleId, container, context) {
  const loader = registry.get(moduleId);
  if (!loader) {
    container.innerHTML = `<div class="p-4 text-muted text-sm">Module "${moduleId}" not available yet.</div>`;
    return;
  }
  try {
    const mod = await loader();
    if (mod.render) mod.render(container, context);
    else if (mod.default?.render) mod.default.render(container, context);
    else container.innerHTML = `<div class="p-4 text-muted text-sm">Module loaded but has no render function.</div>`;
  } catch (err) {
    container.innerHTML = `<div class="p-4" style="color:var(--error)">
      <div class="text-sm">Module error: ${err.message}</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="this.parentElement.click()">Retry</button>
    </div>`;
    container.onclick = () => renderModule(moduleId, container, context);
  }
}

export function getRegisteredModules() {
  return [...registry.keys()];
}

// Register built-in modules
registerModule('vault', () => import('../views/vault.js').then(m => ({ render: (c) => m.renderVault(c) })));
registerModule('dashboard', () => Promise.resolve({
  render(container) {
    container.innerHTML = `<div class="p-4">
      <h2 style="font-size:1.1rem;font-weight:600;margin-bottom:12px">Dashboard</h2>
      <div class="text-sm text-secondary">Connect your accounts in the Accounts panel to see your unified feed here.</div>
    </div>`;
  }
}));
registerModule('empty', () => Promise.resolve({
  render(container) {
    container.innerHTML = `<div class="p-4 text-sm text-muted" style="display:flex;align-items:center;justify-content:center;height:100%">
      <div style="text-align:center">
        <div style="font-size:1.5rem;margin-bottom:8px">+</div>
        <div>Select a module</div>
      </div>
    </div>`;
  }
}));

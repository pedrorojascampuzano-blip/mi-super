import { h, mount } from './lib/dom.js';
import { bus } from './lib/events.js';
import { getUser, onAuthChange } from './lib/supabase.js';
import { renderLogin } from './views/login.js';
import { createTopbar } from './shell/topbar.js';
import { createStatusbar } from './shell/statusbar.js';
import { initPanelManager, getLayout } from './panels/panel-manager.js';
import { initCommandPalette } from './shell/command-palette.js';
import { get } from './lib/api.js';

const app = document.getElementById('app');

async function boot() {
  const user = await getUser();
  if (user) {
    renderApp(user);
  } else {
    renderLogin(app, async () => {
      const user = await getUser();
      if (user) renderApp(user);
    });
  }
}

async function renderApp(user) {
  // Fetch accounts for status bar
  let accounts = [];
  try {
    accounts = await get('/accounts');
  } catch { /* server might not be running */ }

  // Load saved layout
  let savedLayout = null;
  try {
    const prefs = await get('/preferences');
    savedLayout = prefs?.panel_layout ? JSON.stringify(prefs.panel_layout) : null;
  } catch { /* use default */ }

  // Build shell
  const workspace = h('div', { class: 'workspace' });

  mount(app, h('div', { style: { display: 'flex', flexDirection: 'column', height: '100vh' } }, [
    createTopbar(user),
    workspace,
    createStatusbar(accounts),
  ]));

  // Initialize panel system
  initPanelManager(workspace, savedLayout);
  initCommandPalette();

  // Save layout on changes (debounced)
  let saveTimer;
  bus.on('layout:changed', (layoutJson) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        const { put } = await import('./lib/api.js');
        await put('/preferences', { panel_layout: JSON.parse(layoutJson) });
      } catch { /* silent */ }
    }, 2000);
  });

  // Handle sign out
  bus.on('auth:changed', (user) => {
    if (!user) boot();
  });
}

// Auth state listener
onAuthChange((user) => {
  if (!user) boot();
});

boot();

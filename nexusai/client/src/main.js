import { h, mount } from './lib/dom.js';
import { bus } from './lib/events.js';
import { getUser, onAuthChange } from './lib/supabase.js';
import { renderLogin } from './views/login.js';
import { createTopbar } from './shell/topbar.js';
import { createStatusbar } from './shell/statusbar.js';
import { initPanelManager, getLayout } from './panels/panel-manager.js';
import { initCommandPalette } from './shell/command-palette.js';
import { initKeyboard } from './shell/keyboard.js';
import { get, put } from './lib/api.js';

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

  // Load saved layout - only use if it's a valid non-empty tree
  let savedLayout = null;
  try {
    const prefs = await get('/preferences');
    const pl = prefs?.panel_layout;
    if (pl && typeof pl === 'object' && (pl.type === 'panel' || pl.type === 'split')) {
      savedLayout = JSON.stringify(pl);
    }
  } catch { /* use default */ }

  // Build shell
  const workspace = h('div', { class: 'workspace' });
  const statusbarEl = h('div', { id: 'statusbar-container' });

  mount(app, h('div', { style: { display: 'flex', flexDirection: 'column', height: '100vh' } }, [
    createTopbar(user),
    workspace,
    statusbarEl,
  ]));

  // Initial statusbar render
  statusbarEl.appendChild(createStatusbar(accounts));

  // Re-render status bar when accounts change (from vault or sync)
  bus.on('accounts:changed', (newAccounts) => {
    accounts = newAccounts;
    statusbarEl.innerHTML = '';
    statusbarEl.appendChild(createStatusbar(accounts));
  });

  // Initialize panel system
  initPanelManager(workspace, savedLayout);
  initCommandPalette();
  initKeyboard();

  // Save layout on changes (debounced)
  let saveTimer;
  bus.on('layout:changed', (layoutJson) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        await put('/preferences', { panel_layout: JSON.parse(layoutJson) });
      } catch { /* silent */ }
    }, 2000);
  });

  // Handle sign out
  bus.on('auth:changed', (user) => {
    if (!user) boot();
  });

  // Handle sync:all command from palette (also reload accounts first)
  bus.on('sync:all', async () => {
    try {
      accounts = await get('/accounts');
      const { syncAll } = await import('./lib/sync.js');
      const services = accounts
        .filter(a => ['notion', 'gmail', 'slack', 'linear', 'calendar', 'whatsapp'].includes(a.provider))
        .map(a => a.provider);
      await syncAll(services);
      // Refresh accounts for last_synced_at
      accounts = await get('/accounts');
      bus.emit('accounts:changed', accounts);
    } catch (err) {
      console.error('Sync all failed:', err);
    }
  });
}

// Auth state listener
onAuthChange((user) => {
  if (!user) boot();
});

boot();

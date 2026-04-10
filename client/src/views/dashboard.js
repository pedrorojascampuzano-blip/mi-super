// Dashboard module - unified triage feed across all services
import { h, mount } from '../lib/dom.js';
import { bus } from '../lib/events.js';
import { getItems } from '../lib/cache.js';
import { fetchItems, syncAll } from '../lib/sync.js';
import { get } from '../lib/api.js';

const SOURCE_COLORS = {
  notion: '#000',
  gmail: '#EA4335',
  slack: '#4A154B',
  linear: '#5E6AD2',
  calendar: '#4285F4',
  whatsapp: '#25D366',
};

const TYPE_ICONS = {
  task: '✓',
  message: '✉',
  event: '◷',
  page: '▤',
  contact: '☺',
};

function relativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  const diff = (Date.now() - then) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function render(container, _context) {
  let items = [];
  let filter = 'all';
  let loading = true;
  let syncing = false;
  let accounts = [];

  async function loadAccounts() {
    try { accounts = await get('/accounts'); } catch { accounts = []; }
  }

  async function loadItems() {
    // 1. Fast path: IndexedDB
    const cached = await getItems({ limit: 100 });
    items = cached;
    draw();

    // 2. Slow path: server fetch
    try {
      const fresh = await fetchItems({ limit: 100 });
      items = fresh;
    } catch { /* keep cached */ }

    loading = false;
    draw();
  }

  async function handleSyncAll() {
    if (syncing) return;
    syncing = true;
    draw();
    const services = accounts
      .filter(a => ['notion', 'gmail', 'slack', 'linear', 'calendar', 'whatsapp'].includes(a.provider))
      .map(a => a.provider);
    try {
      await syncAll(services);
      await loadItems();
    } catch (err) {
      console.error(err);
    }
    syncing = false;
    draw();
  }

  function filtered() {
    if (filter === 'all') return items;
    return items.filter(i => {
      if (filter === 'tasks') return i.item_type === 'task';
      if (filter === 'messages') return i.item_type === 'message';
      if (filter === 'events') return i.item_type === 'event';
      return true;
    });
  }

  function draw() {
    const view = filtered();
    const content = h('div', { class: 'flex-col', style: { height: '100%', display: 'flex' } }, [
      // Header
      h('div', { class: 'flex items-center justify-between p-3', style: { borderBottom: '1px solid var(--border)' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, 'Triage'),
        h('div', { class: 'flex gap-2 items-center' }, [
          h('div', { class: 'filter-tabs' }, [
            filterTab('all', 'All'),
            filterTab('tasks', 'Tasks'),
            filterTab('messages', 'Messages'),
            filterTab('events', 'Events'),
          ]),
          h('button', {
            class: 'btn btn-primary btn-sm',
            onClick: handleSyncAll,
            disabled: syncing ? 'true' : undefined,
          }, syncing ? 'Syncing...' : 'Sync All'),
        ]),
      ]),
      // List
      h('div', { style: { flex: '1', overflowY: 'auto' } },
        loading
          ? h('div', { class: 'p-4 text-sm text-muted' }, 'Loading...')
          : view.length === 0
            ? h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } },
                'No items yet. Connect accounts and click "Sync All" to populate.')
            : view.map(renderItem)
      ),
    ]);

    mount(container, content);
  }

  function filterTab(id, label) {
    return h('button', {
      class: `filter-tab${filter === id ? ' active' : ''}`,
      onClick: () => { filter = id; draw(); },
    }, label);
  }

  function renderItem(item) {
    return h('div', {
      class: 'triage-item',
      onClick: () => {
        if (item.metadata?.url) window.open(item.metadata.url, '_blank');
      },
    }, [
      h('div', {
        class: 'triage-source',
        style: { background: SOURCE_COLORS[item.source] || 'var(--text-muted)' },
      }),
      h('div', { style: { flex: '1', minWidth: '0' } }, [
        h('div', { class: 'flex items-center gap-2', style: { marginBottom: '2px' } }, [
          h('span', { class: 'text-xs text-muted' }, `${TYPE_ICONS[item.item_type] || '·'} ${item.source}`),
          h('div', { class: 'truncate', style: { fontWeight: '500', fontSize: '0.85rem', flex: '1' } }, item.title || '(untitled)'),
        ]),
        item.body ? h('div', { class: 'text-xs text-secondary truncate' }, item.body.slice(0, 150)) : null,
        h('div', { class: 'triage-meta' }, [
          h('span', {}, relativeTime(item.source_timestamp)),
          item.metadata?.status ? h('span', {}, `• ${item.metadata.status}`) : null,
        ]),
      ]),
    ]);
  }

  // Listen for sync completion to auto-refresh
  const unsub = bus.on('sync:complete', () => loadItems());

  (async () => {
    await loadAccounts();
    await loadItems();
  })();

  // Cleanup on module replacement
  container._cleanup = () => unsub();
}

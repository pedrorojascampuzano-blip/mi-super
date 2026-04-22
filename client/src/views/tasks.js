// Tasks module - Kanban view across any source with item_type='task'
import { h, mount } from '../lib/dom.js';
import { post, get } from '../lib/api.js';
import { getItems } from '../lib/cache.js';
import { fetchItems, syncService } from '../lib/sync.js';
import { errorBanner } from '../lib/ui.js';

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Done'];

const SOURCE_META = {
  notion: { badge: 'N', color: '#000' },
  linear: { badge: 'L', color: '#5E6AD2' },
  gmail: { badge: 'G', color: '#EA4335' },
  slack: { badge: 'S', color: '#4A154B' },
};

// Map various status strings to one of 4 kanban columns
// Unknown statuses → "Backlog" (visible), NOT dropped silently
function mapStatusToColumn(status) {
  if (!status) return 'Backlog';
  const s = String(status).toLowerCase().trim();

  // Done-ish first (so "not done" doesn't match done)
  if (s.includes('done') || s.includes('complet') || s.includes('closed') ||
      s.includes('cancel') || s === 'archived' || s === 'shipped') return 'Done';

  // In Progress
  if (s.includes('progress') || s.includes('doing') || s.includes('review') ||
      s.includes('started') || s === 'wip' || s === 'active' ||
      s === 'waiting' || s.includes('blocked')) return 'In Progress';

  // Todo — includes Notion's "To-do today" (active today work)
  if (s === 'todo' || s.includes('to do') || s === 'to-do today' ||
      s.includes('today') || s === 'open' || s === 'ready' ||
      s === 'pending' || s === 'new') return 'Todo';

  // Backlog (explicit)
  if (s.includes('backlog') || s.includes('not started') ||
      s.includes('unstarted') || s === 'someday' || s === 'idea') return 'Backlog';

  // Unknown → bucket as Backlog so it's visible
  return 'Backlog';
}

// Column name → status value to send to the provider for update
function mapColumnToStatus(column, source) {
  // Both Notion and Linear use readable status names — match directly.
  return column;
}

export function render(container, _context) {
  let tasks = [];
  let sourceFilter = 'all';
  let loading = true;
  let syncing = false;
  let syncErrors = [];
  let dragId = null;

  async function loadTasks() {
    const cached = await getItems({ type: 'task', limit: 200 });
    tasks = cached;
    draw();

    try {
      const fresh = await fetchItems({ type: 'task', limit: 200 });
      tasks = fresh;
    } catch { /* keep cached */ }

    loading = false;
    draw();
  }

  async function handleSync() {
    if (syncing) return;
    syncing = true;
    syncErrors = [];
    draw();

    // Load connected accounts to know what to sync
    let accounts = [];
    try { accounts = await get('/accounts'); } catch {}

    const taskSources = ['notion', 'linear'];
    const toSync = accounts
      .filter(a => taskSources.includes(a.provider))
      .filter(a => sourceFilter === 'all' || a.provider === sourceFilter)
      .map(a => a.provider);

    if (toSync.length === 0) {
      syncErrors.push('No task sources connected. Add Notion or Linear in Accounts.');
      syncing = false;
      draw();
      return;
    }

    for (const service of toSync) {
      try {
        const res = await syncService(service);
        if (res.errors?.length) {
          syncErrors.push(...res.errors.map(e => `${service}: ${e}`));
        }
      } catch (err) {
        syncErrors.push(`${service}: ${err.message}`);
      }
    }

    await loadTasks();
    syncing = false;
    draw();
  }

  function filteredTasks() {
    if (sourceFilter === 'all') return tasks;
    return tasks.filter(t => t.source === sourceFilter);
  }

  function grouped() {
    const groups = Object.fromEntries(COLUMNS.map(c => [c, []]));
    for (const task of filteredTasks()) {
      const col = mapStatusToColumn(task.metadata?.status);
      groups[col].push(task);
    }
    return groups;
  }

  async function moveTask(taskId, toColumn) {
    const task = tasks.find(t => t.id === taskId || t.source_id === taskId);
    if (!task) return;

    const newStatus = mapColumnToStatus(toColumn, task.source);
    const originalStatus = task.metadata?.status;

    task.metadata = { ...task.metadata, status: newStatus };
    draw();

    try {
      await post(`/actions/${task.source}/updateStatus`, {
        source_id: task.source_id,
        status: newStatus,
      });
    } catch (err) {
      task.metadata = { ...task.metadata, status: originalStatus };
      draw();
      alert(`Failed to update status: ${err.message}`);
    }
  }

  function draw() {
    const groups = grouped();
    // Determine which sources are actually present in the data
    const presentSources = [...new Set(tasks.map(t => t.source))];

    const content = h('div', { class: 'flex-col', style: { height: '100%', display: 'flex' } }, [
      h('div', { class: 'flex items-center justify-between p-3', style: { borderBottom: '1px solid var(--border)' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, 'Tasks'),
        h('div', { class: 'flex gap-2 items-center' }, [
          h('div', { class: 'filter-tabs' }, [
            sourceTab('all', 'All'),
            ...presentSources.map(s => sourceTab(s, s.charAt(0).toUpperCase() + s.slice(1))),
          ]),
          h('button', {
            class: 'btn btn-primary btn-sm',
            onClick: handleSync,
            disabled: syncing ? 'true' : undefined,
          }, syncing ? 'Syncing...' : 'Sync'),
        ]),
      ]),
      errorBanner(syncErrors),
      loading
        ? h('div', { class: 'p-4 text-sm text-muted' }, 'Loading...')
        : tasks.length === 0 && !syncing
          ? h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } },
              'No tasks yet. Click "Sync" to pull from Notion or Linear.')
          : h('div', { class: 'kanban-board p-3' },
              COLUMNS.map(col =>
                h('div', {
                  class: 'kanban-column',
                  onDragover: (e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); },
                  onDragleave: (e) => e.currentTarget.classList.remove('drag-over'),
                  onDrop: (e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drag-over');
                    if (dragId) {
                      moveTask(dragId, col);
                      dragId = null;
                    }
                  },
                }, [
                  h('div', { class: 'kanban-column-header' }, `${col} (${groups[col].length})`),
                  ...groups[col].map(renderTaskCard),
                ])
              )
            ),
    ]);

    mount(container, content);
  }

  function sourceTab(id, label) {
    return h('button', {
      class: `filter-tab${sourceFilter === id ? ' active' : ''}`,
      onClick: () => { sourceFilter = id; draw(); },
    }, label);
  }

  function renderTaskCard(task) {
    const meta = SOURCE_META[task.source] || { badge: task.source[0]?.toUpperCase() || '?', color: '#666' };
    return h('div', {
      class: 'task-card',
      draggable: 'true',
      onDragstart: (e) => { dragId = task.id || task.source_id; e.currentTarget.classList.add('dragging'); },
      onDragend: (e) => e.currentTarget.classList.remove('dragging'),
      onClick: () => {
        if (task.metadata?.url) window.open(task.metadata.url, '_blank');
      },
    }, [
      h('div', { class: 'flex items-center gap-2', style: { marginBottom: '4px' } }, [
        h('span', {
          style: { fontSize: '0.6rem', padding: '1px 5px', background: meta.color, color: 'white', borderRadius: '3px', fontWeight: '600' },
        }, meta.badge),
        h('div', { class: 'truncate', style: { flex: '1', fontSize: '0.8rem' } }, task.title || '(untitled)'),
      ]),
      task.metadata?.assignee
        ? h('div', { class: 'text-xs text-muted' }, `→ ${task.metadata.assignee}`)
        : null,
      task.metadata?.priority
        ? h('div', { class: 'text-xs text-muted' }, `priority: ${task.metadata.priority}`)
        : null,
      task.metadata?.project
        ? h('div', { class: 'text-xs text-muted truncate' }, task.metadata.project)
        : null,
    ]);
  }

  loadTasks();
}

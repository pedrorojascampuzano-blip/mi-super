// Tasks module - Kanban view across Notion + Linear
import { h, mount } from '../lib/dom.js';
import { bus } from '../lib/events.js';
import { post } from '../lib/api.js';
import { getItems } from '../lib/cache.js';
import { fetchItems, syncService } from '../lib/sync.js';

const COLUMNS = ['Backlog', 'Todo', 'In Progress', 'Done'];

// Map various status strings to kanban columns
function mapStatusToColumn(status) {
  if (!status) return 'Backlog';
  const s = status.toLowerCase();
  if (s.includes('backlog') || s.includes('not started') || s.includes('unstarted')) return 'Backlog';
  if (s.includes('todo') || s.includes('to do') || s.includes('open')) return 'Todo';
  if (s.includes('progress') || s.includes('started') || s.includes('doing') || s.includes('review')) return 'In Progress';
  if (s.includes('done') || s.includes('completed') || s.includes('closed') || s.includes('cancel')) return 'Done';
  return 'Backlog';
}

function mapColumnToStatus(column, source) {
  // Linear uses workflow state names; Notion uses status property values
  if (source === 'linear') {
    const map = {
      'Backlog': 'Backlog',
      'Todo': 'Todo',
      'In Progress': 'In Progress',
      'Done': 'Done',
    };
    return map[column] || column;
  }
  if (source === 'notion') {
    return column;
  }
  return column;
}

export function render(container, _context) {
  let tasks = [];
  let sourceFilter = 'all';
  let loading = true;
  let syncing = false;
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
    draw();
    try {
      if (sourceFilter === 'all' || sourceFilter === 'notion') {
        await syncService('notion').catch(() => {});
      }
      if (sourceFilter === 'all' || sourceFilter === 'linear') {
        await syncService('linear').catch(() => {});
      }
      await loadTasks();
    } finally {
      syncing = false;
      draw();
    }
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

    // Optimistic update
    task.metadata = { ...task.metadata, status: newStatus };
    draw();

    try {
      await post(`/actions/${task.source}/updateStatus`, {
        source_id: task.source_id,
        status: newStatus,
      });
    } catch (err) {
      // Revert on error
      task.metadata = { ...task.metadata, status: originalStatus };
      draw();
      alert(`Failed to update status: ${err.message}`);
    }
  }

  function draw() {
    const groups = grouped();

    const content = h('div', { class: 'flex-col', style: { height: '100%', display: 'flex' } }, [
      h('div', { class: 'flex items-center justify-between p-3', style: { borderBottom: '1px solid var(--border)' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, 'Tasks'),
        h('div', { class: 'flex gap-2 items-center' }, [
          h('div', { class: 'filter-tabs' }, [
            sourceTab('all', 'All'),
            sourceTab('notion', 'Notion'),
            sourceTab('linear', 'Linear'),
          ]),
          h('button', {
            class: 'btn btn-primary btn-sm',
            onClick: handleSync,
            disabled: syncing ? 'true' : undefined,
          }, syncing ? 'Syncing...' : 'Sync'),
        ]),
      ]),
      loading
        ? h('div', { class: 'p-4 text-sm text-muted' }, 'Loading...')
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
    const badge = task.source === 'notion' ? 'N' : task.source === 'linear' ? 'L' : '?';
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
        h('span', { style: { fontSize: '0.65rem', padding: '1px 5px', background: 'var(--bg-tertiary)', borderRadius: '3px' } }, badge),
        h('div', { class: 'truncate', style: { flex: '1', fontSize: '0.8rem' } }, task.title || '(untitled)'),
      ]),
      task.metadata?.assignee
        ? h('div', { class: 'text-xs text-muted' }, task.metadata.assignee)
        : null,
    ]);
  }

  loadTasks();
}

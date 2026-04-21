// Flow mode - distraction-free focus with timer and current task
import { h, mount } from '../lib/dom.js';
import { bus } from '../lib/events.js';
import { post } from '../lib/api.js';
import { getItems } from '../lib/cache.js';
import { fetchItems } from '../lib/sync.js';

const MODE_DURATIONS = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function render(container, _context) {
  let tasks = [];
  let currentTask = null;
  let relatedItems = [];
  let mode = 'focus';
  let secondsLeft = MODE_DURATIONS.focus;
  let running = false;
  let intervalId = null;

  async function loadTasks() {
    tasks = await getItems({ type: 'task', limit: 20 });
    try { tasks = await fetchItems({ type: 'task', limit: 20 }); } catch {}
    // Pick first non-done task as default
    currentTask = tasks.find(t => {
      const s = (t.metadata?.status || '').toLowerCase();
      return !s.includes('done') && !s.includes('complet') && !s.includes('cancel');
    }) || tasks[0] || null;
    if (currentTask) loadRelated(currentTask);
    draw();
  }

  async function loadRelated(task) {
    try {
      const keywords = (task.title || '').split(/\s+/).filter(w => w.length > 3).slice(0, 3).join(' ');
      if (keywords) {
        const items = await fetchItems({ q: keywords, limit: 5 });
        relatedItems = items.filter(i => i.id !== task.id).slice(0, 5);
        draw();
      }
    } catch {}
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function tick() {
    if (secondsLeft > 0) {
      secondsLeft--;
      updateTimerDisplay();
    } else {
      stopTimer();
      // Auto-switch mode
      mode = mode === 'focus' ? 'short' : 'focus';
      secondsLeft = MODE_DURATIONS[mode];
      draw();
      try {
        new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAAA').play();
      } catch {}
    }
  }

  function startTimer() {
    if (running) return;
    running = true;
    intervalId = setInterval(tick, 1000);
    draw();
  }

  function stopTimer() {
    running = false;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    draw();
  }

  function resetTimer() {
    stopTimer();
    secondsLeft = MODE_DURATIONS[mode];
    draw();
  }

  function setMode(m) {
    stopTimer();
    mode = m;
    secondsLeft = MODE_DURATIONS[m];
    draw();
  }

  async function markComplete() {
    if (!currentTask) return;
    try {
      await post(`/actions/${currentTask.source}/updateStatus`, {
        source_id: currentTask.source_id,
        status: 'Done',
      });
      // Find next task
      tasks = tasks.filter(t => t.id !== currentTask.id);
      currentTask = tasks[0] || null;
      if (currentTask) loadRelated(currentTask);
      draw();
    } catch (err) {
      alert(`Failed to complete: ${err.message}`);
    }
  }

  function updateTimerDisplay() {
    const timerEl = container.querySelector('.flow-timer');
    if (timerEl) timerEl.textContent = formatTime(secondsLeft);
  }

  function exitFlow() {
    stopTimer();
    bus.emit('flow:exit');
  }

  function draw() {
    const content = h('div', { class: 'flow-container p-4' }, [
      h('div', { class: 'flex items-center justify-between w-full', style: { maxWidth: '600px' } }, [
        h('div', { style: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' } }, 'Flow Mode'),
        h('button', { class: 'btn btn-ghost btn-sm', onClick: exitFlow }, 'Exit'),
      ]),
      currentTask
        ? h('div', { class: 'flow-task' }, [
            h('div', { class: 'text-xs text-muted', style: { marginBottom: '4px' } }, `${currentTask.source} · ${currentTask.metadata?.status || 'no status'}`),
            h('div', { style: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' } }, currentTask.title),
            currentTask.body ? h('div', { class: 'text-sm text-secondary' }, currentTask.body.slice(0, 200)) : null,
          ])
        : h('div', { class: 'flow-task text-muted' }, 'No task selected. Connect Linear or Notion and sync tasks.'),
      h('div', { class: 'flow-timer' }, formatTime(secondsLeft)),
      h('div', { class: 'filter-tabs' }, [
        modeTab('focus', 'Focus 25m'),
        modeTab('short', 'Short 5m'),
        modeTab('long', 'Long 15m'),
      ]),
      h('div', { class: 'flow-controls' }, [
        h('button', {
          class: 'btn btn-primary',
          onClick: running ? stopTimer : startTimer,
        }, running ? 'Pause' : 'Start'),
        h('button', { class: 'btn btn-ghost', onClick: resetTimer }, 'Reset'),
        currentTask ? h('button', { class: 'btn btn-ghost', onClick: markComplete }, 'Mark Complete') : null,
      ]),
      relatedItems.length > 0
        ? h('div', { style: { maxWidth: '600px', width: '100%', marginTop: '16px' } }, [
            h('div', { class: 'text-xs text-muted', style: { marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Related Context'),
            h('div', { class: 'flex-col gap-2', style: { display: 'flex' } },
              relatedItems.map(item =>
                h('div', { class: 'card', style: { padding: '8px', fontSize: '0.75rem' } }, [
                  h('div', { class: 'text-xs text-muted' }, `${item.source} · ${item.item_type}`),
                  h('div', { class: 'truncate' }, item.title || ''),
                ])
              )
            ),
          ])
        : null,
    ]);

    mount(container, content);
  }

  function modeTab(id, label) {
    return h('button', {
      class: `filter-tab${mode === id ? ' active' : ''}`,
      onClick: () => setMode(id),
    }, label);
  }

  // Emit flow:enter to collapse other panels (only if not already in flow)
  bus.emit('flow:enter');

  loadTasks();

  // Cleanup interval when this panel unmounts (detected via layout change)
  const unsubLayout = bus.on('layout:changed', () => {
    // If this container is no longer in DOM, clean up
    if (!document.body.contains(container)) {
      stopTimer();
      unsubLayout();
    }
  });
}

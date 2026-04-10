import { h } from '../lib/dom.js';
import { bus } from '../lib/events.js';

let isOpen = false;
let selectedIndex = 0;
let currentQuery = '';
const commands = [];

export function registerCommand(cmd) {
  commands.push(cmd);
}

export function getCommands() {
  return commands;
}

export function initCommandPalette() {
  // Register default commands
  registerCommand({ label: 'Open Accounts', keywords: 'vault settings accounts', action: () => bus.emit('navigate', 'vault') });
  registerCommand({ label: 'Open Dashboard', keywords: 'home triage feed', action: () => bus.emit('navigate', 'dashboard') });
  registerCommand({ label: 'Open Tasks', keywords: 'kanban todo linear notion', action: () => bus.emit('navigate', 'tasks') });
  registerCommand({ label: 'Open Comms', keywords: 'messages gmail slack whatsapp email', action: () => bus.emit('navigate', 'comms') });
  registerCommand({ label: 'Open Contacts', keywords: 'people directory', action: () => bus.emit('navigate', 'contacts') });
  registerCommand({ label: 'Open AI Chat', keywords: 'assistant ai chat', action: () => bus.emit('navigate', 'ai-chat') });
  registerCommand({ label: 'Enter Flow Mode', keywords: 'focus deep work pomodoro timer', action: () => bus.emit('navigate', 'flow') });
  registerCommand({ label: 'New Panel (Right)', keywords: 'split horizontal', action: () => bus.emit('panel:split', 'horizontal') });
  registerCommand({ label: 'New Panel (Below)', keywords: 'split vertical', action: () => bus.emit('panel:split', 'vertical') });
  registerCommand({ label: 'Close Active Panel', keywords: 'close remove', action: () => bus.emit('panel:close-active') });
  registerCommand({ label: 'Sync All Services', keywords: 'refresh sync update', action: () => bus.emit('sync:all') });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape' && isOpen) close();
  });

  bus.on('command-palette:open', () => open());
}

function toggle() { isOpen ? close() : open(); }

function open() {
  isOpen = true;
  selectedIndex = 0;
  currentQuery = '';
  render('');
}

function close() {
  isOpen = false;
  const overlay = document.querySelector('#cmd-palette');
  if (overlay) overlay.remove();
}

function getFiltered(query) {
  return query
    ? commands.filter(c => (c.label + ' ' + c.keywords).toLowerCase().includes(query.toLowerCase()))
    : commands;
}

function render(query) {
  currentQuery = query;
  const filtered = getFiltered(query);
  if (selectedIndex >= filtered.length) selectedIndex = 0;

  const el = h('div', {
    id: 'cmd-palette',
    class: 'modal-overlay',
    onClick: (e) => { if (e.target.id === 'cmd-palette') close(); },
  }, [
    h('div', { class: 'modal' }, [
      h('input', {
        class: 'input',
        style: { borderRadius: '8px 8px 0 0', border: 'none', borderBottom: '1px solid var(--border)', padding: '14px 16px', fontSize: '0.95rem' },
        placeholder: 'Type a command...',
        value: query,
        onInput: (e) => { selectedIndex = 0; render(e.target.value); },
        onKeydown: (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            render(currentQuery);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            render(currentQuery);
          } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            filtered[selectedIndex].action();
            close();
          }
        },
      }),
      h('div', { style: { overflowY: 'auto', maxHeight: '300px' } },
        filtered.map((cmd, i) =>
          h('div', {
            style: {
              padding: '10px 16px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              background: i === selectedIndex ? 'var(--bg-tertiary)' : 'transparent',
            },
            onClick: () => { cmd.action(); close(); },
            onMouseenter: () => { selectedIndex = i; render(currentQuery); },
          }, cmd.label)
        )
      ),
    ]),
  ]);

  const existing = document.querySelector('#cmd-palette');
  if (existing) existing.replaceWith(el);
  else document.body.appendChild(el);

  el.querySelector('input')?.focus();
  // Restore cursor position to end of input
  const input = el.querySelector('input');
  if (input) input.setSelectionRange(query.length, query.length);
}

import { h, mount } from '../lib/dom.js';
import { bus } from '../lib/events.js';

let isOpen = false;
const commands = [];

export function registerCommand(cmd) {
  commands.push(cmd);
}

export function initCommandPalette() {
  // Register default commands
  registerCommand({ label: 'Open Accounts', keywords: 'vault settings accounts', action: () => bus.emit('navigate', 'vault') });
  registerCommand({ label: 'Open Dashboard', keywords: 'home triage feed', action: () => bus.emit('navigate', 'dashboard') });

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
  render('');
}

function close() {
  isOpen = false;
  const overlay = document.querySelector('#cmd-palette');
  if (overlay) overlay.remove();
}

function render(query) {
  const filtered = query
    ? commands.filter(c => (c.label + ' ' + c.keywords).toLowerCase().includes(query.toLowerCase()))
    : commands;

  const el = h('div', { id: 'cmd-palette', class: 'modal-overlay', onClick: (e) => { if (e.target.id === 'cmd-palette') close(); } }, [
    h('div', { class: 'modal' }, [
      h('input', {
        class: 'input',
        style: { borderRadius: '8px 8px 0 0', border: 'none', borderBottom: '1px solid var(--border)', padding: '14px 16px', fontSize: '0.95rem' },
        placeholder: 'Type a command...',
        value: query,
        onInput: (e) => render(e.target.value),
        onKeydown: (e) => {
          if (e.key === 'Enter' && filtered.length > 0) {
            filtered[0].action();
            close();
          }
        },
      }),
      h('div', { style: { overflowY: 'auto', maxHeight: '300px' } },
        filtered.map(cmd =>
          h('div', {
            style: { padding: '10px 16px', cursor: 'pointer', fontSize: '0.875rem' },
            class: 'btn-ghost',
            onClick: () => { cmd.action(); close(); },
          }, cmd.label)
        )
      ),
    ]),
  ]);

  const existing = document.querySelector('#cmd-palette');
  if (existing) existing.replaceWith(el);
  else document.body.appendChild(el);

  el.querySelector('input')?.focus();
}

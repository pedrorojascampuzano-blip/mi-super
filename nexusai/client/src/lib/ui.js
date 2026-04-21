// Shared UI helpers used across modules
import { h } from './dom.js';
import { bus } from './events.js';

// Render a red error banner with optional reconnect link.
// errors: Array<string> - each line shown on its own row
// Returns null if errors is empty, so caller can safely pass directly to h(...)
export function errorBanner(errors) {
  if (!errors?.length) return null;
  return h('div', {
    class: 'px-3 py-2',
    style: { borderBottom: '1px solid var(--border)', background: 'rgba(239,68,68,0.05)' },
  }, [
    ...errors.map(err => {
      // Detect provider name at the start: "gmail: token expired"
      const match = typeof err === 'string' ? err.match(/^(\w+):\s*(.+)$/) : null;
      const provider = match?.[1];
      const message = match?.[2] || String(err);
      const isAuthError = /401|403|token|auth|expired|invalid/i.test(message);

      return h('div', {
        class: 'flex items-center gap-2',
        style: { color: 'var(--error)', fontSize: '0.75rem', padding: '2px 0' },
      }, [
        h('span', { style: { flex: '1' } },
          provider ? `${provider}: ${message}` : message
        ),
        isAuthError && provider
          ? h('button', {
              class: 'btn btn-ghost btn-sm',
              style: { fontSize: '0.7rem', padding: '2px 8px', color: 'var(--accent)' },
              onClick: () => bus.emit('navigate', 'vault'),
            }, 'Reconnect')
          : null,
      ]);
    }),
  ]);
}

// Show a transient status line (e.g. "Syncing notion...")
export function statusLine(text, tone = 'info') {
  if (!text) return null;
  const color = tone === 'success' ? 'var(--success)'
    : tone === 'error' ? 'var(--error)'
    : 'var(--accent)';
  return h('div', {
    class: 'px-3 py-2 text-xs',
    style: { borderBottom: '1px solid var(--border)', color },
  }, text);
}

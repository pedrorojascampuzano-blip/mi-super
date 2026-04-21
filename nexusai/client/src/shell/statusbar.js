import { h } from '../lib/dom.js';

const SERVICES = ['notion', 'gmail', 'slack', 'linear', 'calendar', 'whatsapp'];

export function createStatusbar(accounts = []) {
  const connectedSet = new Set(accounts.map(a => a.provider));

  return h('div', { class: 'statusbar' }, [
    ...SERVICES.map(s =>
      h('div', { class: 'status-item', title: `${s}: ${connectedSet.has(s) ? 'connected' : 'not connected'}` }, [
        h('div', { class: `status-dot ${connectedSet.has(s) ? 'connected' : ''}` }),
        s.charAt(0).toUpperCase() + s.slice(1),
      ])
    ),
    h('div', { style: { flex: '1' } }),
    h('div', { class: 'status-item text-muted' }, 'NexusAI v0.1'),
  ]);
}

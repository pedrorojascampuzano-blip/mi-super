import { h } from '../lib/dom.js';
import { signOut } from '../lib/supabase.js';
import { bus } from '../lib/events.js';

export function createTopbar(user) {
  function openCommandPalette() {
    bus.emit('command-palette:open');
  }

  return h('div', { class: 'topbar' }, [
    h('div', { class: 'topbar-logo' }, 'NexusAI'),
    h('div', {
      class: 'topbar-search',
      onClick: openCommandPalette,
    }, 'Search or command... ⌘K'),
    h('div', { class: 'flex items-center gap-2' }, [
      h('button', {
        class: 'btn btn-ghost btn-sm',
        onClick: () => bus.emit('navigate', 'vault'),
        title: 'Settings',
      }, 'Accounts'),
      h('button', {
        class: 'btn btn-ghost btn-sm',
        onClick: async () => { await signOut(); bus.emit('auth:changed', null); },
      }, 'Sign Out'),
    ]),
  ]);
}

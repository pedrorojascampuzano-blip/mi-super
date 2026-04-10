// Contacts module - people directory with interaction history
import { h, mount } from '../lib/dom.js';
import { get } from '../lib/api.js';

function relativeTime(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function render(container, _context) {
  let contacts = [];
  let selected = null;
  let history = null;
  let search = '';
  let loading = true;

  async function loadContacts() {
    try {
      contacts = await get('/contacts' + (search ? `?q=${encodeURIComponent(search)}` : ''));
    } catch {
      contacts = [];
    }
    loading = false;
    draw();
  }

  async function loadHistory(contactId) {
    try {
      history = await get(`/contacts/${contactId}/history`);
    } catch {
      history = null;
    }
    draw();
  }

  function initial(name) {
    return (name || '?').charAt(0).toUpperCase();
  }

  function draw() {
    const content = h('div', { class: 'contact-layout' }, [
      h('div', { class: 'contact-list flex-col' }, [
        h('div', { class: 'p-3', style: { borderBottom: '1px solid var(--border)' } }, [
          h('div', { style: { fontWeight: '600', fontSize: '0.9rem', marginBottom: '8px' } }, 'Contacts'),
          h('input', {
            class: 'input',
            placeholder: 'Search...',
            value: search,
            onInput: (e) => {
              search = e.target.value;
              clearTimeout(draw._t);
              draw._t = setTimeout(loadContacts, 300);
            },
          }),
        ]),
        h('div', { style: { flex: '1', overflowY: 'auto' } },
          loading
            ? h('div', { class: 'p-4 text-sm text-muted' }, 'Loading...')
            : contacts.length === 0
              ? h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } }, 'No contacts yet')
              : contacts.map(renderContactItem)
        ),
      ]),
      h('div', { class: 'flex-1 flex-col' }, selected ? renderDetail() : [
        h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center', marginTop: '40%' } },
          'Select a contact'),
      ]),
    ]);

    mount(container, content);
  }

  function renderContactItem(contact) {
    const isActive = selected?.id === contact.id;
    return h('div', {
      class: `contact-item${isActive ? ' active' : ''}`,
      style: isActive ? { background: 'var(--bg-tertiary)' } : {},
      onClick: () => {
        selected = contact;
        history = null;
        loadHistory(contact.id);
        draw();
      },
    }, [
      h('div', { class: 'contact-avatar' }, initial(contact.name)),
      h('div', { style: { flex: '1', minWidth: '0' } }, [
        h('div', { class: 'truncate', style: { fontWeight: '500', fontSize: '0.85rem' } }, contact.name || contact.email),
        h('div', { class: 'truncate text-xs text-muted' }, contact.email),
      ]),
    ]);
  }

  function renderDetail() {
    return [
      h('div', { class: 'p-4', style: { borderBottom: '1px solid var(--border)' } }, [
        h('div', { class: 'flex items-center gap-3' }, [
          h('div', { class: 'contact-avatar', style: { width: '48px', height: '48px', fontSize: '1.2rem' } }, initial(selected.name)),
          h('div', { style: { flex: '1' } }, [
            h('div', { style: { fontWeight: '600', fontSize: '1rem' } }, selected.name || selected.email),
            h('div', { class: 'text-sm text-secondary' }, selected.email),
            selected.phone ? h('div', { class: 'text-xs text-muted' }, selected.phone) : null,
          ]),
        ]),
        h('div', { class: 'flex gap-1', style: { marginTop: '12px' } },
          (selected.sources || []).map(s =>
            h('span', {
              class: 'text-xs',
              style: { padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: '3px' },
            }, s)
          )
        ),
      ]),
      h('div', { class: 'p-4', style: { flex: '1', overflowY: 'auto' } }, [
        h('div', { class: 'text-xs text-muted', style: { marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Interaction History'),
        !history
          ? h('div', { class: 'text-sm text-muted' }, 'Loading...')
          : history.items?.length === 0
            ? h('div', { class: 'text-sm text-muted' }, 'No interactions yet')
            : h('div', { class: 'flex-col gap-2', style: { display: 'flex' } },
                (history.items || []).map(item =>
                  h('div', {
                    class: 'card',
                    style: { padding: '10px', fontSize: '0.8rem', cursor: item.metadata?.url ? 'pointer' : 'default' },
                    onClick: () => { if (item.metadata?.url) window.open(item.metadata.url, '_blank'); },
                  }, [
                    h('div', { class: 'flex items-center justify-between', style: { marginBottom: '4px' } }, [
                      h('span', { class: 'text-xs text-muted' }, `${item.source} · ${item.item_type}`),
                      h('span', { class: 'text-xs text-muted' }, relativeTime(item.source_timestamp)),
                    ]),
                    h('div', { class: 'truncate', style: { fontWeight: '500' } }, item.title || '(untitled)'),
                    item.body ? h('div', { class: 'text-xs text-secondary truncate' }, item.body.slice(0, 120)) : null,
                  ])
                )
              ),
      ]),
    ];
  }

  loadContacts();
}

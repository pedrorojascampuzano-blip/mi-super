// Vault - clean table view of connected accounts with multi-account support
import { h, mount } from '../lib/dom.js';
import { get, post, del } from '../lib/api.js';
import { bus } from '../lib/events.js';

const PROVIDERS = [
  { id: 'notion', label: 'Notion', type: 'API Key', syncs: 'Pages, tasks', fields: [{ key: 'api_key', label: 'Integration Token', type: 'password' }] },
  { id: 'gmail', label: 'Gmail', type: 'OAuth2', syncs: 'Messages', fields: [{ key: 'refresh_token', label: 'Refresh Token', type: 'password' }, { key: 'client_id', label: 'Client ID', type: 'text' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },
  { id: 'calendar', label: 'Calendar', type: 'OAuth2', syncs: 'Events', fields: [{ key: 'refresh_token', label: 'Refresh Token', type: 'password' }, { key: 'client_id', label: 'Client ID', type: 'text' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },
  { id: 'slack', label: 'Slack', type: 'Bot Token', syncs: 'Messages', fields: [{ key: 'bot_token', label: 'Bot Token (xoxb-)', type: 'password' }] },
  { id: 'linear', label: 'Linear', type: 'API Key', syncs: 'Issues', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'whatsapp', label: 'WhatsApp', type: 'Business API', syncs: 'Send only', fields: [{ key: 'api_token', label: 'Business API Token', type: 'password' }, { key: 'phone_id', label: 'Phone Number ID', type: 'text' }] },
  { id: 'deepseek', label: 'DeepSeek', type: 'API Key', syncs: 'AI Chat', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'gemini', label: 'Gemini', type: 'API Key', syncs: 'AI Chat', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'mistral', label: 'Mistral', type: 'API Key', syncs: 'AI Chat', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
];

function relativeTime(iso) {
  if (!iso) return 'never';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export function renderVault(container) {
  let accounts = [];
  let expandedForm = null; // provider id being added

  async function loadAccounts() {
    try { accounts = await get('/accounts'); } catch { accounts = []; }
    bus.emit('accounts:changed', accounts);
    render();
  }

  async function addAccount(e, provider) {
    e.preventDefault();
    e.stopPropagation();
    const form = e.target;
    const credentials = {};
    for (const field of provider.fields) {
      credentials[field.key] = form[field.key].value;
    }
    try {
      await post('/accounts', {
        provider: provider.id,
        label: form.label.value || null,
        credentials,
      });
      expandedForm = null;
      await loadAccounts();
    } catch (err) {
      alert('Failed to connect: ' + err.message);
    }
  }

  async function removeAccount(id) {
    if (!confirm('Remove this connection?')) return;
    try {
      await del(`/accounts/${id}`);
      await loadAccounts();
    } catch (err) {
      alert('Failed to remove: ' + err.message);
    }
  }

  async function syncOne(service) {
    try {
      const { syncService } = await import('../lib/sync.js');
      await syncService(service);
      await loadAccounts();
    } catch (err) {
      alert(`Sync failed: ${err.message}`);
    }
  }

  function render() {
    // Group accounts by provider
    const connected = new Map();
    for (const acc of accounts) {
      if (!connected.has(acc.provider)) connected.set(acc.provider, []);
      connected.get(acc.provider).push(acc);
    }

    const content = h('div', { class: 'p-4', style: { maxWidth: '800px', margin: '0 auto' } }, [
      h('div', { style: { marginBottom: '20px' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '1rem', marginBottom: '4px' } }, 'Accounts'),
        h('div', { class: 'text-xs text-muted' }, 'Credentials are encrypted with AES-256-GCM.'),
      ]),

      // Connected accounts table
      accounts.length > 0
        ? renderTable(connected)
        : null,

      // Available to connect
      h('div', { style: { marginTop: '20px' } }, [
        h('div', { class: 'text-xs text-muted', style: { textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' } }, 'Add Connection'),
        h('table', { class: 'vault-table' }, [
          h('tbody', {},
            PROVIDERS.map(p => renderAvailableRow(p, connected))
          ),
        ]),
      ]),
    ]);

    mount(container, content);
  }

  function renderTable(connected) {
    const rows = [];
    for (const [providerId, accs] of connected) {
      for (const acc of accs) {
        const prov = PROVIDERS.find(p => p.id === providerId) || { label: providerId, type: '?', syncs: '?' };
        rows.push(renderConnectedRow(acc, prov));
      }
    }

    return h('table', { class: 'vault-table' }, [
      h('thead', {}, [
        h('tr', {}, [
          h('th', {}, 'Service'),
          h('th', {}, 'Label'),
          h('th', {}, 'Syncs'),
          h('th', {}, 'Last Sync'),
          h('th', {}, 'Status'),
          h('th', { style: { textAlign: 'right' } }, ''),
        ]),
      ]),
      h('tbody', {}, rows),
    ]);
  }

  function renderConnectedRow(account, prov) {
    const statusColor = account.status === 'connected' ? 'var(--success)'
      : account.status === 'error' ? 'var(--error)' : 'var(--text-muted)';

    return h('tr', {}, [
      h('td', {}, [
        h('span', { style: { fontWeight: '500' } }, prov.label),
        h('span', { class: 'text-xs text-muted', style: { marginLeft: '6px' } }, prov.type),
      ]),
      h('td', { class: 'text-sm text-secondary' }, account.label || '—'),
      h('td', { class: 'text-xs text-muted' }, prov.syncs),
      h('td', { class: 'text-xs text-muted' }, relativeTime(account.last_synced_at)),
      h('td', {}, [
        h('span', {
          style: { display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: statusColor },
        }),
      ]),
      h('td', { style: { textAlign: 'right' } }, [
        ['notion', 'gmail', 'slack', 'linear', 'calendar', 'whatsapp'].includes(account.provider)
          ? h('button', { class: 'btn btn-ghost btn-sm', onClick: () => syncOne(account.provider), title: 'Sync now' }, 'sync')
          : null,
        h('button', {
          class: 'btn btn-ghost btn-sm',
          style: { color: 'var(--error)' },
          onClick: () => removeAccount(account.id),
        }, '×'),
      ]),
    ]);
  }

  function renderAvailableRow(provider, connected) {
    const alreadyConnected = connected.has(provider.id);
    const isExpanded = expandedForm === provider.id;

    return h('tr', {}, [
      h('td', { colspan: '6' }, [
        h('div', {
          class: 'flex items-center justify-between',
          style: { cursor: 'pointer', padding: '2px 0' },
          onClick: () => {
            expandedForm = isExpanded ? null : provider.id;
            render();
          },
        }, [
          h('div', { class: 'flex items-center gap-2' }, [
            h('span', { style: { fontWeight: '500', fontSize: '0.85rem' } }, provider.label),
            h('span', { class: 'text-xs text-muted' }, `${provider.type} · ${provider.syncs}`),
            alreadyConnected
              ? h('span', { class: 'text-xs', style: { color: 'var(--success)' } }, '● connected')
              : null,
          ]),
          h('span', { class: 'text-xs text-muted' }, isExpanded ? '▾' : alreadyConnected ? '+ add another' : '+ connect'),
        ]),
        isExpanded ? renderAddForm(provider) : null,
      ]),
    ]);
  }

  function renderAddForm(provider) {
    return h('form', {
      onSubmit: (e) => addAccount(e, provider),
      onClick: (e) => e.stopPropagation(),
      style: { marginTop: '8px', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' },
    }, [
      h('div', { class: 'input-group', style: { marginBottom: '8px' } }, [
        h('label', {}, 'Label'),
        h('input', { class: 'input', name: 'label', placeholder: `e.g. Work ${provider.label}` }),
      ]),
      ...provider.fields.map(f =>
        h('div', { class: 'input-group', style: { marginBottom: '8px' } }, [
          h('label', {}, f.label),
          h('input', { class: 'input', name: f.key, type: f.type, required: 'true', placeholder: f.label }),
        ])
      ),
      h('div', { class: 'flex gap-2', style: { marginTop: '12px' } }, [
        h('button', { class: 'btn btn-primary btn-sm', type: 'submit' }, 'Connect'),
        h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => { expandedForm = null; render(); } }, 'Cancel'),
      ]),
    ]);
  }

  loadAccounts();
}

import { h, mount } from '../lib/dom.js';
import { get, post, del } from '../lib/api.js';

const PROVIDERS = [
  { id: 'notion', label: 'Notion', color: '#000', fields: [{ key: 'api_key', label: 'Integration Token', type: 'password' }] },
  { id: 'gmail', label: 'Gmail', color: '#EA4335', fields: [{ key: 'refresh_token', label: 'Refresh Token', type: 'password' }, { key: 'client_id', label: 'Client ID', type: 'text' }, { key: 'client_secret', label: 'Client Secret', type: 'password' }] },
  { id: 'slack', label: 'Slack', color: '#4A154B', fields: [{ key: 'bot_token', label: 'Bot Token (xoxb-)', type: 'password' }] },
  { id: 'linear', label: 'Linear', color: '#5E6AD2', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'calendar', label: 'Calendar', color: '#4285F4', fields: [{ key: 'refresh_token', label: 'Refresh Token', type: 'password' }] },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', fields: [{ key: 'api_token', label: 'Business API Token', type: 'password' }, { key: 'phone_id', label: 'Phone Number ID', type: 'text' }] },
  { id: 'deepseek', label: 'DeepSeek', color: '#0066FF', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'gemini', label: 'Gemini', color: '#8E75B2', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
  { id: 'mistral', label: 'Mistral', color: '#FF7000', fields: [{ key: 'api_key', label: 'API Key', type: 'password' }] },
];

export function renderVault(container) {
  let accounts = [];
  let addingProvider = null;

  async function loadAccounts() {
    try {
      accounts = await get('/accounts');
    } catch {
      accounts = [];
    }
    render();
  }

  function render() {
    const content = h('div', { class: 'p-4 flex-col', style: { gap: '16px', display: 'flex', maxWidth: '900px', margin: '0 auto' } }, [
      h('div', { class: 'flex items-center justify-between' }, [
        h('h2', { style: { fontSize: '1.25rem', fontWeight: '700' } }, 'Connected Accounts'),
      ]),
      h('p', { class: 'text-sm text-secondary', style: { marginTop: '-8px' } },
        'Manage your service connections. Credentials are encrypted and stored securely.'),

      // Connected accounts
      accounts.length > 0
        ? h('div', { class: 'vault-grid' }, accounts.map(renderAccountCard))
        : h('div', { class: 'card text-sm text-muted', style: { textAlign: 'center' } }, 'No accounts connected yet.'),

      // Add new section
      h('h3', { style: { fontSize: '0.9rem', fontWeight: '600', marginTop: '12px' } }, 'Add Connection'),
      h('div', { class: 'vault-grid' }, PROVIDERS
        .filter(p => !accounts.some(a => a.provider === p.id))
        .map(p => h('div', {
          class: 'account-card',
          style: { cursor: 'pointer', border: addingProvider === p.id ? `1px solid ${p.color}` : undefined },
          onClick: () => { addingProvider = addingProvider === p.id ? null : p.id; render(); }
        }, [
          h('div', { class: 'account-provider' }, [
            h('div', { class: 'provider-icon', style: { background: p.color } }, p.id[0].toUpperCase()),
            p.label,
          ]),
          addingProvider === p.id ? renderAddForm(p) : h('div', { class: 'text-xs text-muted' }, 'Click to connect'),
        ]))
      ),
    ]);

    mount(container, content);
  }

  function renderAccountCard(account) {
    const prov = PROVIDERS.find(p => p.id === account.provider) || { color: '#666', label: account.provider };
    return h('div', { class: 'account-card' }, [
      h('div', { class: 'account-card-header' }, [
        h('div', { class: 'account-provider' }, [
          h('div', { class: 'provider-icon', style: { background: prov.color } }, prov.id?.[0]?.toUpperCase() || '?'),
          h('span', {}, prov.label),
        ]),
        h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: `status-dot ${account.status}` }),
          h('button', { class: 'btn btn-ghost btn-sm btn-danger', onClick: () => removeAccount(account.id) }, 'Remove'),
        ]),
      ]),
      account.label ? h('div', { class: 'text-xs text-secondary' }, account.label) : null,
      h('div', { class: 'text-xs text-muted' },
        account.last_synced_at ? `Last synced: ${new Date(account.last_synced_at).toLocaleString()}` : 'Never synced'
      ),
    ]);
  }

  function renderAddForm(provider) {
    return h('form', { onSubmit: (e) => addAccount(e, provider), style: { marginTop: '8px' } }, [
      h('div', { class: 'input-group', style: { marginBottom: '8px' } }, [
        h('label', {}, 'Label (optional)'),
        h('input', { class: 'input', name: 'label', placeholder: `e.g. Work ${provider.label}` }),
      ]),
      ...provider.fields.map(f =>
        h('div', { class: 'input-group', style: { marginBottom: '8px' } }, [
          h('label', {}, f.label),
          h('input', { class: 'input', name: f.key, type: f.type, required: 'true', placeholder: f.label }),
        ])
      ),
      h('button', { class: 'btn btn-primary btn-sm', type: 'submit' }, 'Connect'),
    ]);
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
      addingProvider = null;
      await loadAccounts();
    } catch (err) {
      alert('Failed to connect: ' + err.message);
    }
  }

  async function removeAccount(id) {
    if (!confirm('Remove this account connection?')) return;
    try {
      await del(`/accounts/${id}`);
      await loadAccounts();
    } catch (err) {
      alert('Failed to remove: ' + err.message);
    }
  }

  loadAccounts();
}

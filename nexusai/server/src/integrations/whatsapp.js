// WhatsApp Business API integration
// Note: WhatsApp Business API is webhook-based for receiving messages.
// This plugin is primarily for sending messages; sync returns empty.
const BASE = 'https://graph.facebook.com/v18.0';

async function whatsappFetch(credentials, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${credentials.api_token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${err.slice(0, 200)}`);
  }
  return res.json();
}

export default {
  name: 'whatsapp',
  requiredCredentials: ['api_token', 'phone_id'],

  async validate(credentials) {
    try {
      await whatsappFetch(credentials, `/${credentials.phone_id}`);
      return true;
    } catch {
      return false;
    }
  },

  async sync(_credentials, _lastSyncAt) {
    // WhatsApp Business API doesn't support message polling.
    // Messages arrive via webhooks which need separate infrastructure.
    return {
      items: [],
      errors: ['WhatsApp requires webhook infrastructure for inbound messages. Only send actions are supported.'],
    };
  },

  actions: {
    async sendMessage(credentials, { to, text }) {
      return whatsappFetch(credentials, `/${credentials.phone_id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        }),
      });
    },

    async send(credentials, params) {
      return this.sendMessage(credentials, params);
    },
  },
};

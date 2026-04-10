// Gmail integration - Google OAuth2 + REST API
import { getGoogleAccessToken, googleFetch } from './google-auth.js';

const BASE = 'https://gmail.googleapis.com/gmail/v1';

function getHeader(message, name) {
  const header = message.payload?.headers?.find(
    h => h.name.toLowerCase() === name.toLowerCase()
  );
  return header?.value || null;
}

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default {
  name: 'gmail',
  requiredCredentials: ['refresh_token', 'client_id', 'client_secret'],

  async validate(credentials) {
    try {
      const token = await getGoogleAccessToken(credentials);
      await googleFetch(token, `${BASE}/users/me/profile`);
      return true;
    } catch {
      return false;
    }
  },

  async sync(credentials, lastSyncAt) {
    const items = [];
    const errors = [];

    try {
      const token = await getGoogleAccessToken(credentials);

      // Build query: after:TIMESTAMP for incremental sync
      let q = 'in:inbox';
      if (lastSyncAt) {
        const epoch = Math.floor(new Date(lastSyncAt).getTime() / 1000);
        q += ` after:${epoch}`;
      }

      const list = await googleFetch(token,
        `${BASE}/users/me/messages?maxResults=50&q=${encodeURIComponent(q)}`
      );

      // Fetch each message (parallel, capped)
      const messageIds = (list.messages || []).slice(0, 50);
      const results = await Promise.allSettled(
        messageIds.map(m =>
          googleFetch(token, `${BASE}/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`)
        )
      );

      for (const result of results) {
        if (result.status === 'rejected') {
          errors.push(result.reason?.message || 'message fetch failed');
          continue;
        }
        const msg = result.value;
        items.push({
          source: 'gmail',
          source_id: msg.id,
          item_type: 'message',
          title: getHeader(msg, 'Subject') || '(no subject)',
          body: msg.snippet || null,
          metadata: {
            from: getHeader(msg, 'From'),
            to: getHeader(msg, 'To'),
            date: getHeader(msg, 'Date'),
            labels: msg.labelIds || [],
            threadId: msg.threadId,
            unread: (msg.labelIds || []).includes('UNREAD'),
          },
          source_timestamp: new Date(parseInt(msg.internalDate, 10)).toISOString(),
        });
      }
    } catch (err) {
      errors.push(`gmail sync: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async send(credentials, { to, subject, body, replyToThreadId }) {
      const token = await getGoogleAccessToken(credentials);
      const raw = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        body,
      ].join('\r\n');

      const payload = { raw: base64UrlEncode(raw) };
      if (replyToThreadId) payload.threadId = replyToThreadId;

      return googleFetch(token, `${BASE}/users/me/messages/send`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    async sendMessage(credentials, params) {
      // Alias for send
      return this.send(credentials, params);
    },

    async search(credentials, { query }) {
      const token = await getGoogleAccessToken(credentials);
      const list = await googleFetch(token,
        `${BASE}/users/me/messages?maxResults=20&q=${encodeURIComponent(query)}`
      );
      return list.messages || [];
    },
  },
};

// Slack integration - Web API with bot token
const BASE = 'https://slack.com/api';

async function slackCall(credentials, method, params = {}, httpMethod = 'GET') {
  const url = new URL(`${BASE}/${method}`);
  let body;

  if (httpMethod === 'GET') {
    for (const [k, v] of Object.entries(params)) {
      if (v != null) url.searchParams.set(k, String(v));
    }
  } else {
    body = JSON.stringify(params);
  }

  const res = await fetch(url.toString(), {
    method: httpMethod,
    headers: {
      Authorization: `Bearer ${credentials.bot_token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body,
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Slack ${method}: ${data.error || 'unknown error'}`);
  }
  return data;
}

export default {
  name: 'slack',
  requiredCredentials: ['bot_token'],

  async validate(credentials) {
    try {
      await slackCall(credentials, 'auth.test');
      return true;
    } catch {
      return false;
    }
  },

  async sync(credentials, lastSyncAt) {
    const items = [];
    const errors = [];

    try {
      // Get channels the bot is a member of
      const channels = await slackCall(credentials, 'conversations.list', {
        types: 'public_channel,private_channel',
        limit: 100,
        exclude_archived: true,
      });

      const activeChannels = (channels.channels || [])
        .filter(c => c.is_member)
        .slice(0, 10); // Limit to 10 channels

      const oldest = lastSyncAt
        ? Math.floor(new Date(lastSyncAt).getTime() / 1000)
        : Math.floor((Date.now() - 7 * 24 * 3600 * 1000) / 1000); // 7 days

      for (const channel of activeChannels) {
        try {
          const history = await slackCall(credentials, 'conversations.history', {
            channel: channel.id,
            oldest: String(oldest),
            limit: 30,
          });

          for (const msg of history.messages || []) {
            if (!msg.text || msg.subtype) continue; // skip joins/leaves/etc.

            items.push({
              source: 'slack',
              source_id: `${channel.id}-${msg.ts}`,
              item_type: 'message',
              title: `#${channel.name}`,
              body: msg.text,
              metadata: {
                channel: channel.id,
                channelName: channel.name,
                user: msg.user,
                ts: msg.ts,
                thread_ts: msg.thread_ts || null,
                reply_count: msg.reply_count || 0,
              },
              source_timestamp: new Date(parseFloat(msg.ts) * 1000).toISOString(),
            });
          }
        } catch (err) {
          errors.push(`channel ${channel.name}: ${err.message}`);
        }
      }
    } catch (err) {
      errors.push(`slack sync: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async sendMessage(credentials, { channel, text, thread_ts }) {
      return slackCall(credentials, 'chat.postMessage', {
        channel,
        text,
        thread_ts,
      }, 'POST');
    },

    async send(credentials, params) {
      // Alias used by comms module
      return this.sendMessage(credentials, params);
    },

    async getChannels(credentials) {
      const data = await slackCall(credentials, 'conversations.list', {
        types: 'public_channel,private_channel',
        exclude_archived: true,
      });
      return data.channels || [];
    },

    async getThread(credentials, { channel, thread_ts }) {
      const data = await slackCall(credentials, 'conversations.replies', {
        channel,
        ts: thread_ts,
      });
      return data.messages || [];
    },
  },
};

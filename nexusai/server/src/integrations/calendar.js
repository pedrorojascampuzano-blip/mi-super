// Google Calendar integration - OAuth2 + REST API
import { getGoogleAccessToken, googleFetch } from './google-auth.js';

const BASE = 'https://www.googleapis.com/calendar/v3';

export default {
  name: 'calendar',
  requiredCredentials: ['refresh_token', 'client_id', 'client_secret'],

  async validate(credentials) {
    try {
      const token = await getGoogleAccessToken(credentials);
      await googleFetch(token, `${BASE}/calendars/primary`);
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

      // Time window: 30 days back to 30 days forward
      const now = Date.now();
      const timeMin = new Date(now - 30 * 24 * 3600 * 1000).toISOString();
      const timeMax = new Date(now + 30 * 24 * 3600 * 1000).toISOString();

      const url = `${BASE}/calendars/primary/events?` + new URLSearchParams({
        timeMin,
        timeMax,
        maxResults: '100',
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const data = await googleFetch(token, url);

      for (const event of data.items || []) {
        if (event.status === 'cancelled') continue;

        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;

        items.push({
          source: 'calendar',
          source_id: event.id,
          item_type: 'event',
          title: event.summary || '(no title)',
          body: event.description || null,
          metadata: {
            start,
            end,
            location: event.location,
            attendees: (event.attendees || []).map(a => a.email),
            hangoutLink: event.hangoutLink,
            htmlLink: event.htmlLink,
            status: event.status,
            organizer: event.organizer?.email,
          },
          source_timestamp: event.updated || start,
        });
      }
    } catch (err) {
      errors.push(`calendar sync: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async getUpcoming(credentials, { days = 7 } = {}) {
      const token = await getGoogleAccessToken(credentials);
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();

      const url = `${BASE}/calendars/primary/events?` + new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
      });

      const data = await googleFetch(token, url);
      return data.items || [];
    },
  },
};

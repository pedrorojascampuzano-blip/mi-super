// Notion integration - fetches pages/databases via API
const BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

async function notionFetch(credentials, path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${credentials.api_key}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API error ${res.status}: ${err.slice(0, 200)}`);
  }
  return res.json();
}

// Extract title text from a Notion page's properties
function extractTitle(page) {
  if (!page.properties) return 'Untitled';
  for (const prop of Object.values(page.properties)) {
    if (prop.type === 'title' && prop.title?.length > 0) {
      return prop.title.map(t => t.plain_text).join('');
    }
  }
  // Fallback for databases
  if (page.title?.length > 0) return page.title.map(t => t.plain_text).join('');
  return 'Untitled';
}

// Extract a status property if present
function extractStatus(page) {
  if (!page.properties) return null;
  for (const [name, prop] of Object.entries(page.properties)) {
    if (prop.type === 'status' && prop.status?.name) return prop.status.name;
    if (prop.type === 'select' && name.toLowerCase().includes('status')) return prop.select?.name;
  }
  return null;
}

function isTaskLike(page) {
  if (!page.properties) return false;
  return Object.values(page.properties).some(p =>
    p.type === 'status' || p.type === 'checkbox' ||
    (p.type === 'select' && p.select?.name)
  );
}

export default {
  name: 'notion',
  requiredCredentials: ['api_key'],

  async validate(credentials) {
    try {
      await notionFetch(credentials, '/users/me');
      return true;
    } catch {
      return false;
    }
  },

  async sync(credentials, lastSyncAt) {
    const items = [];
    const errors = [];
    let hasMore = true;
    let cursor = null;
    const maxPages = 5; // limit pagination

    try {
      for (let i = 0; i < maxPages && hasMore; i++) {
        const body = {
          page_size: 100,
          filter: { value: 'page', property: 'object' },
          sort: { timestamp: 'last_edited_time', direction: 'descending' },
        };
        if (cursor) body.start_cursor = cursor;

        const result = await notionFetch(credentials, '/search', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        for (const page of result.results || []) {
          // Skip if not newer than lastSyncAt (when pages already sorted desc)
          if (lastSyncAt && page.last_edited_time && page.last_edited_time < lastSyncAt) {
            hasMore = false;
            break;
          }

          items.push({
            source: 'notion',
            source_id: page.id,
            item_type: isTaskLike(page) ? 'task' : 'page',
            title: extractTitle(page),
            body: null,
            metadata: {
              url: page.url,
              status: extractStatus(page),
              parent_type: page.parent?.type,
              archived: page.archived,
            },
            source_timestamp: page.last_edited_time,
          });
        }

        hasMore = hasMore && result.has_more;
        cursor = result.next_cursor;
      }
    } catch (err) {
      errors.push(`notion sync: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async search(credentials, { query }) {
      const result = await notionFetch(credentials, '/search', {
        method: 'POST',
        body: JSON.stringify({ query, page_size: 20 }),
      });
      return result.results?.map(page => ({
        id: page.id,
        title: extractTitle(page),
        url: page.url,
      })) || [];
    },

    async getPage(credentials, { pageId }) {
      return notionFetch(credentials, `/pages/${pageId}`);
    },

    async updatePage(credentials, { pageId, properties }) {
      return notionFetch(credentials, `/pages/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
      });
    },

    async updateStatus(credentials, { source_id, status }) {
      // Get the page first to find the status property name
      const page = await notionFetch(credentials, `/pages/${source_id}`);
      const statusProp = Object.entries(page.properties || {})
        .find(([_, p]) => p.type === 'status');

      if (!statusProp) throw new Error('No status property on this Notion page');

      const [propName] = statusProp;
      return notionFetch(credentials, `/pages/${source_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          properties: { [propName]: { status: { name: status } } },
        }),
      });
    },
  },
};

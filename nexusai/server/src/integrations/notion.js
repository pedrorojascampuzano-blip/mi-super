// Notion integration - queries specific databases by ID, maps to proper item_types
const BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Database type → item_type mapping
const DB_TYPES = {
  tasks: 'task',
  projects: 'project',
  contacts: 'contact',
  organizations: 'organization',
  resources: 'resource',
};

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
    throw new Error(`Notion API ${res.status}: ${err.slice(0, 300)}`);
  }
  return res.json();
}

// Extract plain text from a Notion rich_text array
function richTextToString(richText) {
  if (!Array.isArray(richText)) return '';
  return richText.map(t => t.plain_text || '').join('');
}

// Extract the title property value regardless of its property name
function extractTitle(page) {
  if (!page.properties) return 'Untitled';
  for (const prop of Object.values(page.properties)) {
    if (prop.type === 'title') return richTextToString(prop.title) || 'Untitled';
  }
  return 'Untitled';
}

// Extract a property value by type
function extractProperty(prop) {
  if (!prop) return null;
  switch (prop.type) {
    case 'title': return richTextToString(prop.title);
    case 'rich_text': return richTextToString(prop.rich_text);
    case 'number': return prop.number;
    case 'select': return prop.select?.name || null;
    case 'multi_select': return (prop.multi_select || []).map(o => o.name);
    case 'status': return prop.status?.name || null;
    case 'date': return prop.date?.start || null;
    case 'checkbox': return !!prop.checkbox;
    case 'email': return prop.email || null;
    case 'phone_number': return prop.phone_number || null;
    case 'url': return prop.url || null;
    case 'people': return (prop.people || []).map(p => p.name || p.id);
    case 'relation': return (prop.relation || []).map(r => r.id);
    case 'files': return (prop.files || []).map(f => f.name);
    case 'created_time': return prop.created_time;
    case 'last_edited_time': return prop.last_edited_time;
    case 'formula':
      return prop.formula?.string ?? prop.formula?.number ?? prop.formula?.boolean ?? null;
    case 'rollup':
      return prop.rollup?.array?.map(extractProperty) || null;
    default: return null;
  }
}

// Build a flattened metadata object from all page properties
function flattenProperties(page) {
  const out = {};
  if (!page.properties) return out;
  for (const [name, prop] of Object.entries(page.properties)) {
    const value = extractProperty(prop);
    if (value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
      out[name.toLowerCase().replace(/\s+/g, '_')] = value;
    }
  }
  return out;
}

// Pick a body field based on common property names
function extractBody(page) {
  if (!page.properties) return null;
  const candidateNames = ['description', 'notes', 'summary', 'content', 'body', 'details'];
  for (const [name, prop] of Object.entries(page.properties)) {
    if (candidateNames.includes(name.toLowerCase()) && prop.type === 'rich_text') {
      const text = richTextToString(prop.rich_text);
      if (text) return text;
    }
  }
  return null;
}

// Query a specific database, returning all pages (paginated)
async function queryDatabase(credentials, databaseId, lastSyncAt) {
  const items = [];
  let cursor = null;
  const maxPages = 5;

  const filter = lastSyncAt
    ? { timestamp: 'last_edited_time', last_edited_time: { on_or_after: lastSyncAt } }
    : undefined;

  for (let i = 0; i < maxPages; i++) {
    const body = {
      page_size: 100,
      sorts: [{ timestamp: 'last_edited_time', direction: 'descending' }],
    };
    if (cursor) body.start_cursor = cursor;
    if (filter) body.filter = filter;

    const result = await notionFetch(credentials, `/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    items.push(...(result.results || []));
    if (!result.has_more) break;
    cursor = result.next_cursor;
  }

  return items;
}

// Build a NormalizedItem from a Notion page for a known DB type
function normalizePage(page, itemType, dbLabel) {
  const metadata = flattenProperties(page);
  metadata.url = page.url;
  metadata.db = dbLabel;
  metadata.archived = page.archived;

  // Elevate common fields for modules
  if (metadata.status) metadata.status = metadata.status;
  if (metadata.email) metadata.email = metadata.email;
  if (metadata.phone) metadata.phone = metadata.phone;

  return {
    source: 'notion',
    source_id: page.id,
    item_type: itemType,
    title: extractTitle(page),
    body: extractBody(page),
    metadata,
    source_timestamp: page.last_edited_time,
  };
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
    const dbs = credentials.databases || {};

    // Query each configured database
    for (const [dbKey, dbId] of Object.entries(dbs)) {
      if (!dbId) continue;
      const itemType = DB_TYPES[dbKey];
      if (!itemType) continue;

      try {
        const pages = await queryDatabase(credentials, dbId, lastSyncAt);
        for (const page of pages) {
          items.push(normalizePage(page, itemType, dbKey));
        }
      } catch (err) {
        errors.push(`notion ${dbKey}: ${err.message}`);
      }
    }

    // Fallback: also do a generic search for loose pages (not in known DBs)
    // Only if no DBs configured OR for extra coverage
    const configuredIds = new Set(Object.values(dbs).filter(Boolean));
    try {
      const body = {
        page_size: 50,
        filter: { value: 'page', property: 'object' },
        sort: { timestamp: 'last_edited_time', direction: 'descending' },
      };
      const result = await notionFetch(credentials, '/search', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      for (const page of result.results || []) {
        // Skip if already covered by a known DB query (check parent DB id)
        const parentDbId = page.parent?.database_id?.replace(/-/g, '');
        if (parentDbId && [...configuredIds].some(id => id.replace(/-/g, '') === parentDbId)) {
          continue;
        }
        if (lastSyncAt && page.last_edited_time < lastSyncAt) continue;
        items.push(normalizePage(page, 'page', 'search'));
      }
    } catch (err) {
      errors.push(`notion search: ${err.message}`);
    }

    return { items, errors };
  },

  actions: {
    async search(credentials, { query }) {
      const result = await notionFetch(credentials, '/search', {
        method: 'POST',
        body: JSON.stringify({ query, page_size: 20 }),
      });
      return (result.results || []).map(page => ({
        id: page.id,
        title: extractTitle(page),
        url: page.url,
      }));
    },

    async getPage(credentials, { pageId }) {
      return notionFetch(credentials, `/pages/${pageId}`);
    },

    async updateStatus(credentials, { source_id, status }) {
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

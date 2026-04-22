// Context engine - gathers relevant workspace context for AI chat
import { getAdminClient } from './supabase.js';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
  'her', 'was', 'one', 'our', 'out', 'this', 'that', 'with', 'have',
  'from', 'they', 'been', 'said', 'each', 'which', 'their', 'will',
  'other', 'about', 'many', 'then', 'them', 'these', 'some', 'would',
  'make', 'like', 'just', 'over', 'such', 'more', 'also', 'back', 'could',
  'into', 'than', 'only', 'come', 'made', 'after', 'being', 'here',
  'should', 'where', 'when', 'what', 'does', 'very', 'your', 'does',
  'how', 'why', 'who', 'get', 'got', 'any', 'now', 'new', 'its', 'let',
]);

function extractKeywords(text) {
  if (!text) return [];
  return [...new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w))
  )].slice(0, 5);
}

function formatContextLog(entries) {
  if (!entries?.length) return '(no recent activity)';
  const lines = entries.slice(0, 30).map(e => {
    const when = new Date(e.created_at).toLocaleString();
    return `- [${when}] ${e.summary}`;
  });
  let text = lines.join('\n');
  if (text.length > 2000) text = text.slice(0, 2000) + '\n...(truncated)';
  return text;
}

function formatItems(items) {
  if (!items?.length) return '(no matching items)';
  const lines = items.slice(0, 20).map(i => {
    const body = i.body ? ` — ${i.body.slice(0, 100)}` : '';
    const status = i.metadata?.status ? ` [${i.metadata.status}]` : '';
    return `- [${i.source}/${i.item_type}]${status} ${i.title || '(untitled)'}${body}`;
  });
  let text = lines.join('\n');
  if (text.length > 3000) text = text.slice(0, 3000) + '\n...(truncated)';
  return text;
}

export async function buildContext(userId, messages) {
  const sb = getAdminClient();
  const lastUserMessage = messages?.[messages.length - 1]?.content || '';

  // 1. Fetch recent context log
  const { data: contextLog } = await sb
    .from('context_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  // 2. Extract keywords from latest message
  const keywords = extractKeywords(lastUserMessage);

  // 3. Find relevant cached items
  let relevantItems = [];
  if (keywords.length > 0) {
    const orFilters = keywords.flatMap(k => [`title.ilike.%${k}%`, `body.ilike.%${k}%`]).join(',');
    const { data: items } = await sb
      .from('cached_items')
      .select('*')
      .eq('user_id', userId)
      .or(orFilters)
      .order('source_timestamp', { ascending: false })
      .limit(20);
    relevantItems = items || [];
  }

  // If nothing matched, fall back to most recent items
  if (relevantItems.length === 0) {
    const { data: items } = await sb
      .from('cached_items')
      .select('*')
      .eq('user_id', userId)
      .order('source_timestamp', { ascending: false })
      .limit(15);
    relevantItems = items || [];
  }

  // 4. Build system prompt
  const systemPrompt = `You are NexusAI, a productivity assistant integrated into the user's workspace. You have access to their recent activity across Notion, Gmail, Slack, Linear, Google Calendar, and WhatsApp.

Current date: ${new Date().toISOString().slice(0, 10)}

Recent activity log:
${formatContextLog(contextLog)}

Relevant items from workspace:
${formatItems(relevantItems)}

Be concise and actionable. When referencing specific items, mention their source (e.g. "from Linear" or "in Notion"). If asked about things you don't have context for, say so rather than guessing. Help the user be productive.`;

  return {
    systemPrompt,
    contextItems: relevantItems,
  };
}

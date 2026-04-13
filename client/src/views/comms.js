// Comms module - threaded messages across Gmail + Slack + WhatsApp
import { h, mount } from '../lib/dom.js';
import { post } from '../lib/api.js';
import { getItems } from '../lib/cache.js';
import { fetchItems, syncService } from '../lib/sync.js';
import { errorBanner } from '../lib/ui.js';

const SOURCE_COLORS = {
  gmail: '#EA4335',
  slack: '#4A154B',
  whatsapp: '#25D366',
};

function relativeTime(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}

function threadKey(msg) {
  return msg.metadata?.threadId || msg.metadata?.thread_ts || msg.source_id;
}

export function render(container, _context) {
  let messages = [];
  let selectedThread = null;
  let filter = 'all';
  let loading = true;
  let syncing = false;
  let syncErrors = [];
  let replyText = '';

  async function loadMessages() {
    const cached = await getItems({ type: 'message', limit: 200 });
    messages = cached;
    draw();

    try {
      messages = await fetchItems({ type: 'message', limit: 200 });
    } catch { /* keep cached */ }

    loading = false;
    draw();
  }

  async function handleSync() {
    if (syncing) return;
    syncing = true;
    syncErrors = [];
    draw();
    for (const service of ['gmail', 'slack', 'whatsapp']) {
      try {
        const res = await syncService(service);
        if (res.errors?.length) {
          syncErrors.push(...res.errors.map(e => `${service}: ${e}`));
        }
      } catch (err) {
        syncErrors.push(`${service}: ${err.message}`);
      }
    }
    await loadMessages();
    syncing = false;
    draw();
  }

  function filteredMessages() {
    if (filter === 'all') return messages;
    return messages.filter(m => m.source === filter);
  }

  function groupedByThread() {
    const map = new Map();
    for (const msg of filteredMessages()) {
      const key = threadKey(msg);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(msg);
    }
    // Sort threads by most recent message
    return Array.from(map.entries())
      .map(([key, msgs]) => ({
        key,
        messages: msgs.sort((a, b) => (a.source_timestamp || '').localeCompare(b.source_timestamp || '')),
        source: msgs[0].source,
        latest: msgs[msgs.length - 1],
      }))
      .sort((a, b) => (b.latest.source_timestamp || '').localeCompare(a.latest.source_timestamp || ''));
  }

  async function handleReply(thread) {
    if (!replyText.trim()) return;
    const msg = thread.latest;
    const source = thread.source;

    try {
      if (source === 'gmail') {
        const to = (msg.metadata?.from || '').match(/<([^>]+)>/)?.[1] || msg.metadata?.from;
        const subject = msg.title.startsWith('Re:') ? msg.title : `Re: ${msg.title}`;
        await post('/actions/gmail/send', { to, subject, body: replyText, replyToThreadId: msg.metadata?.threadId });
      } else if (source === 'slack') {
        await post('/actions/slack/sendMessage', {
          channel: msg.metadata?.channel,
          text: replyText,
          thread_ts: msg.metadata?.thread_ts || msg.metadata?.ts,
        });
      } else if (source === 'whatsapp') {
        await post('/actions/whatsapp/sendMessage', {
          to: msg.metadata?.from,
          text: replyText,
        });
      }
      replyText = '';
      alert('Reply sent');
      await loadMessages();
    } catch (err) {
      alert(`Failed to send: ${err.message}`);
    }
  }

  function draw() {
    const threads = groupedByThread();

    const content = h('div', { class: 'comms-layout' }, [
      // Thread list
      h('div', { class: 'thread-list flex-col' }, [
        h('div', { class: 'flex items-center justify-between p-3', style: { borderBottom: '1px solid var(--border)' } }, [
          h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, 'Messages'),
          h('button', {
            class: 'btn btn-primary btn-sm',
            onClick: handleSync,
            disabled: syncing ? 'true' : undefined,
          }, syncing ? '...' : 'Sync'),
        ]),
        h('div', { class: 'filter-tabs p-2', style: { borderBottom: '1px solid var(--border)' } }, [
          filterTab('all', 'All'),
          filterTab('gmail', 'Gmail'),
          filterTab('slack', 'Slack'),
          filterTab('whatsapp', 'WhatsApp'),
        ]),
        errorBanner(syncErrors),
        h('div', { style: { flex: '1', overflowY: 'auto' } },
          loading
            ? h('div', { class: 'p-4 text-sm text-muted' }, 'Loading...')
            : threads.length === 0
              ? h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } }, 'No messages')
              : threads.map(renderThreadItem)
        ),
      ]),
      // Thread detail
      h('div', { class: 'thread-detail' }, selectedThread ? renderThreadDetail(selectedThread) : [
        h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center', marginTop: '40%' } },
          'Select a conversation'),
      ]),
    ]);

    mount(container, content);
  }

  function filterTab(id, label) {
    return h('button', {
      class: `filter-tab${filter === id ? ' active' : ''}`,
      onClick: () => { filter = id; draw(); },
    }, label);
  }

  function renderThreadItem(thread) {
    const isActive = selectedThread?.key === thread.key;
    const latest = thread.latest;
    const sender = (latest.metadata?.from || '').replace(/<.+>/, '').trim() || latest.title;

    return h('div', {
      class: `thread-item${isActive ? ' active' : ''}`,
      onClick: () => {
        selectedThread = thread;
        draw();
      },
    }, [
      h('div', { class: 'flex items-center gap-2', style: { marginBottom: '2px' } }, [
        h('div', {
          style: {
            width: '6px', height: '6px', borderRadius: '50%',
            background: SOURCE_COLORS[thread.source] || 'var(--text-muted)',
          },
        }),
        h('div', { class: 'truncate', style: { fontWeight: '500', fontSize: '0.8rem', flex: '1' } }, sender),
        h('span', { class: 'text-xs text-muted' }, relativeTime(latest.source_timestamp)),
      ]),
      h('div', { class: 'truncate text-xs text-secondary' }, (latest.body || latest.title || '').slice(0, 80)),
    ]);
  }

  function renderThreadDetail(thread) {
    return [
      h('div', { class: 'p-3', style: { borderBottom: '1px solid var(--border)' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, thread.latest.title || 'Conversation'),
        h('div', { class: 'text-xs text-muted' }, `${thread.messages.length} message${thread.messages.length !== 1 ? 's' : ''} · ${thread.source}`),
      ]),
      h('div', { class: 'message-list' },
        thread.messages.map(msg =>
          h('div', { class: 'message-bubble' }, [
            h('div', { class: 'flex items-center gap-2', style: { marginBottom: '4px' } }, [
              h('span', { style: { fontSize: '0.75rem', fontWeight: '600' } },
                (msg.metadata?.from || msg.metadata?.user || 'Unknown').replace(/<.+>/, '').trim()),
              h('span', { class: 'text-xs text-muted' }, relativeTime(msg.source_timestamp)),
            ]),
            h('div', { class: 'text-sm', style: { whiteSpace: 'pre-wrap' } }, msg.body || ''),
          ])
        )
      ),
      h('div', { class: 'reply-box' }, [
        h('textarea', {
          class: 'input',
          style: { resize: 'none', minHeight: '60px' },
          placeholder: 'Type a reply...',
          value: replyText,
          onInput: (e) => { replyText = e.target.value; },
        }),
        h('button', {
          class: 'btn btn-primary btn-sm',
          onClick: () => handleReply(thread),
        }, 'Send'),
      ]),
    ];
  }

  loadMessages();
}

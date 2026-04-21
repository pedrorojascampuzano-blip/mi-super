// AI Chat module - workspace-aware conversation with AI
import { h, mount } from '../lib/dom.js';
import { get, post } from '../lib/api.js';

// Simple markdown rendering (bold, code, inline code, newlines, lists)
function simpleMarkdown(text) {
  if (!text) return '';
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (```...```)
  html = html.replace(/```([\s\S]*?)```/g, (_, code) =>
    `<pre><code>${code.trim()}</code></pre>`
  );

  // Inline code (`...`)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold (**...**)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic (*...*)
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');

  // Unordered lists (- item or * item)
  const lines = html.split('\n');
  const out = [];
  let inList = false;
  for (const line of lines) {
    if (/^[-*] /.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${line.slice(2)}</li>`);
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      out.push(line);
    }
  }
  if (inList) out.push('</ul>');
  html = out.join('\n');

  // Newlines -> <br> (but not inside pre/ul)
  html = html.replace(/\n(?![<])/g, '<br>');

  return html;
}

export function render(container, _context) {
  let messages = []; // { role, content, contextItems? }
  let input = '';
  let loading = false;
  let providers = [];
  let selectedProvider = null;

  async function loadProviders() {
    try {
      providers = await get('/ai/providers');
      const connected = providers.find(p => p.connected);
      if (connected) selectedProvider = connected.name;
    } catch {
      providers = [];
    }
    draw();
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    messages.push({ role: 'user', content: text });
    input = '';
    loading = true;
    draw();

    try {
      const payload = {
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        provider: selectedProvider,
      };
      const res = await post('/ai/chat', payload);
      messages.push({
        role: 'assistant',
        content: res.content,
        contextItems: res.contextItems || [],
      });
    } catch (err) {
      messages.push({
        role: 'assistant',
        content: `Error: ${err.message}`,
        contextItems: [],
      });
    }

    loading = false;
    draw();

    // Auto-scroll to bottom
    setTimeout(() => {
      const messagesEl = container.querySelector('.chat-messages');
      if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }, 50);
  }

  function draw() {
    const connectedProviders = providers.filter(p => p.connected);

    const content = h('div', { class: 'flex-col', style: { height: '100%', display: 'flex', minHeight: '0' } }, [
      // Header
      h('div', { class: 'flex items-center justify-between p-3', style: { borderBottom: '1px solid var(--border)', flexShrink: '0' } }, [
        h('div', { style: { fontWeight: '600', fontSize: '0.9rem' } }, 'AI Chat'),
        connectedProviders.length > 0
          ? h('select', {
              class: 'input',
              style: { width: 'auto', padding: '4px 8px', fontSize: '0.75rem' },
              onChange: (e) => { selectedProvider = e.target.value; },
            }, connectedProviders.map(p =>
              h('option', { value: p.name, selected: p.name === selectedProvider ? 'true' : undefined }, p.name)
            ))
          : h('span', { class: 'text-xs text-muted' }, 'No AI connected'),
      ]),

      // Message area
      h('div', { class: 'chat-messages' },
        connectedProviders.length === 0
          ? [h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } },
              'Connect DeepSeek, Gemini, or Mistral in Accounts to start chatting.')]
          : messages.length === 0
            ? [h('div', { class: 'p-4 text-sm text-muted', style: { textAlign: 'center' } },
                'Ask about your tasks, messages, or schedule. I have access to your workspace.')]
            : [
                ...messages.map(renderMessage),
                loading ? h('div', { class: 'chat-bubble assistant' }, [
                  h('div', { class: 'chat-loading' }, [
                    h('span', {}), h('span', {}), h('span', {}),
                  ]),
                ]) : null,
              ]
      ),

      // Input area
      h('div', { class: 'chat-input-area' }, [
        h('textarea', {
          class: 'chat-textarea',
          placeholder: 'Ask anything about your workspace... (Enter to send, Shift+Enter for newline)',
          value: input,
          rows: '1',
          disabled: connectedProviders.length === 0 ? 'true' : undefined,
          onInput: (e) => {
            input = e.target.value;
            // Auto-resize
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          },
          onKeydown: (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          },
        }),
        h('button', {
          class: 'btn btn-primary btn-sm',
          onClick: sendMessage,
          disabled: (loading || connectedProviders.length === 0) ? 'true' : undefined,
        }, 'Send'),
      ]),
    ]);

    mount(container, content);

    // Focus textarea
    const ta = container.querySelector('.chat-textarea');
    if (ta && !loading) ta.focus();
  }

  function renderMessage(msg) {
    const bubble = h('div', { class: `chat-bubble ${msg.role}` });
    bubble.innerHTML = simpleMarkdown(msg.content);

    const wrapper = h('div', { class: 'flex-col', style: { display: 'flex', maxWidth: '85%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' } }, [
      bubble,
      msg.contextItems?.length > 0
        ? h('div', { class: 'chat-context-badge' }, `Used ${msg.contextItems.length} workspace item${msg.contextItems.length !== 1 ? 's' : ''}`)
        : null,
    ]);

    return wrapper;
  }

  loadProviders();
}

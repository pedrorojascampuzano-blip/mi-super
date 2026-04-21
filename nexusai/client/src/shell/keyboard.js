// Centralized keyboard shortcut manager
import { bus } from '../lib/events.js';

export function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    // Cmd+1..9 - focus Nth panel
    if (e.key >= '1' && e.key <= '9' && !e.shiftKey) {
      e.preventDefault();
      bus.emit('panel:focus', parseInt(e.key, 10) - 1);
      return;
    }

    // Cmd+N / Cmd+Shift+N - split horizontal / vertical
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      bus.emit('panel:split', e.shiftKey ? 'vertical' : 'horizontal');
      return;
    }

    // Cmd+W - close active panel
    if (e.key === 'w' || e.key === 'W') {
      e.preventDefault();
      bus.emit('panel:close-active');
      return;
    }

    // Cmd+E - quick AI
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
      bus.emit('navigate', 'ai-chat');
      return;
    }

    // Cmd+Shift+F - flow mode
    if ((e.key === 'f' || e.key === 'F') && e.shiftKey) {
      e.preventDefault();
      bus.emit('navigate', 'flow');
      return;
    }
  });
}

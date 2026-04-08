// Panel manager: renders the tree layout to DOM and handles interactions
import { h } from '../lib/dom.js';
import { bus } from '../lib/events.js';
import { renderModule, getRegisteredModules } from './panel-registry.js';
import * as tree from './panel-tree.js';

let layout = null;
let container = null;

export function initPanelManager(el, savedLayout) {
  container = el;
  layout = savedLayout ? tree.deserialize(savedLayout) : tree.defaultLayout();
  render();
}

export function getLayout() {
  return tree.serialize(layout);
}

function render() {
  container.innerHTML = '';
  container.appendChild(renderNode(layout));
  bus.emit('layout:changed', tree.serialize(layout));
}

function renderNode(node) {
  if (!node) return h('div', {});

  if (node.type === 'panel') {
    return renderPanel(node);
  }

  if (node.type === 'split') {
    const leftEl = renderNode(node.left);
    const rightEl = renderNode(node.right);

    // Calculate flex values based on ratio and collapse state
    const leftCollapsed = node.left?.type === 'panel' && node.left.collapsed;
    const rightCollapsed = node.right?.type === 'panel' && node.right.collapsed;

    if (!leftCollapsed) leftEl.style.flex = `${node.ratio}`;
    if (!rightCollapsed) rightEl.style.flex = `${1 - node.ratio}`;

    const handle = h('div', { class: 'split-handle' });
    initResize(handle, node);

    return h('div', { class: `split ${node.direction}` }, [leftEl, handle, rightEl]);
  }

  return h('div', {});
}

function renderPanel(panel) {
  const contentEl = h('div', { class: 'panel-content' });
  const moduleLabel = panel.module.charAt(0).toUpperCase() + panel.module.slice(1);

  const panelEl = h('div', {
    class: `panel${panel.collapsed ? ' collapsed' : ''}`,
    dataset: { panelId: panel.id },
  }, [
    h('div', { class: 'panel-header', onClick: () => handleHeaderClick(panel) }, [
      h('div', { class: 'panel-title' }, moduleLabel),
      panel.collapsed ? null : h('div', { class: 'flex gap-1' }, [
        h('button', { class: 'btn btn-ghost btn-sm', onClick: (e) => { e.stopPropagation(); showModulePicker(panel.id); }, title: 'Switch module' }, '~'),
        h('button', { class: 'btn btn-ghost btn-sm', onClick: (e) => { e.stopPropagation(); handleSplit(panel.id, 'horizontal'); }, title: 'Split horizontal' }, '|'),
        h('button', { class: 'btn btn-ghost btn-sm', onClick: (e) => { e.stopPropagation(); handleSplit(panel.id, 'vertical'); }, title: 'Split vertical' }, '—'),
        h('button', { class: 'btn btn-ghost btn-sm', onClick: (e) => { e.stopPropagation(); handleClose(panel.id); }, title: 'Close' }, '×'),
      ]),
    ]),
    contentEl,
  ]);

  // Render module content (async)
  if (!panel.collapsed) {
    renderModule(panel.module, contentEl, { panelId: panel.id });
  }

  return panelEl;
}

function handleHeaderClick(panel) {
  layout = tree.toggleCollapse(layout, panel.id);
  render();
}

function handleSplit(panelId, direction) {
  layout = tree.splitPanel(layout, panelId, direction, 'empty');
  render();
}

function handleClose(panelId) {
  layout = tree.closePanel(layout, panelId);
  if (!layout) layout = tree.createPanel('dashboard');
  render();
}

function showModulePicker(panelId) {
  const modules = getRegisteredModules();
  const overlay = h('div', { class: 'modal-overlay', onClick: (e) => { if (e.target === overlay) overlay.remove(); } }, [
    h('div', { class: 'modal' }, [
      h('div', { class: 'modal-header' }, 'Select Module'),
      h('div', { style: { padding: '8px' } },
        modules.map(mod =>
          h('div', {
            class: 'btn-ghost',
            style: { padding: '10px 16px', cursor: 'pointer', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' },
            onClick: () => {
              layout = tree.setModule(layout, panelId, mod);
              overlay.remove();
              render();
            },
          }, mod.charAt(0).toUpperCase() + mod.slice(1))
        )
      ),
    ]),
  ]);
  document.body.appendChild(overlay);
}

function initResize(handle, splitNode) {
  let startPos = 0;
  let startRatio = 0;
  let parentSize = 0;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const isHorizontal = splitNode.direction === 'horizontal';
    startPos = isHorizontal ? e.clientX : e.clientY;
    startRatio = splitNode.ratio;
    parentSize = isHorizontal ? handle.parentElement.offsetWidth : handle.parentElement.offsetHeight;

    function onMove(e) {
      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = (currentPos - startPos) / parentSize;
      splitNode.ratio = Math.max(0.15, Math.min(0.85, startRatio + delta));
      render();
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

// Listen for navigation events
bus.on('navigate', (module) => {
  // Find first non-collapsed panel and switch its module
  function findFirst(node) {
    if (!node) return null;
    if (node.type === 'panel' && !node.collapsed) return node.id;
    if (node.type === 'split') return findFirst(node.left) || findFirst(node.right);
    return null;
  }
  const panelId = findFirst(layout);
  if (panelId) {
    layout = tree.setModule(layout, panelId, module);
    render();
  }
});

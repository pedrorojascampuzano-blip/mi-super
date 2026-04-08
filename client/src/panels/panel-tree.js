// Binary tree data structure for the tiling panel layout
// Each node is either a 'panel' (leaf) or a 'split' (internal node)

let nextId = 1;

export function createPanel(module = 'empty') {
  return { type: 'panel', id: `p${nextId++}`, module, collapsed: false };
}

export function createSplit(direction, left, right, ratio = 0.5) {
  return { type: 'split', direction, left, right, ratio };
}

export function defaultLayout() {
  return createSplit('horizontal',
    createPanel('dashboard'),
    createPanel('vault')
  );
}

// Find a panel by id in the tree
export function findPanel(tree, id) {
  if (!tree) return null;
  if (tree.type === 'panel') return tree.id === id ? tree : null;
  return findPanel(tree.left, id) || findPanel(tree.right, id);
}

// Toggle collapsed state
export function toggleCollapse(tree, id) {
  const panel = findPanel(tree, id);
  if (panel) panel.collapsed = !panel.collapsed;
  return tree;
}

// Change module in a panel
export function setModule(tree, id, module) {
  const panel = findPanel(tree, id);
  if (panel) panel.module = module;
  return tree;
}

// Split a panel into two
export function splitPanel(tree, id, direction, newModule = 'empty') {
  if (!tree) return tree;
  if (tree.type === 'panel' && tree.id === id) {
    return createSplit(direction, tree, createPanel(newModule));
  }
  if (tree.type === 'split') {
    tree.left = splitPanel(tree.left, id, direction, newModule);
    tree.right = splitPanel(tree.right, id, direction, newModule);
  }
  return tree;
}

// Close a panel, promoting its sibling
export function closePanel(tree, id) {
  if (!tree || tree.type === 'panel') return tree;
  if (tree.type === 'split') {
    if (tree.left?.type === 'panel' && tree.left.id === id) return tree.right;
    if (tree.right?.type === 'panel' && tree.right.id === id) return tree.left;
    tree.left = closePanel(tree.left, id);
    tree.right = closePanel(tree.right, id);
  }
  return tree;
}

// Serialize/deserialize for persistence
export function serialize(tree) {
  return JSON.stringify(tree);
}

export function deserialize(json) {
  try {
    const tree = JSON.parse(json);
    // Update nextId to avoid collisions
    const ids = [];
    function collectIds(node) {
      if (!node) return;
      if (node.type === 'panel') ids.push(parseInt(node.id.slice(1)) || 0);
      if (node.type === 'split') { collectIds(node.left); collectIds(node.right); }
    }
    collectIds(tree);
    nextId = Math.max(...ids, 0) + 1;
    return tree;
  } catch {
    return defaultLayout();
  }
}

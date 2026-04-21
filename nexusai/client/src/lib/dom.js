// Minimal DOM helper - hyperscript-style element creation
export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === 'class') el.className = val;
    else if (key === 'style' && typeof val === 'object') Object.assign(el.style, val);
    else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
    else if (key === 'dataset') Object.assign(el.dataset, val);
    else el.setAttribute(key, val);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const child of kids) {
    if (child == null || child === false) continue;
    el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return el;
}

export function mount(parent, child) {
  if (typeof parent === 'string') parent = document.querySelector(parent);
  parent.innerHTML = '';
  parent.appendChild(child);
  return child;
}

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

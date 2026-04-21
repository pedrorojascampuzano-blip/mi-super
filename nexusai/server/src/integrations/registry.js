// Central registry for integration plugins
import { validatePlugin } from './_base.js';

const plugins = {};

export function registerPlugin(plugin) {
  validatePlugin(plugin);
  plugins[plugin.name] = plugin;
}

export function getPlugin(name) {
  return plugins[name] || null;
}

export function getRegisteredPlugins() {
  return Object.keys(plugins);
}

// Eagerly load all known plugins - guard each to prevent startup crashes
const pluginModules = [
  () => import('./notion.js'),
  () => import('./gmail.js'),
  () => import('./slack.js'),
  () => import('./linear.js'),
  () => import('./calendar.js'),
  () => import('./whatsapp.js'),
];

for (const loader of pluginModules) {
  try {
    const mod = await loader();
    if (mod.default) registerPlugin(mod.default);
  } catch (err) {
    console.warn(`[registry] Failed to load plugin: ${err.message}`);
  }
}

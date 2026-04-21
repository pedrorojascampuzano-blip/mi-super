// Client-side sync orchestrator - calls server, caches to IndexedDB
import { post, get } from './api.js';
import { putItems, setLastSyncTime } from './cache.js';
import { bus } from './events.js';

export async function syncService(service) {
  bus.emit('sync:start', { service });
  try {
    const res = await post(`/sync/${service}`);
    // Server returns items with DB-generated ids, cache them
    if (res.items?.length) {
      await putItems(res.items);
    }
    await setLastSyncTime(service, new Date().toISOString());
    bus.emit('sync:complete', { service, count: res.items_synced, errors: res.errors });
    return res;
  } catch (err) {
    bus.emit('sync:error', { service, error: err.message });
    throw err;
  }
}

export async function syncAll(services) {
  const results = {};
  for (const service of services) {
    try {
      results[service] = await syncService(service);
    } catch (err) {
      results[service] = { error: err.message };
    }
  }
  bus.emit('sync:all-complete', results);
  return results;
}

// Fetch from server, update local cache, return items
export async function fetchItems(params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null) qs.set(k, String(v));
  }
  const query = qs.toString();
  const res = await get(`/items${query ? `?${query}` : ''}`);
  if (res.items?.length) {
    await putItems(res.items);
  }
  return res.items || [];
}

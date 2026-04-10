// IndexedDB wrapper for offline/fast access to cached items
const DB_NAME = 'nexusai';
const DB_VERSION = 1;
const ITEMS_STORE = 'items';
const META_STORE = 'sync_meta';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(ITEMS_STORE)) {
        const store = db.createObjectStore(ITEMS_STORE, { keyPath: 'id' });
        store.createIndex('item_type', 'item_type', { unique: false });
        store.createIndex('source', 'source', { unique: false });
        store.createIndex('source_timestamp', 'source_timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'source' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return dbPromise;
}

async function tx(storeName, mode = 'readonly') {
  const db = await openDB();
  return db.transaction(storeName, mode).objectStore(storeName);
}

export async function putItems(items) {
  if (!items?.length) return;
  const db = await openDB();
  const transaction = db.transaction(ITEMS_STORE, 'readwrite');
  const store = transaction.objectStore(ITEMS_STORE);
  for (const item of items) {
    if (item?.id) store.put(item);
  }
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getItems({ type, source, limit = 100, offset = 0 } = {}) {
  const store = await tx(ITEMS_STORE);
  return new Promise((resolve, reject) => {
    const results = [];
    let skipped = 0;

    // Use index if we can
    let source_cursor;
    if (type) {
      source_cursor = store.index('item_type').openCursor(IDBKeyRange.only(type), 'prev');
    } else {
      source_cursor = store.openCursor(null, 'prev');
    }

    source_cursor.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor || results.length >= limit) {
        // Sort by source_timestamp desc
        results.sort((a, b) => (b.source_timestamp || '').localeCompare(a.source_timestamp || ''));
        resolve(results);
        return;
      }
      const item = cursor.value;
      if (source && item.source !== source) {
        cursor.continue();
        return;
      }
      if (skipped < offset) {
        skipped++;
      } else {
        results.push(item);
      }
      cursor.continue();
    };
    source_cursor.onerror = () => reject(source_cursor.error);
  });
}

export async function getItemById(id) {
  const store = await tx(ITEMS_STORE);
  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearItems(source = null) {
  const db = await openDB();
  const transaction = db.transaction(ITEMS_STORE, 'readwrite');
  const store = transaction.objectStore(ITEMS_STORE);

  if (!source) {
    store.clear();
  } else {
    const index = store.index('source');
    const req = index.openCursor(IDBKeyRange.only(source));
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getLastSyncTime(source) {
  const store = await tx(META_STORE);
  return new Promise((resolve, reject) => {
    const req = store.get(source);
    req.onsuccess = () => resolve(req.result?.synced_at || null);
    req.onerror = () => reject(req.error);
  });
}

export async function setLastSyncTime(source, time) {
  const store = await tx(META_STORE, 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put({ source, synced_at: time });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

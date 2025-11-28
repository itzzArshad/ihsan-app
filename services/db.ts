
import { ContentItem } from '../types';

const DB_NAME = 'IhsanDB';
const DB_VERSION = 2; // Incremented version due to schema change
const STORES = {
  FAVORITES: 'favorites',
  HISTORY: 'history',
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
        db.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        db.createObjectStore(STORES.HISTORY, { keyPath: 'id' });
      }
      // Note: We don't delete old stores automatically to prevent data loss in production, 
      // but new logic won't use my_duas
    };
  });
};

// Generic Helper
const performTransaction = async (
  storeName: string, 
  mode: IDBTransactionMode, 
  callback: (store: IDBObjectStore) => IDBRequest | void
): Promise<any> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = callback(store);

    transaction.oncomplete = () => resolve(request ? (request as IDBRequest).result : undefined);
    transaction.onerror = () => reject(transaction.error);
  });
};

export const dbService = {
  // --- FAVORITES ---
  addFavorite: (item: ContentItem) => performTransaction(STORES.FAVORITES, 'readwrite', (store) => store.put(item)),
  removeFavorite: (id: string) => performTransaction(STORES.FAVORITES, 'readwrite', (store) => store.delete(id)),
  getFavorites: () => performTransaction(STORES.FAVORITES, 'readonly', (store) => store.getAll()),
  isFavorite: async (id: string): Promise<boolean> => {
    const item = await performTransaction(STORES.FAVORITES, 'readonly', (store) => store.get(id));
    return !!item;
  },

  // --- HISTORY ---
  addToHistory: (item: ContentItem) => performTransaction(STORES.HISTORY, 'readwrite', (store) => {
    // We only keep last 50 items to save space
    return store.put({ ...item, viewedAt: Date.now() });
  }),
  getHistory: () => performTransaction(STORES.HISTORY, 'readonly', (store) => store.getAll()),
};

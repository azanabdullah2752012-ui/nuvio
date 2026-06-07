import { supabase } from '../lib/supabase';
import { authService } from './authService';
const DB_KEY = 'acadevance_local_db';
let isCloudActive = false;

// Safari-safe UUID generator — crypto.randomUUID() requires HTTPS in Safari,
// so we fall back to a Math.random polyfill on plain http://localhost
const generateUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {
    // Safari throws SecurityError on http:// — fall through to polyfill
  }
  // RFC 4122 v4 UUID polyfill
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    isCloudActive = !error;
    window.dispatchEvent(new CustomEvent('acadevance_cloud_status', { detail: { active: isCloudActive } }));
  } catch (e) {
    isCloudActive = false;
    window.dispatchEvent(new CustomEvent('acadevance_cloud_status', { detail: { active: false } }));
  }
};

// Initial Heartbeat
checkConnection();
setInterval(checkConnection, 30000); // Check every 30s

const getLocalDB = () => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      const initial = {
        tasks: [],
        decks: [],
        messages: [],
        inventory: [],
        stats: { xp: 0, level: 1, tokens: 0 }
      };
      localStorage.setItem(DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch (e) {
    console.warn("Malformed local DB in localStorage, resetting:", e);
    const initial = {
      tasks: [],
      decks: [],
      messages: [],
      inventory: [],
      stats: { xp: 0, level: 1, tokens: 0 }
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
};

const saveLocalDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: authService.me() }));
};

export const dataService = {
  list: async (table) => {
    try {
      const { data: cloudData, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      const localDB = getLocalDB();
      const localData = localDB[table] || [];

      // Smart Merge: Keep local items that haven't been synced to cloud yet
      // We identify them by checking if their ID exists in the cloud data
      const cloudIds = new Set(cloudData.map(item => item.id));
      const localOnly = localData.filter(item => !cloudIds.has(item.id));
      
      const merged = [...cloudData, ...localOnly];
      
      localDB[table] = merged;
      saveLocalDB(localDB);
      
      return merged;
    } catch (err) {
      console.warn(`Cloud list failed for ${table}, using local engine.`);
      const db = getLocalDB();
      return db[table] || [];
    }
  },

  create: async (table, item) => {
    const user = authService.me();
    if (!user?.id) throw new Error("User session not verified. Cannot persist to cloud.");

    const newItem = {
      ...item,
      id: item.id || generateUUID(),
      created_at: new Date().toISOString(),
      user_id: user.id
    };

    // Optimistic Local Save
    const db = getLocalDB();
    if (!db[table]) db[table] = [];
    db[table].unshift(newItem);
    saveLocalDB(db);

    try {
      const { data, error } = await supabase.from(table).insert([newItem]).select();
      if (error) throw error;
      return data[0] || newItem;
    } catch (err) {
      console.warn(`Cloud create failed for ${table}, persisting locally.`);
      return newItem;
    }
  },

  update: async (table, id, updates) => {
    // Optimistic Local Update
    const db = getLocalDB();
    if (db[table]) {
      db[table] = db[table].map(item => item.id === id ? { ...item, ...updates } : item);
      saveLocalDB(db);
    }

    try {
      const { data, error } = await supabase.from(table).update(updates).eq('id', id).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.warn(`Cloud update failed for ${table}, persisting locally.`);
      return { id, ...updates };
    }
  },

  delete: async (table, id) => {
    // Optimistic Local Delete
    const db = getLocalDB();
    if (db[table]) {
      db[table] = db[table].filter(item => item.id !== id);
      saveLocalDB(db);
    }

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn(`Cloud delete failed for ${table}, persisting locally.`);
      return true;
    }
  }
};

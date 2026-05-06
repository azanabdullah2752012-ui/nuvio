import { supabase } from '../lib/supabase';
import { authService } from './authService';

let isCloudActive = false;
const DB_KEY = 'nuvio_local_db';

const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    isCloudActive = !error;
    window.dispatchEvent(new CustomEvent('nuvio_cloud_status', { detail: { active: isCloudActive } }));
  } catch (e) {
    isCloudActive = false;
    window.dispatchEvent(new CustomEvent('nuvio_cloud_status', { detail: { active: false } }));
  }
};

// Initial Heartbeat
checkConnection();
setInterval(checkConnection, 30000); // Check every 30s

const getLocalDB = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const initial = {
      tasks: [],
      decks: [],
      messages: [
        { id: 'm1', from: 'Nova', content: 'Welcome to your neural workspace. I am ready to assist.', time: 'Just now' }
      ],
      inventory: [],
      stats: { xp: 0, level: 1, tokens: 0 }
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveLocalDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  // Emit event to update all components
  window.dispatchEvent(new CustomEvent('nuvio_stats_update', { detail: authService.me() }));
};

export const dataService = {
  list: async (table) => {
    try {
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn(`Local Engine: Fetching ${table}`);
      const db = getLocalDB();
      return db[table] || [];
    }
  },

  create: async (table, item) => {
    const newItem = {
      ...item,
      id: item.id || Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      user_id: authService.me()?.id
    };

    // Save locally first
    const db = getLocalDB();
    if (!db[table]) db[table] = [];
    db[table].unshift(newItem);
    saveLocalDB(db);

    try {
      const { data, error } = await supabase.from(table).insert([newItem]).select();
      if (error) throw error;
      return data[0] || newItem;
    } catch (err) {
      console.warn(`Local Engine: Created ${table} item`);
      return newItem;
    }
  },

  update: async (table, id, updates) => {
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
      console.warn(`Local Engine: Updated ${table} item`);
      return { id, ...updates };
    }
  },

  delete: async (table, id) => {
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
      console.warn(`Local Engine: Deleted ${table} item`);
      return true;
    }
  }
};

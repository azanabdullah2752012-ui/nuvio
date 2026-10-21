import { authService } from './authService';

const DB_KEY = 'nuvio_life_os_db';
const LEGACY_KEY = 'acadevance_local_db';

const generateUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {}
  return 'id-' + Math.random().toString(36).substring(2, 10);
};

const getInitialDB = () => ({
  tasks: [
    { 
      id: 't-1', 
      title: 'Architect core deep work roadmap & system specs', 
      pillar: 'Craft', 
      energy: 'Deep 90m', 
      due: 'Today', 
      priority: 'High', 
      isHighlight: true, 
      completed: false 
    },
    { 
      id: 't-2', 
      title: 'Morning sunlight walk & 45-min compound workout', 
      pillar: 'Vitality', 
      energy: 'Body', 
      due: 'Today', 
      priority: 'High', 
      isHighlight: false, 
      completed: true 
    },
    { 
      id: 't-3', 
      title: '30-min offline non-fiction reading & zero-screen walk', 
      pillar: 'Mind', 
      energy: 'Rest', 
      due: 'Today', 
      priority: 'Medium', 
      isHighlight: false, 
      completed: false 
    },
    { 
      id: 't-4', 
      title: 'Undistracted evening dinner & phone-free family time', 
      pillar: 'Tribe', 
      energy: 'Rest', 
      due: 'Today', 
      priority: 'Medium', 
      isHighlight: false, 
      completed: false 
    },
    { 
      id: 't-5', 
      title: 'Clear pending emails and asynchronous logistics', 
      pillar: 'Craft', 
      energy: 'Admin 15m', 
      due: 'Tomorrow', 
      priority: 'Low', 
      isHighlight: false, 
      completed: false 
    }
  ],
  calendar_events: [
    {
      id: 'e-1',
      title: 'Deep Work Bout 1: High-Leverage Architecture',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '09:00',
      event_type: 'Deep Block'
    },
    {
      id: 'e-2',
      title: 'Gym Compound Resistance & Mobility',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '12:30',
      event_type: 'Physical'
    },
    {
      id: 'e-3',
      title: 'Cal Newport 60s Evening Shutdown Ritual',
      event_date: new Date().toISOString().split('T')[0],
      event_time: '18:00',
      event_type: 'Personal'
    }
  ],
  focus_sessions: [
    {
      id: 'fs-1',
      duration_minutes: 90,
      pillar: 'Craft',
      completed_at: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ],
  shutdowns: [],
  preferences: {
    archetype: 'Creator / Builder',
    dailyUltradianTarget: 2,
    bedtime: '22:30',
    wakeTime: '06:30'
  }
});

const getLocalDB = () => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) return JSON.parse(data);

    // If modern DB not found, check legacy DB and migrate
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      const migrated = getInitialDB();
      if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
        migrated.tasks = parsed.tasks.map(t => ({
          ...t,
          pillar: t.pillar || (t.subject === 'Math' || t.subject === 'Physics' ? 'Craft' : 'Mind'),
          energy: t.energy || 'Deep 90m',
          isHighlight: !!t.isHighlight
        }));
      }
      localStorage.setItem(DB_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (e) {
    console.warn("Malformed local DB in localStorage, resetting to clean state:", e);
  }

  const initial = getInitialDB();
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
};

const saveLocalDB = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('nuvio_data_update'));
};

export const PILLARS = [
  { id: 'Craft', label: 'Craft & Work', icon: '💼', color: '#1b3b2b', desc: 'High-leverage output, coding, writing & building' },
  { id: 'Vitality', label: 'Vitality & Body', icon: '⚡', color: '#8a4b16', desc: 'Sleep, sunlight, workouts, hydration & health' },
  { id: 'Mind', label: 'Mind & Clarity', icon: '🧠', color: '#244e6b', desc: 'Reading, NSDR, stillness & cognitive recovery' },
  { id: 'Tribe', label: 'Tribe & Connection', icon: '🤝', color: '#68325a', desc: 'Family, friends, community & presence' }
];

export const ENERGY_LEVELS = [
  { id: 'Deep 90m', label: 'Deep Focus (90m)', badge: '⚡ Deep' },
  { id: 'Admin 15m', label: 'Quick Admin (15m)', badge: '🌿 Admin' },
  { id: 'Body', label: 'Physical / Movement', badge: '🏃 Movement' },
  { id: 'Rest', label: 'Restoration / Offline', badge: '🌙 Rest' }
];

export const dataService = {
  list: async (table) => {
    const db = getLocalDB();
    return db[table] || [];
  },

  create: async (table, item) => {
    const user = authService.me();
    const newItem = {
      ...item,
      id: item.id || generateUUID(),
      created_at: new Date().toISOString(),
      user_id: user?.id || 'nuvio-user-01'
    };

    const db = getLocalDB();
    if (!db[table]) db[table] = [];
    db[table].unshift(newItem);
    saveLocalDB(db);

    return newItem;
  },

  update: async (table, id, updates) => {
    const db = getLocalDB();
    if (db[table]) {
      db[table] = db[table].map(item => item.id === id ? { ...item, ...updates } : item);
      saveLocalDB(db);
    }
    return { id, ...updates };
  },

  delete: async (table, id) => {
    const db = getLocalDB();
    if (db[table]) {
      db[table] = db[table].filter(item => item.id !== id);
      saveLocalDB(db);
    }
    return true;
  },

  // Daily Highlight Helper (Jake Knapp / Ali Abdaal / Hormozi)
  setHighlight: async (taskId) => {
    const db = getLocalDB();
    if (db.tasks) {
      db.tasks = db.tasks.map(t => ({
        ...t,
        isHighlight: t.id === taskId
      }));
      saveLocalDB(db);
    }
    return true;
  },

  // Record Evening Shutdown Ritual (Cal Newport)
  recordShutdown: async (shutdownData) => {
    const db = getLocalDB();
    if (!db.shutdowns) db.shutdowns = [];
    const record = {
      id: generateUUID(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      ...shutdownData
    };
    db.shutdowns.unshift(record);
    saveLocalDB(db);
    return record;
  }
};

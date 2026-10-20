import { authService } from './authService';

const DB_KEY = 'acadevance_local_db';

const generateUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {}
  return 'id-' + Math.random().toString(36).substring(2, 10);
};

const getLocalDB = () => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn("Malformed local DB in localStorage, resetting:", e);
  }
  const initial = {
    tasks: [
      { id: 't-1', title: 'Complete Number Systems Practice', subject: 'Math', due: 'Today', priority: 'High', completed: false },
      { id: 't-2', title: 'Review Motion Laws Flashcards', subject: 'Physics', due: 'Tomorrow', priority: 'Medium', completed: false },
      { id: 't-3', title: 'Cell Structure Quiz Prep', subject: 'Biology', due: 'In 2 days', priority: 'Low', completed: true }
    ],
    decks: [
      {
        id: 'd-1',
        title: 'Grade 9 Math: Coordinate Geometry',
        subject: 'Math',
        cards: [
          { front: 'What is the Origin?', back: 'The intersection point of x and y axes: (0, 0).' },
          { front: 'What is the Abscissa?', back: 'The x-coordinate of a point.' },
          { front: 'What is the Ordinate?', back: 'The y-coordinate of a point.' }
        ]
      },
      {
        id: 'd-2',
        title: 'Physics: Newton’s Laws',
        subject: 'Science',
        cards: [
          { front: 'Newton’s 1st Law', back: 'An object remains at rest or in uniform motion unless acted upon by a net external force.' },
          { front: 'Formula for Force', back: 'F = m * a (Force = Mass × Acceleration)' }
        ]
      }
    ],
    messages: [],
    inventory: [],
    stats: { xp: 1450, level: 5, tokens: 2500 }
  };
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
};

const saveLocalDB = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('acadevance_stats_update', { detail: authService.me() }));
};

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
      user_id: user?.id || 'scholar-local-01'
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
  }
};

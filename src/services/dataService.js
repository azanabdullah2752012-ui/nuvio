const DB_KEY = 'nuvio_minimal_db';

const generateUUID = () => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch (e) {}
  return 'id-' + Math.random().toString(36).substring(2, 10);
};

const getTodayDateStr = () => {
  return new Date().toISOString().split('T')[0];
};

const getInitialDB = () => ({
  tasks: [
    {
      id: 't-1',
      title: 'Finalize the project architecture and ship to production',
      isHighlight: true,
      completed: false,
      tag: 'Deep Work',
      date: 'today',
      created_at: new Date().toISOString()
    },
    {
      id: 't-2',
      title: 'Review weekly goals and clear urgent messages',
      isHighlight: false,
      completed: false,
      tag: 'Quick',
      date: 'today',
      created_at: new Date().toISOString()
    },
    {
      id: 't-3',
      title: 'Evening 45-minute gym compound workout',
      isHighlight: false,
      completed: true,
      tag: 'Health',
      date: 'today',
      created_at: new Date().toISOString()
    },
    {
      id: 't-4',
      title: 'Plan weekend trip & call family',
      isHighlight: false,
      completed: false,
      tag: 'Personal',
      date: 'upcoming',
      created_at: new Date().toISOString()
    }
  ],
  habits: [
    { id: 'h-1', name: 'Morning Sunlight & Walk', emoji: '☀️', streak: 4, lastCompleted: getTodayDateStr() },
    { id: 'h-2', name: 'Drink 2L Water', emoji: '💧', streak: 6, lastCompleted: getTodayDateStr() },
    { id: 'h-3', name: '30m Reading', emoji: '📖', streak: 3, lastCompleted: '' },
    { id: 'h-4', name: 'Workout / Move', emoji: '🏃', streak: 5, lastCompleted: getTodayDateStr() },
    { id: 'h-5', name: 'Sleep by 11:00 PM', emoji: '🌙', streak: 2, lastCompleted: '' }
  ],
  scratchpad: "Raw thoughts & scratchpad:\n\n• High-leverage execution > 8 hours of busywork\n• Remember to check server logs tomorrow morning\n• Book recommendation: Four Thousand Weeks",
  focusSessions: [
    { id: 'fs-1', minutes: 50, date: getTodayDateStr() },
    { id: 'fs-2', minutes: 25, date: getTodayDateStr() }
  ],
  review: {
    lastCloseDate: '',
    tomorrowHighlight: ''
  }
});

const getLocalDB = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Local DB reset:", e);
  }
  const init = getInitialDB();
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(init));
  } catch (e) {}
  return init;
};

const saveLocalDB = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('nuvio_update'));
};

export const dataService = {
  // Tasks
  getTasks: () => {
    return getLocalDB().tasks || [];
  },

  addTask: (title, tag = 'Deep Work', isHighlight = false, date = 'today') => {
    const db = getLocalDB();
    const newTask = {
      id: generateUUID(),
      title: title.trim(),
      isHighlight: Boolean(isHighlight),
      completed: false,
      tag,
      date,
      created_at: new Date().toISOString()
    };
    if (isHighlight) {
      db.tasks.forEach(t => { t.isHighlight = false; });
    }
    db.tasks.unshift(newTask);
    saveLocalDB(db);
    return newTask;
  },

  toggleTask: (id) => {
    const db = getLocalDB();
    const task = db.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveLocalDB(db);
    }
    return task;
  },

  setHighlight: (id) => {
    const db = getLocalDB();
    db.tasks.forEach(t => {
      t.isHighlight = t.id === id;
    });
    saveLocalDB(db);
    return true;
  },

  deleteTask: (id) => {
    const db = getLocalDB();
    db.tasks = db.tasks.filter(t => t.id !== id);
    saveLocalDB(db);
    return true;
  },

  // Habits (Daily Anchors)
  getHabits: () => {
    const db = getLocalDB();
    const today = getTodayDateStr();
    return (db.habits || []).map(h => ({
      ...h,
      completedToday: h.lastCompleted === today
    }));
  },

  toggleHabit: (id) => {
    const db = getLocalDB();
    const today = getTodayDateStr();
    const habit = db.habits.find(h => h.id === id);
    if (habit) {
      if (habit.lastCompleted === today) {
        habit.lastCompleted = '';
        habit.streak = Math.max(0, (habit.streak || 1) - 1);
      } else {
        habit.lastCompleted = today;
        habit.streak = (habit.streak || 0) + 1;
      }
      saveLocalDB(db);
    }
    return habit;
  },

  // Scratchpad
  getScratchpad: () => {
    return getLocalDB().scratchpad || '';
  },

  saveScratchpad: (text) => {
    const db = getLocalDB();
    db.scratchpad = text;
    saveLocalDB(db);
  },

  // Focus
  getFocusSessions: () => {
    return getLocalDB().focusSessions || [];
  },

  logFocusSession: (minutes) => {
    const db = getLocalDB();
    if (!db.focusSessions) db.focusSessions = [];
    const newSession = {
      id: generateUUID(),
      minutes: Number(minutes) || 25,
      date: getTodayDateStr(),
      timestamp: new Date().toISOString()
    };
    db.focusSessions.unshift(newSession);
    saveLocalDB(db);
    return newSession;
  },

  // Evening Close
  recordEveningClose: (tomorrowHighlight) => {
    const db = getLocalDB();
    const today = getTodayDateStr();
    db.review = {
      lastCloseDate: today,
      tomorrowHighlight: tomorrowHighlight || ''
    };
    if (tomorrowHighlight && tomorrowHighlight.trim()) {
      db.tasks.forEach(t => { t.isHighlight = false; });
      db.tasks.unshift({
        id: generateUUID(),
        title: tomorrowHighlight.trim(),
        isHighlight: true,
        completed: false,
        tag: 'Deep Work',
        date: 'today',
        created_at: new Date().toISOString()
      });
    }
    saveLocalDB(db);
    return true;
  }
};

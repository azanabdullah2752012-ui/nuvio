// KAISER OS - Local-First Data Service
// Built specifically for Kaiser (14, Builder, Class 9 GCIS, Robotics & Software)

const DB_KEY = 'kaiser_os_db';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const getInitialDB = () => ({
  user: {
    name: 'Kaiser',
    title: 'Builder & Polaris Vice Captain',
    avatar: '⚡'
  },
  activeBuild: {
    name: 'Pickle Studio & Digital Products',
    type: 'Software / Web App',
    goal: 'Ship MVP with real user validation (no shiny-object abandonment)',
    status: 'In Progress',
    nextStep: 'Finalize UI and test with 3 real friends for honest feedback',
    repo: 'azanabdullah2752012-ui/nuvio'
  },
  missions: [
    {
      id: 'm-1',
      title: 'Complete 8 Pearson Class 9 word-to-equation Maths problems',
      category: 'Academic', // 'Academic' | 'Build' | 'Personal'
      tag: 'Maths / IIT Prep',
      completed: false,
      date: getTodayStr()
    },
    {
      id: 'm-2',
      title: 'Test ESP32 motor driver circuit & check pin availability',
      category: 'Build',
      tag: 'Robotics',
      completed: false,
      date: getTodayStr()
    },
    {
      id: 'm-3',
      title: 'Morning workout (20m) & Fajr prayer on time',
      category: 'Personal',
      tag: 'Discipline',
      completed: true,
      date: getTodayStr()
    }
  ],
  routineBlocks: [
    { time: '05:00 – 05:20', label: 'Wake Up & Fajr', desc: 'Freshen up, prayer, clean mindset', category: 'personal' },
    { time: '05:20 – 06:20', label: 'Morning Deep Study', desc: 'Maths / Science high-alertness block', category: 'study' },
    { time: '06:20 – 06:40', label: 'Exercise & Movement', desc: 'Push-ups, core, mobility', category: 'personal' },
    { time: '08:00 – 16:00', label: 'Greenfield Chennai School', desc: 'Class IX-C academics & Polaris house leadership', category: 'school' },
    { time: '17:00 – 18:30', label: 'NextTopper / Deep Study', desc: 'PCB, Olympiad / JEE foundation concepts', category: 'study' },
    { time: '18:30 – 19:00', label: 'Homework & Revision', desc: 'Clear school deliverables, zero backlog', category: 'school' },
    { time: '19:00 – 19:45', label: 'Arabic & Language Study', desc: 'Mon-Wed Arabic / Thu-Sun study sprint', category: 'study' },
    { time: '20:00 – 21:30', label: 'The Forge (Build Block)', desc: 'Pure programming, robotics, software experiments', category: 'build' },
    { time: '21:30 – 22:15', label: 'Decompress & Flame Lore', desc: 'Music, creative lore, unwind, sleep', category: 'personal' }
  ],
  ideaVault: [
    {
      id: 'iv-1',
      title: 'ESP32 AI Pet Robot',
      type: 'Robotics',
      notes: 'L298N motor driver + OV7670 camera. Remember: camera pins collide with motor pins on basic setup. Need pin multiplexing or ESP32-CAM dedicated module.'
    },
    {
      id: 'iv-2',
      title: 'Flame Dragon Lore: The Blue Fire Celestial',
      type: 'Creative',
      notes: 'White and green dragon with 4 wings and blue flames. Celestial of power. Lore rule: Keep epic and tactical, no mythological gods.'
    },
    {
      id: 'iv-3',
      title: 'JEE Topic Finder for Friends',
      type: 'Product Idea',
      notes: 'Solves the problem of hunting past year questions by subtopic. Keep it simple: search topic -> get 5 curated past paper questions.'
    }
  ],
  scratchpad: "Quick Scratchpad & Brain Dump:\n\n• Class 9 Maths: Focus on word problems -> identify knowns/unknowns first before jumping to calculations.\n• Waiting For Love (Avicii) on repeat during coding sprints.\n• Rule: Finish current project before starting a new repo.",
  sessions: [
    { id: 's-1', minutes: 45, label: 'Maths Word Problems', date: getTodayStr() },
    { id: 's-2', minutes: 50, label: 'Kaiser OS Build', date: getTodayStr() }
  ]
});

const getDB = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Kaiser OS DB reset:", e);
  }
  const init = getInitialDB();
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(init));
  } catch (e) {}
  return init;
};

const saveDB = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
  window.dispatchEvent(new CustomEvent('kaiser_os_update'));
};

export const dataService = {
  getProfile: () => getDB().user,
  getActiveBuild: () => getDB().activeBuild,
  updateActiveBuild: (updates) => {
    const db = getDB();
    db.activeBuild = { ...db.activeBuild, ...updates };
    saveDB(db);
    return db.activeBuild;
  },

  getMissions: () => getDB().missions || [],
  addMission: (title, category = 'Build', tag = 'Task') => {
    const db = getDB();
    const newMission = {
      id: 'm-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      category,
      tag,
      completed: false,
      date: getTodayStr()
    };
    db.missions.unshift(newMission);
    saveDB(db);
    return newMission;
  },
  toggleMission: (id) => {
    const db = getDB();
    const m = db.missions.find(x => x.id === id);
    if (m) {
      m.completed = !m.completed;
      saveDB(db);
    }
    return m;
  },
  deleteMission: (id) => {
    const db = getDB();
    db.missions = db.missions.filter(x => x.id !== id);
    saveDB(db);
    return true;
  },

  getRoutine: () => getDB().routineBlocks || [],

  getIdeaVault: () => getDB().ideaVault || [],
  addIdea: (title, type, notes) => {
    const db = getDB();
    const newIdea = {
      id: 'iv-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      type: type || 'Product Idea',
      notes: notes || ''
    };
    db.ideaVault.unshift(newIdea);
    saveDB(db);
    return newIdea;
  },
  deleteIdea: (id) => {
    const db = getDB();
    db.ideaVault = db.ideaVault.filter(x => x.id !== id);
    saveDB(db);
    return true;
  },

  getScratchpad: () => getDB().scratchpad || '',
  saveScratchpad: (text) => {
    const db = getDB();
    db.scratchpad = text;
    saveDB(db);
  },

  getSessions: () => getDB().sessions || [],
  logSession: (minutes, label) => {
    const db = getDB();
    if (!db.sessions) db.sessions = [];
    const session = {
      id: 's-' + Math.random().toString(36).substring(2, 9),
      minutes: Number(minutes) || 25,
      label: label || 'Deep Focus',
      date: getTodayStr(),
      timestamp: new Date().toISOString()
    };
    db.sessions.unshift(session);
    saveDB(db);
    return session;
  }
};

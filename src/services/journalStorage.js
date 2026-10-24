// ============================================================================
// JOURNAL STORAGE SERVICE — 100% Client-Side LocalStorage
// Zero AI, Zero Cloud, Zero Server, Zero Data Sent Anywhere.
// Built specifically for Kaiser (Grade 9, Chennai).
// ============================================================================

const STORAGE_KEYS = {
  ACCENT_COLOR: 'journal_accent_color',
  THEME: 'journal_theme',
  ROUTINE_CUSTOM: 'journal_routine_custom',
  ROUTINE_LOGS: 'journal_routine_logs',
  PRIORITIES: 'journal_daily_priorities',
  HABITS: 'journal_habits_list',
  HABIT_LOGS: 'journal_habit_logs',
  REFLECTIONS: 'journal_reflections',
  ROUTINE_TYPE_OVERRIDE: 'journal_routine_type_override',
  MARKS: 'journal_marks_records',
  GOALS: 'journal_academic_goals',
  WEEKLY_REVIEWS: 'journal_weekly_reviews',
  WINS: 'journal_small_wins',
  MISTAKES: 'journal_mistakes_notebook',
  ACTIVE_PROJECT: 'journal_active_project',
  IDEA_VAULT: 'journal_idea_vault',
  EQUATION_FORGE: 'journal_equation_forge',
  EXAM_COUNTDOWNS: 'journal_exam_countdowns',
  SCRATCHPAD: 'journal_scratchpad',
  FOCUS_SESSIONS: 'journal_focus_sessions'
};

// Default Accent Color chosen by Kaiser
export const DEFAULT_ACCENT_COLOR = '#024899';

// Built-in accent color options for quick toggling
export const ACCENT_PRESETS = [
  { name: 'Kaiser Sapphire', hex: '#024899' },
  { name: 'Electric Cyan', hex: '#06b6d4' },
  { name: 'Polaris Emerald', hex: '#10b981' },
  { name: 'Warm Amber', hex: '#f59e0b' },
  { name: 'Royal Purple', hex: '#8b5cf6' },
  { name: 'Crimson Rose', hex: '#f43f5e' }
];

// Weekday Template (School day schedule)
export const DEFAULT_WEEKDAY_ROUTINE = [
  { id: 'fajr', time: '05:00', label: 'Fajr & Wake Up', tag: 'Faith' },
  { id: 'study_am', time: '05:20 - 06:20', label: 'Morning Study Block (Math / Science)', tag: 'Academics' },
  { id: 'exercise', time: '06:20 - 06:40', label: 'Exercise & Movement (20m)', tag: 'Health' },
  { id: 'prep_breakfast', time: '07:10 - 07:30', label: 'Breakfast & Pack Bags', tag: 'Routine' },
  { id: 'bus', time: '07:50 - 08:00', label: 'Bus to School', tag: 'Travel' },
  { id: 'school', time: '08:00 - 16:00', label: 'Greenfield Chennai International School', tag: 'School' },
  { id: 'decomp', time: '16:30 - 17:00', label: 'Meal & Decompress (Rest is not wasted time)', tag: 'Rest' },
  { id: 'nexttopper', time: '17:00 - 18:30', label: 'NextTopper Class', tag: 'Academics' },
  { id: 'homework', time: '18:30 - 19:00', label: 'Homework & School Revision', tag: 'Academics' },
  { id: 'arabic_study', time: '19:00 - 19:45', label: 'Arabic (Mon-Wed) / Focused Study (Thu-Fri)', tag: 'Study' },
  { id: 'family_sleep', time: '20:30', label: 'Family Time, Dinner & Early Sleep', tag: 'Family' }
];

// Weekend Template (Deep build & JEE prep schedule)
export const DEFAULT_WEEKEND_ROUTINE = [
  { id: 'fajr_we', time: '05:00', label: 'Fajr & Morning Gratitude', tag: 'Faith' },
  { id: 'jee_math_am', time: '06:00 - 07:30', label: 'Deep JEE & Math Problem Sets (Equations Practice)', tag: 'Academics' },
  { id: 'exercise_we', time: '07:30 - 08:15', label: 'Exercise & Breakfast', tag: 'Health' },
  { id: 'product_build', time: '09:00 - 12:30', label: 'Deep Product Build / Algorithms & Code', tag: 'Building' },
  { id: 'dhuhr_family', time: '13:00 - 14:30', label: 'Dhuhr Prayer & Family Lunch', tag: 'Family' },
  { id: 'reading_skill', time: '15:00 - 16:30', label: 'Self-Improvement Reading / CS Concepts', tag: 'Growth' },
  { id: 'sports_outdoor', time: '17:00 - 18:30', label: 'Outdoor Movement / Play / Refresh', tag: 'Rest' },
  { id: 'revision_plan', time: '19:00 - 20:00', label: 'Weekly Revision & Plan for Upcoming Week', tag: 'Academics' },
  { id: 'wind_down_we', time: '21:00', label: 'Rest & Early Sleep', tag: 'Rest' }
];

// Initial Core Habits chosen by Kaiser
export const INITIAL_HABITS = [
  { id: 'prayers', name: '5 Prayers', category: 'Faith', description: 'Fajr, Dhuhr, Asr, Maghrib, Isha' },
  { id: 'exercise', name: 'Exercise', category: 'Health', description: '20 minutes of daily physical training' },
  { id: 'actual_studying', name: '1h Actual Studying (excluding h.w)', category: 'Academics', description: 'Deep conceptual study, not routine school homework' },
  { id: 'jee_prep', name: '1h JEE', category: 'Academics', description: 'Turning word problems into equations & foundation drills' },
  { id: 'self_improvement', name: '1 Hour Self Improvement', category: 'Growth', description: 'Coding, algorithms, building real products, or reading' }
];

// Format Date as YYYY-MM-DD in local timezone
export const getTodayKey = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Safe JSON parser helper
const safeJsonParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

export const journalStorage = {
  // ── THEME & ACCENT COLOR ──────────────────────────────────────────
  getAccentColor() {
    return localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || DEFAULT_ACCENT_COLOR;
  },

  setAccentColor(hex) {
    localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, hex);
    this.applyAccentColor(hex);
    window.dispatchEvent(new CustomEvent('journal_theme_change', { detail: hex }));
  },

  applyAccentColor(hex) {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', hex);
    // Generate lighter border and faint glow shades
    root.style.setProperty('--accent-glow', `${hex}33`); // ~20% opacity
    root.style.setProperty('--accent-subtle', `${hex}1a`); // ~10% opacity
    root.style.setProperty('--accent-border', `${hex}66`); // ~40% opacity
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
    window.dispatchEvent(new CustomEvent('journal_theme_change', { detail: { theme } }));
  },

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  },

  // ── ROUTINE TYPE & TEMPLATES ──────────────────────────────────────
  getRoutineType(dateKey = getTodayKey()) {
    const overrides = safeJsonParse(STORAGE_KEYS.ROUTINE_TYPE_OVERRIDE, {});
    if (overrides[dateKey]) {
      return overrides[dateKey];
    }
    // Auto-detect based on day of week: Sunday (0) and Saturday (6) are weekends
    const [year, month, day] = dateKey.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();
    return (dayOfWeek === 0 || dayOfWeek === 6) ? 'weekend' : 'weekday';
  },

  setRoutineTypeOverride(dateKey, type) {
    const overrides = safeJsonParse(STORAGE_KEYS.ROUTINE_TYPE_OVERRIDE, {});
    overrides[dateKey] = type;
    localStorage.setItem(STORAGE_KEYS.ROUTINE_TYPE_OVERRIDE, JSON.stringify(overrides));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  getRoutineTemplate(type) {
    return type === 'weekend' ? DEFAULT_WEEKEND_ROUTINE : DEFAULT_WEEKDAY_ROUTINE;
  },

  getRoutineLog(dateKey = getTodayKey()) {
    const logs = safeJsonParse(STORAGE_KEYS.ROUTINE_LOGS, {});
    return logs[dateKey] || {};
  },

  toggleRoutineItem(dateKey, itemId) {
    const logs = safeJsonParse(STORAGE_KEYS.ROUTINE_LOGS, {});
    if (!logs[dateKey]) logs[dateKey] = {};
    logs[dateKey][itemId] = !logs[dateKey][itemId];
    localStorage.setItem(STORAGE_KEYS.ROUTINE_LOGS, JSON.stringify(logs));
    window.dispatchEvent(new Event('journal_data_update'));
    return logs[dateKey][itemId];
  },

  getNextRoutineInfo(dateKey = getTodayKey()) {
    const routineType = this.getRoutineType(dateKey);
    const template = this.getRoutineTemplate(routineType);
    const logs = this.getRoutineLog(dateKey);

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper to parse "HH:MM" or "HH:MM - HH:MM" into start and end minutes
    const parseTimeRange = (timeStr) => {
      const parts = timeStr.split('-').map(s => s.trim());
      const parseTime = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + (m || 0);
      };
      const startMin = parseTime(parts[0]);
      const endMin = parts.length > 1 ? parseTime(parts[1]) : startMin + 30;
      return { startMin, endMin };
    };

    let activeBlock = null;
    let nextBlock = null;

    for (let i = 0; i < template.length; i++) {
      const item = template[i];
      const { startMin, endMin } = parseTimeRange(item.time);
      const isCompleted = !!logs[item.id];

      if (currentMinutes >= startMin && currentMinutes < endMin) {
        activeBlock = { ...item, isCompleted, startMin, endMin };
        nextBlock = template[i + 1] ? { ...template[i + 1], ...parseTimeRange(template[i + 1].time) } : null;
        break;
      } else if (currentMinutes < startMin) {
        if (!nextBlock) {
          nextBlock = { ...item, isCompleted, startMin, endMin };
        }
      }
    }

    const lastItem = template[template.length - 1];
    const { endMin: lastEndMin } = parseTimeRange(lastItem.time);
    const isDayComplete = currentMinutes >= lastEndMin;

    return {
      routineType,
      activeBlock,
      nextBlock,
      isDayComplete,
      currentTimeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  // ── 3 PRIORITIES OF THE DAY ───────────────────────────────────────
  getPriorities(dateKey = getTodayKey()) {
    const allPriorities = safeJsonParse(STORAGE_KEYS.PRIORITIES, {});
    if (allPriorities[dateKey] && Array.isArray(allPriorities[dateKey])) {
      return allPriorities[dateKey];
    }
    // Default 3 clean empty slots
    return [
      { id: 1, text: '', completed: false, label: 'Priority 1 (Must-Ship / Core)' },
      { id: 2, text: '', completed: false, label: 'Priority 2 (Academic / Problem Set)' },
      { id: 3, text: '', completed: false, label: 'Priority 3 (Personal / Growth)' }
    ];
  },

  updatePriority(dateKey, index, text) {
    const all = safeJsonParse(STORAGE_KEYS.PRIORITIES, {});
    const list = this.getPriorities(dateKey);
    if (list[index]) {
      list[index].text = text;
    }
    all[dateKey] = list;
    localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(all));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  togglePriority(dateKey, index) {
    const all = safeJsonParse(STORAGE_KEYS.PRIORITIES, {});
    const list = this.getPriorities(dateKey);
    if (list[index]) {
      list[index].completed = !list[index].completed;
    }
    all[dateKey] = list;
    localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(all));
    window.dispatchEvent(new Event('journal_data_update'));
    return list[index]?.completed;
  },

  // ── HABIT TRACKER (STREAKS & REST DAYS) ───────────────────────────
  getHabits() {
    return safeJsonParse(STORAGE_KEYS.HABITS, INITIAL_HABITS);
  },

  addHabit(name, category = 'General', description = '') {
    const habits = this.getHabits();
    const id = 'h_' + Date.now().toString(36);
    const newHabit = { id, name, category, description };
    habits.push(newHabit);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    window.dispatchEvent(new Event('journal_data_update'));
    return newHabit;
  },

  deleteHabit(id) {
    let habits = this.getHabits();
    habits = habits.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  getHabitLog(dateKey = getTodayKey()) {
    const logs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
    return logs[dateKey] || { completed: {}, isRestDay: false };
  },

  toggleHabit(dateKey, habitId) {
    const logs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
    if (!logs[dateKey]) {
      logs[dateKey] = { completed: {}, isRestDay: false };
    }
    if (!logs[dateKey].completed) {
      logs[dateKey].completed = {};
    }
    logs[dateKey].completed[habitId] = !logs[dateKey].completed[habitId];
    localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(logs));
    window.dispatchEvent(new Event('journal_data_update'));
    return logs[dateKey].completed[habitId];
  },

  toggleRestDay(dateKey = getTodayKey()) {
    const logs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
    if (!logs[dateKey]) {
      logs[dateKey] = { completed: {}, isRestDay: false };
    }
    logs[dateKey].isRestDay = !logs[dateKey].isRestDay;
    localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(logs));
    window.dispatchEvent(new Event('journal_data_update'));
    return logs[dateKey].isRestDay;
  },

  // Calculate streak for a specific habit
  getHabitStreak(habitId) {
    const logs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
    const today = new Date();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check today's status
    const todayKey = getTodayKey(today);
    const todayLog = logs[todayKey];
    const isTodayDone = todayLog?.completed?.[habitId] || todayLog?.isRestDay;

    // Check yesterday's status to detect if Kaiser missed
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getTodayKey(yesterday);
    const yesterdayLog = logs[yesterdayKey];
    const isYesterdayDone = yesterdayLog?.completed?.[habitId] || yesterdayLog?.isRestDay;

    // If yesterday was missed and today is not done yet, prompt: "Get back on track"
    const needsCatchUp = !isTodayDone && !isYesterdayDone;

    // Count backwards from today or yesterday
    let checkDate = new Date(today);
    if (!isTodayDone) {
      // If today isn't done yet, check if streak from yesterday is alive
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const key = getTodayKey(checkDate);
      const dayLog = logs[key];
      const done = dayLog?.completed?.[habitId] || dayLog?.isRestDay;

      if (done) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Historical longest streak across past 60 days
    const pastCheck = new Date(today);
    pastCheck.setDate(pastCheck.getDate() - 60);
    const endCheck = new Date(today);

    while (pastCheck <= endCheck) {
      const key = getTodayKey(pastCheck);
      const dayLog = logs[key];
      const done = dayLog?.completed?.[habitId] || dayLog?.isRestDay;

      if (done) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
      pastCheck.setDate(pastCheck.getDate() + 1);
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      isTodayDone: !!isTodayDone,
      needsCatchUp
    };
  },

  // Get past 7 days summary for habit tracking row
  getRecentDays(daysCount = 7) {
    const list = [];
    const today = new Date();
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getTodayKey(d);
      const dayName = d.toLocaleDateString([], { weekday: 'narrow' });
      const dayNum = d.getDate();
      list.push({ dateKey: key, dayName, dayNum, isToday: i === 0 });
    }
    return list;
  },

  // ── DAILY REFLECTION NOTE ─────────────────────────────────────────
  getDailyReflection(dateKey = getTodayKey()) {
    const all = safeJsonParse(STORAGE_KEYS.REFLECTIONS, {});
    return all[dateKey] || '';
  },

  saveDailyReflection(dateKey, text) {
    const all = safeJsonParse(STORAGE_KEYS.REFLECTIONS, {});
    all[dateKey] = text;
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(all));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── MARKS & EXAM RECORDS ──────────────────────────────────────────
  getMarks() {
    return safeJsonParse(STORAGE_KEYS.MARKS, []);
  },

  addMark(record) {
    const list = this.getMarks();
    const id = 'm_' + Date.now().toString(36);
    const percentage = Math.round((Number(record.marksObtained) / Number(record.totalMarks)) * 100);
    const newRecord = { ...record, id, percentage, createdAt: new Date().toISOString() };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newRecord;
  },

  deleteMark(id) {
    let list = this.getMarks();
    list = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── GOALS & TARGETS (EXPLICITLY LABELED AS GOALS, NOT PREDICTIONS) ──
  getGoals() {
    const defaultGoals = [
      { id: 'g_term', title: 'Academic Year Target (90%+)', target: '90%+', timeframe: 'Finals', category: 'Academic', status: 'In Progress', note: 'Milestone target to work toward, not a prediction' },
      { id: 'g_equations', title: 'Master Converting Word Problems to Equations', target: 'Daily practice drills', timeframe: 'Ongoing', category: 'Maths / JEE', status: 'Active', note: 'Practice isolating variables and relationships first' },
      { id: 'g_ship', title: 'Build & Ship Real Usable Software', target: 'Practical projects with real utility', timeframe: '2026-2027', category: 'Building', status: 'Active', note: 'Focus on shipping & iteration' }
    ];
    return safeJsonParse(STORAGE_KEYS.GOALS, defaultGoals);
  },

  addGoal(goal) {
    const list = this.getGoals();
    const id = 'g_' + Date.now().toString(36);
    const newGoal = { ...goal, id, status: 'In Progress', createdAt: new Date().toISOString() };
    list.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newGoal;
  },

  deleteGoal(id) {
    let list = this.getGoals();
    list = list.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── WEEKLY REVIEWS (5-MINUTE PROTOCOL) ───────────────────────────
  getWeeklyReviews() {
    return safeJsonParse(STORAGE_KEYS.WEEKLY_REVIEWS, []);
  },

  saveWeeklyReview(review) {
    const list = this.getWeeklyReviews();
    const id = review.id || 'wr_' + Date.now().toString(36);
    const newReview = { ...review, id, date: review.date || getTodayKey() };
    const existingIndex = list.findIndex(r => r.id === id);
    if (existingIndex >= 0) {
      list[existingIndex] = newReview;
    } else {
      list.unshift(newReview);
    }
    localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newReview;
  },

  deleteWeeklyReview(id) {
    let list = this.getWeeklyReviews();
    list = list.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── SMALL WINS & SHIPPED VAULT ────────────────────────────────────
  getWins() {
    return safeJsonParse(STORAGE_KEYS.WINS, []);
  },

  addWin(win) {
    const list = this.getWins();
    const id = 'win_' + Date.now().toString(36);
    const newWin = { ...win, id, date: win.date || getTodayKey() };
    list.unshift(newWin);
    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newWin;
  },

  deleteWin(id) {
    let list = this.getWins();
    list = list.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── MISTAKE NOTEBOOK (TAGGED BY ERROR TYPE) ───────────────────────
  getMistakes() {
    return safeJsonParse(STORAGE_KEYS.MISTAKES, []);
  },

  addMistake(mistake) {
    const list = this.getMistakes();
    const id = 'mist_' + Date.now().toString(36);
    const newMistake = { ...mistake, id, date: mistake.date || getTodayKey(), reviewed: false };
    list.unshift(newMistake);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newMistake;
  },

  toggleMistakeReviewed(id) {
    const list = this.getMistakes();
    const item = list.find(m => m.id === id);
    if (item) {
      item.reviewed = !item.reviewed;
      localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  deleteMistake(id) {
    let list = this.getMistakes();
    list = list.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── ACTIVE PROJECT FORGE (ANTI-SHINY-OBJECT SHIELD) ────────────────
  getActiveProject() {
    const defaultProject = {
      name: 'Journal OS',
      pitch: 'Personal self-improvement command center for Grade 9, faith & JEE prep',
      nextStep: 'Complete high-density builder dashboard and math equation drills',
      repoUrl: 'https://github.com/azanabdullah2752012-ui/nuvio',
      liveUrl: 'http://localhost:5173',
      milestones: [
        { id: 'm1', text: 'Vite + React 19 architecture', completed: true },
        { id: 'm2', text: '100% private browser localStorage engine', completed: true },
        { id: 'm3', text: 'Lock-In focus chamber & ambient sound synthesis', completed: true },
        { id: 'm4', text: 'Math word-problem equation breakdown forge', completed: true }
      ]
    };
    return safeJsonParse(STORAGE_KEYS.ACTIVE_PROJECT, defaultProject);
  },

  saveActiveProject(proj) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, JSON.stringify(proj));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  toggleProjectMilestone(index) {
    const proj = this.getActiveProject();
    if (proj.milestones && proj.milestones[index]) {
      proj.milestones[index].completed = !proj.milestones[index].completed;
      this.saveActiveProject(proj);
    }
  },

  // ── IDEA VAULT (DISTRACTION PARKING LOT) ──────────────────────────
  getIdeaVault() {
    const defaultIdeas = [
      { id: 'i1', title: 'Pickle Corp Favors Ledger', category: 'Studio', note: 'Independent freelance studio ledger paid strictly in real-life favors' },
      { id: 'i2', title: 'ESP32 Autonomous Rover', category: 'Robotics', note: 'Ultrasonic obstacle avoidance and motor driver PID controller' },
      { id: 'i3', title: 'Space Flight Orbit Simulator', category: 'Physics / Space', note: 'Keplerian orbital mechanics visualizer using HTML5 canvas' }
    ];
    return safeJsonParse(STORAGE_KEYS.IDEA_VAULT, defaultIdeas);
  },

  addIdea(idea) {
    const list = this.getIdeaVault();
    const id = 'idea_' + Date.now().toString(36);
    const newIdea = { ...idea, id, date: getTodayKey() };
    list.unshift(newIdea);
    localStorage.setItem(STORAGE_KEYS.IDEA_VAULT, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newIdea;
  },

  deleteIdea(id) {
    let list = this.getIdeaVault();
    list = list.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.IDEA_VAULT, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── WORD PROBLEM TO EQUATION FORGE (MATH BOTTLENECK SOLVER) ───────
  getEquationDrills() {
    const defaultDrills = [
      {
        id: 'eq1',
        title: 'Speed & Distance Opposite Direction Drill',
        problem: 'Two trains start at the same time from stations 300km apart and travel toward each other. Train A is 10km/h faster than Train B. They cross each other in 2.5 hours.',
        variables: 'Let speed of Train B = x km/h. Speed of Train A = (x + 10) km/h.',
        condition: 'Total distance = Distance A + Distance B = 300 km.',
        equation: '2.5(x + 10) + 2.5x = 300  ==>  5x + 25 = 300  ==>  5x = 275  ==>  x = 55 km/h',
        date: '2026-10-24'
      }
    ];
    return safeJsonParse(STORAGE_KEYS.EQUATION_FORGE, defaultDrills);
  },

  addEquationDrill(drill) {
    const list = this.getEquationDrills();
    const id = 'eq_' + Date.now().toString(36);
    const newDrill = { ...drill, id, date: getTodayKey() };
    list.unshift(newDrill);
    localStorage.setItem(STORAGE_KEYS.EQUATION_FORGE, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newDrill;
  },

  deleteEquationDrill(id) {
    let list = this.getEquationDrills();
    list = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.EQUATION_FORGE, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── EXAM COUNTDOWNS ───────────────────────────────────────────────
  getExamCountdowns() {
    const defaultCountdowns = [
      { id: 'c1', name: 'Class 9 Final Examinations', targetDate: '2027-02-15', subject: 'All Subjects (Target: 90%+)' },
      { id: 'c2', name: 'Mathematics 80-Mark Comprehensive Test', targetDate: '2026-11-20', subject: 'Algebra, Geometry & Mensuration' }
    ];
    return safeJsonParse(STORAGE_KEYS.EXAM_COUNTDOWNS, defaultCountdowns);
  },

  addExamCountdown(item) {
    const list = this.getExamCountdowns();
    const id = 'cd_' + Date.now().toString(36);
    const newItem = { ...item, id };
    list.push(newItem);
    localStorage.setItem(STORAGE_KEYS.EXAM_COUNTDOWNS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newItem;
  },

  deleteExamCountdown(id) {
    let list = this.getExamCountdowns();
    list = list.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXAM_COUNTDOWNS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── LIVE DEVELOPER / STUDY SCRATCHPAD ─────────────────────────────
  getScratchpad() {
    return localStorage.getItem(STORAGE_KEYS.SCRATCHPAD) || '// Kaiser OS Quick Scratchpad\n// Turn word problems into equations first:\n// 1. Identify unknowns (x, y)\n// 2. Write relations\n// 3. Solve & check units';
  },

  saveScratchpad(text) {
    localStorage.setItem(STORAGE_KEYS.SCRATCHPAD, text);
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── FOCUS SESSIONS (LOCK-IN TIME LOGGER) ──────────────────────────
  getFocusSessions() {
    return safeJsonParse(STORAGE_KEYS.FOCUS_SESSIONS, []);
  },

  logFocusSession(minutes, target = 'Deep Focus') {
    const list = this.getFocusSessions();
    const id = 'fs_' + Date.now().toString(36);
    const newSession = {
      id,
      minutes,
      target,
      date: getTodayKey(),
      timestamp: new Date().toISOString()
    };
    list.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newSession;
  },

  getTodayFocusMinutes(dateKey = getTodayKey()) {
    const list = this.getFocusSessions();
    return list
      .filter(s => s.date === dateKey)
      .reduce((acc, s) => acc + (s.minutes || 0), 0);
  },

  // ── BACKUP & DATA PORTABILITY (EXPORT / IMPORT JSON) ──────────────
  exportAllData() {
    const exportData = {
      app: 'Journal',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      accentColor: this.getAccentColor(),
      theme: this.getTheme(),
      habits: this.getHabits(),
      habitLogs: safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {}),
      routineLogs: safeJsonParse(STORAGE_KEYS.ROUTINE_LOGS, {}),
      routineTypeOverrides: safeJsonParse(STORAGE_KEYS.ROUTINE_TYPE_OVERRIDE, {}),
      priorities: safeJsonParse(STORAGE_KEYS.PRIORITIES, {}),
      reflections: safeJsonParse(STORAGE_KEYS.REFLECTIONS, {}),
      marks: this.getMarks(),
      goals: this.getGoals(),
      weeklyReviews: this.getWeeklyReviews(),
      wins: this.getWins(),
      mistakes: this.getMistakes(),
      activeProject: this.getActiveProject(),
      ideaVault: this.getIdeaVault(),
      equationDrills: this.getEquationDrills(),
      examCountdowns: this.getExamCountdowns(),
      scratchpad: this.getScratchpad(),
      focusSessions: this.getFocusSessions()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-backup-${getTodayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importAllData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || data.app !== 'Journal') {
        throw new Error('Invalid Journal backup file');
      }

      if (data.accentColor) localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, data.accentColor);
      if (data.theme) localStorage.setItem(STORAGE_KEYS.THEME, data.theme);
      if (data.habits) localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data.habits));
      if (data.habitLogs) localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(data.habitLogs));
      if (data.routineLogs) localStorage.setItem(STORAGE_KEYS.ROUTINE_LOGS, JSON.stringify(data.routineLogs));
      if (data.routineTypeOverrides) localStorage.setItem(STORAGE_KEYS.ROUTINE_TYPE_OVERRIDE, JSON.stringify(data.routineTypeOverrides));
      if (data.priorities) localStorage.setItem(STORAGE_KEYS.PRIORITIES, JSON.stringify(data.priorities));
      if (data.reflections) localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(data.reflections));
      if (data.marks) localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(data.marks));
      if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
      if (data.weeklyReviews) localStorage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, JSON.stringify(data.weeklyReviews));
      if (data.wins) localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(data.wins));
      if (data.mistakes) localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(data.mistakes));
      if (data.activeProject) localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, JSON.stringify(data.activeProject));
      if (data.ideaVault) localStorage.setItem(STORAGE_KEYS.IDEA_VAULT, JSON.stringify(data.ideaVault));
      if (data.equationDrills) localStorage.setItem(STORAGE_KEYS.EQUATION_FORGE, JSON.stringify(data.equationDrills));
      if (data.examCountdowns) localStorage.setItem(STORAGE_KEYS.EXAM_COUNTDOWNS, JSON.stringify(data.examCountdowns));
      if (data.scratchpad) localStorage.setItem(STORAGE_KEYS.SCRATCHPAD, data.scratchpad);
      if (data.focusSessions) localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(data.focusSessions));

      if (data.accentColor) this.applyAccentColor(data.accentColor);
      if (data.theme) this.applyTheme(data.theme);

      window.dispatchEvent(new Event('journal_data_update'));
      return { success: true };
    } catch (err) {
      console.error('Import failed:', err);
      return { success: false, error: err.message };
    }
  }
};

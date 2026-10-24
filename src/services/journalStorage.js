// ============================================================================
// JOURNAL STORAGE SERVICE — 100% Client-Side LocalStorage
// Zero AI, Zero Cloud, Zero Server, Zero Data Sent Anywhere.
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
  ACTIVE_PROJECT: 'journal_active_project',
  PROJECTS_LIST: 'journal_projects_list',
  IDEA_VAULT: 'journal_idea_vault',
  EQUATION_FORGE: 'journal_equation_forge',
  EXAM_COUNTDOWNS: 'journal_exam_countdowns',
  SCRATCHPAD: 'journal_scratchpad',
  FOCUS_SESSIONS: 'journal_focus_sessions',
  STUDY_SESSIONS: 'journal_study_sessions',
  FORMULAS: 'journal_jee_formulas',
  SPELLING: 'journal_spelling_precision',
  PRAYER_LOGS: 'journal_prayer_logs',
  SYLLABUS: 'journal_syllabus_progress',
  DISCIPLINE_CHECKS: 'journal_discipline_checks',
  DISCIPLINE_PLEDGES: 'journal_discipline_pledges',
  IRON_RULES: 'journal_iron_rules',
  REALITY_CHECKS: 'journal_reality_checks',
  TASBIH: 'journal_tasbih_counts'
};

// Default Accent Color: Kaiser Sapphire
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
  { id: 'study_am', time: '05:20 - 06:20', label: 'Morning Deep Study (1h Actual Study)', tag: 'Academics' },
  { id: 'exercise', time: '06:20 - 06:40', label: 'Exercise & Movement (20m)', tag: 'Health' },
  { id: 'prep_breakfast', time: '07:10 - 07:30', label: 'Breakfast & Get Ready', tag: 'Routine' },
  { id: 'bus', time: '07:50 - 08:00', label: 'Bus / Commute', tag: 'Travel' },
  { id: 'school', time: '08:00 - 16:00', label: 'School', tag: 'School' },
  { id: 'decomp', time: '16:30 - 17:00', label: 'Decompress & Meal (Rest is fuel)', tag: 'Rest' },
  { id: 'nexttopper', time: '17:00 - 18:30', label: 'NextTopper Class', tag: 'Academics' },
  { id: 'homework', time: '18:30 - 19:00', label: 'Homework & School Revision', tag: 'Academics' },
  { id: 'arabic_study', time: '19:00 - 19:45', label: 'Arabic / 1h JEE Problem Sets', tag: 'Academics' },
  { id: 'self_improve_block', time: '19:45 - 20:30', label: '1h Self Improvement (Coding & Builds)', tag: 'Growth' },
  { id: 'family_sleep', time: '20:30', label: 'Family Time, Dinner & Sleep', tag: 'Family' }
];

// Weekend Template (Deep build & JEE prep schedule)
export const DEFAULT_WEEKEND_ROUTINE = [
  { id: 'fajr_we', time: '05:00', label: 'Fajr & Morning Gratitude', tag: 'Faith' },
  { id: 'jee_math_am', time: '06:00 - 07:30', label: '1h JEE & Math Problem Sets', tag: 'Academics' },
  { id: 'exercise_we', time: '07:30 - 08:15', label: 'Exercise & Movement', tag: 'Health' },
  { id: 'product_build', time: '09:00 - 12:30', label: '1h Self Improvement: Deep Coding & Builds', tag: 'Building' },
  { id: 'dhuhr_family', time: '13:00 - 14:30', label: 'Dhuhr Prayer & Family Lunch', tag: 'Family' },
  { id: 'reading_skill', time: '15:00 - 16:30', label: '1h Actual Study / Conceptual Reading', tag: 'Growth' },
  { id: 'sports_outdoor', time: '17:00 - 18:30', label: 'Outdoor Movement / Sports', tag: 'Rest' },
  { id: 'revision_plan', time: '19:00 - 20:00', label: 'Weekly Review & Week Ahead Plan', tag: 'Academics' },
  { id: 'wind_down_we', time: '21:00', label: 'Rest & Early Sleep', tag: 'Rest' }
];

// Initial Core Habits: The 5 Non-Negotiables
export const INITIAL_HABITS = [
  { id: 'prayers', name: '5 Prayers', category: 'Faith', description: 'Fajr, Dhuhr, Asr, Maghrib, Isha on time' },
  { id: 'exercise', name: 'Exercise', category: 'Health', description: '20 minutes of daily physical training' },
  { id: 'actual_studying', name: '1h Actual Studying (excluding h.w)', category: 'Academics', description: 'Deep conceptual study, not routine school homework' },
  { id: 'jee_prep', name: '1h JEE', category: 'Academics', description: 'Problem sets & foundation drills' },
  { id: 'self_improvement', name: '1 Hour Self Improvement', category: 'Growth', description: 'Coding, algorithms, building real projects, or reading' }
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

  // ── JEE FORMULA & THEOREM VAULT ──────────────────────────────────
  getFormulas() {
    const defaultFormulas = [
      { id: 'f_p1', subject: 'Physics', topic: 'Kinematics', name: 'Equations of Uniform Acceleration', formula: 'v = u + at \ns = ut + 0.5at² \nv² = u² + 2as', mastery: 'Mastered' },
      { id: 'f_p2', subject: 'Physics', topic: 'Gravitation', name: 'Universal Law of Gravitation', formula: 'F = G * (m₁ * m₂) / r²', mastery: 'Mastered' },
      { id: 'f_p3', subject: 'Physics', topic: 'Work & Energy', name: 'Kinetic & Potential Energy', formula: 'KE = 0.5 * m * v² \nPE = m * g * h \nW = F * s * cos(θ)', mastery: 'Learning' },
      { id: 'f_m1', subject: 'Mathematics', topic: 'Quadratic Equations', name: 'Quadratic Formula & Discriminant', formula: 'x = (-b ± √(b² - 4ac)) / (2a) \nD = b² - 4ac (D > 0 real, D = 0 equal, D < 0 imaginary)', mastery: 'Mastered' },
      { id: 'f_m2', subject: 'Mathematics', topic: 'Geometry / Mensuration', name: "Heron's Formula for Triangle Area", formula: 'A = √(s(s - a)(s - b)(s - c)) \nwhere s = (a + b + c) / 2', mastery: 'Mastered' },
      { id: 'f_m3', subject: 'Mathematics', topic: 'Algebra', name: 'Cubic Identities', formula: '(a + b)³ = a³ + b³ + 3ab(a + b) \n(a - b)³ = a³ - b³ - 3ab(a - b) \na³ + b³ = (a + b)(a² - ab + b²)', mastery: 'Learning' },
      { id: 'f_c1', subject: 'Chemistry', topic: 'Mole Concept', name: 'Avogadro & Molar Mass', formula: 'n = m / M = N / N_A \n(N_A = 6.022 × 10²³ particles/mol)', mastery: 'Mastered' }
    ];
    return safeJsonParse(STORAGE_KEYS.FORMULAS, defaultFormulas);
  },

  addFormula(item) {
    const list = this.getFormulas();
    const id = 'f_' + Date.now().toString(36);
    const newItem = { ...item, id, mastery: item.mastery || 'Learning' };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.FORMULAS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newItem;
  },

  toggleFormulaMastery(id) {
    const list = this.getFormulas();
    const item = list.find(f => f.id === id);
    if (item) {
      item.mastery = item.mastery === 'Mastered' ? 'Learning' : 'Mastered';
      localStorage.setItem(STORAGE_KEYS.FORMULAS, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  deleteFormula(id) {
    let list = this.getFormulas();
    list = list.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FORMULAS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── SOFTWARE & BUILD PROJECTS LIST ───────────────────────────────
  getProjectsList() {
    const defaultProjects = [
      { id: 'proj1', name: 'Journal Web App', category: 'Web App', tech: 'React, Vite, Tailwind', status: 'In Progress', description: 'Personal high-performance self-improvement OS', link: 'https://github.com/azanabdullah2752012-ui/nuvio' },
      { id: 'proj2', name: 'ESP32 Robotics Platform', category: 'Hardware/Robotics', tech: 'C++, ESP32, FreeRTOS', status: 'Planned', description: 'Robotics controller & sensor telemetrics', link: '' }
    ];
    return safeJsonParse(STORAGE_KEYS.PROJECTS_LIST, defaultProjects);
  },

  addProject(item) {
    const list = this.getProjectsList();
    const id = 'proj_' + Date.now().toString(36);
    const newItem = { ...item, id, date: item.date || getTodayKey() };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newItem;
  },

  toggleProjectStatus(id) {
    const list = this.getProjectsList();
    const item = list.find(p => p.id === id);
    if (item) {
      item.status = item.status === 'Completed' ? 'In Progress' : 'Completed';
      localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  deleteProject(id) {
    let list = this.getProjectsList();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // Backwards compatibility stub for favors
  getFavors() {
    return [];
  },
  addFavor() {},
  toggleFavorStatus() {},
  deleteFavor() {},

  // ── SPELLING & TERMINOLOGY PRECISION VAULT ────────────────────────
  getSpellingList() {
    const defaultSpelling = [
      { id: 'sp1', word: 'Simultaneous', context: 'Simultaneous linear equations in two variables', mastered: true },
      { id: 'sp2', word: 'Photosynthesis', context: 'Biology chlorophyll energy conversion', mastered: true },
      { id: 'sp3', word: 'Acceleration', context: 'Rate of change of velocity (a = dv/dt)', mastered: false },
      { id: 'sp4', word: 'Endoplasmic Reticulum', context: 'Cell biology smooth & rough organelles', mastered: false },
      { id: 'sp5', word: 'Discriminant', context: 'b² - 4ac in quadratic formula', mastered: true }
    ];
    return safeJsonParse(STORAGE_KEYS.SPELLING, defaultSpelling);
  },

  addSpellingWord(item) {
    const list = this.getSpellingList();
    const id = 'sp_' + Date.now().toString(36);
    const newItem = { ...item, id, mastered: false };
    list.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.SPELLING, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newItem;
  },

  toggleSpellingMastered(id) {
    const list = this.getSpellingList();
    const item = list.find(s => s.id === id);
    if (item) {
      item.mastered = !item.mastered;
      localStorage.setItem(STORAGE_KEYS.SPELLING, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  deleteSpellingWord(id) {
    let list = this.getSpellingList();
    list = list.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SPELLING, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── CHENNAI PRAYER TIMES & SUNNAH RADAR ───────────────────────────
  getPrayerTimes() {
    // Chennai approximate schedule
    return [
      { id: 'fajr', name: 'Fajr', time: '05:00', icon: 'Sun' },
      { id: 'dhuhr', name: 'Dhuhr', time: '12:05', icon: 'Sun' },
      { id: 'asr', name: 'Asr', time: '15:20', icon: 'Sun' },
      { id: 'maghrib', name: 'Maghrib', time: '17:50', icon: 'Moon' },
      { id: 'isha', name: 'Isha', time: '19:05', icon: 'Moon' }
    ];
  },

  getPrayerLog(dateKey = getTodayKey()) {
    const all = safeJsonParse(STORAGE_KEYS.PRAYER_LOGS, {});
    return all[dateKey] || {
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      tahajjud: false,
      duha: false,
      witr: false
    };
  },

  togglePrayer(dateKey, prayerKey) {
    const all = safeJsonParse(STORAGE_KEYS.PRAYER_LOGS, {});
    if (!all[dateKey]) {
      all[dateKey] = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, tahajjud: false, duha: false, witr: false };
    }
    all[dateKey][prayerKey] = !all[dateKey][prayerKey];
    localStorage.setItem(STORAGE_KEYS.PRAYER_LOGS, JSON.stringify(all));
    window.dispatchEvent(new Event('journal_data_update'));
    return all[dateKey][prayerKey];
  },

  // ── DISCIPLINE BOARD & IRON PROTOCOLS ────────────────────────────
  getIronRules() {
    const defaultRules = [
      { id: 'r1', rule: 'Anchor to Fajr (05:00 AM)', detail: 'Never hit snooze. Win the morning, control the day.' },
      { id: 'r2', rule: '1h Actual Study: Phone Out of Sight', detail: 'Zero multitasking. Deep problem solving only, excluding homework.' },
      { id: 'r3', rule: '1h JEE Daily Volume', detail: 'Solve hard problems daily. Consistency crushes last-minute panic.' },
      { id: 'r4', rule: 'Ship Before Starting Next Build', detail: 'Focus on one project until it is delivered. Kill shiny-object syndrome.' },
      { id: 'r5', rule: 'Rest is Fuel, Not Slacking', detail: 'Sleep and family dinner are essential recovery. Burnout is for amateurs.' }
    ];
    return safeJsonParse(STORAGE_KEYS.IRON_RULES, defaultRules);
  },

  addIronRule(rule, detail = '') {
    const list = this.getIronRules();
    const id = 'r_' + Date.now().toString(36);
    const newRule = { id, rule, detail };
    list.push(newRule);
    localStorage.setItem(STORAGE_KEYS.IRON_RULES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newRule;
  },

  deleteIronRule(id) {
    let list = this.getIronRules();
    list = list.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.IRON_RULES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  getRealityCheckLines() {
    const defaultLines = [
      "Right now, someone aiming for top rank in JEE is solving Physics problems while you are thinking about slacking off.",
      "You said you wanted 90%+ and JEE foundation. Excuses don't build rank—daily volume does.",
      "Fajr was at 5:00 AM. Show up like someone who has real ambition.",
      "The 5-minute rule: Put the phone face-down in another room. Open the book for just 5 minutes.",
      "A 10-second impulse to scroll isn't worth throwing away your day's momentum.",
      "Nobody cares about your excuses. Only results count."
    ];
    return safeJsonParse(STORAGE_KEYS.REALITY_CHECKS, defaultLines);
  },

  addRealityCheckLine(line) {
    const list = this.getRealityCheckLines();
    list.push(line);
    localStorage.setItem(STORAGE_KEYS.REALITY_CHECKS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  deleteRealityCheckLine(index) {
    let list = this.getRealityCheckLines();
    list = list.filter((_, i) => i !== index);
    localStorage.setItem(STORAGE_KEYS.REALITY_CHECKS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // The 5 Non-Negotiables Daily Discipline Standard
  getDisciplineChecks(dateKey = getTodayKey()) {
    const defaultChecks = [
      { id: 'dc_prayers', label: '5 Daily Prayers on Time (Fajr, Dhuhr, Asr, Maghrib, Isha)' },
      { id: 'dc_exercise', label: 'Daily Exercise Completed (20m movement / training)' },
      { id: 'dc_study', label: '1h Actual Deep Study (Excluding school homework)' },
      { id: 'dc_jee', label: '1h JEE Preparation (Problems solved & concepts drilled)' },
      { id: 'dc_growth', label: '1 Hour Self Improvement (Coding, building, or reading)' }
    ];
    const all = safeJsonParse(STORAGE_KEYS.DISCIPLINE_CHECKS, {});
    const dayData = all[dateKey] || {};
    return defaultChecks.map(c => ({
      ...c,
      completed: !!dayData[c.id]
    }));
  },

  toggleDisciplineCheck(dateKey, checkId) {
    const all = safeJsonParse(STORAGE_KEYS.DISCIPLINE_CHECKS, {});
    if (!all[dateKey]) all[dateKey] = {};
    all[dateKey][checkId] = !all[dateKey][checkId];
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE_CHECKS, JSON.stringify(all));

    // Also sync with habit logs if matching
    const habitMap = {
      'dc_prayers': 'prayers',
      'dc_exercise': 'exercise',
      'dc_study': 'actual_studying',
      'dc_jee': 'jee_prep',
      'dc_growth': 'self_improvement'
    };
    if (habitMap[checkId]) {
      const hLogs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
      if (!hLogs[dateKey]) hLogs[dateKey] = { completed: {}, isRestDay: false };
      hLogs[dateKey].completed[habitMap[checkId]] = all[dateKey][checkId];
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(hLogs));
    }

    window.dispatchEvent(new Event('journal_data_update'));
    return all[dateKey][checkId];
  },

  // ── STUDY SESSIONS LOG (1H STUDY & 1H JEE) ────────────────────────
  getStudySessions() {
    const defaultSessions = [
      { id: 'ss1', date: getTodayKey(), type: 'Actual Study', subject: 'Mathematics', topic: 'Quadrilaterals & Lines', durationMins: 60 },
      { id: 'ss2', date: getTodayKey(), type: 'JEE Prep', subject: 'Physics', topic: 'Equations of Motion (v = u + at)', durationMins: 60 }
    ];
    return safeJsonParse(STORAGE_KEYS.STUDY_SESSIONS, defaultSessions);
  },

  addStudySession(session) {
    const list = this.getStudySessions();
    const id = 'ss_' + Date.now().toString(36);
    const newSession = { ...session, id, date: session.date || getTodayKey() };
    list.unshift(newSession);
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newSession;
  },

  deleteStudySession(id) {
    let list = this.getStudySessions();
    list = list.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── WEEKLY STUDY HOURS & ANALYTICS AGGREGATOR ─────────────────────
  getWeeklyStudyStats() {
    const days = [];
    const today = new Date();
    const sessions = this.getStudySessions();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getTodayKey(d);
      const daySessions = sessions.filter(s => s.date === key);

      const actualMins = daySessions.filter(s => s.type === 'Actual Study').reduce((acc, s) => acc + (s.durationMins || 0), 0);
      const jeeMins = daySessions.filter(s => s.type === 'JEE Prep').reduce((acc, s) => acc + (s.durationMins || 0), 0);
      const totalMins = actualMins + jeeMins;

      days.push({
        dateKey: key,
        dayLabel: d.toLocaleDateString([], { weekday: 'short' }),
        actualMins,
        jeeMins,
        totalHours: Number((totalMins / 60).toFixed(1)),
        isToday: key === getTodayKey()
      });
    }
    return days;
  },

  // ── DISCIPLINE TIER & RANK PROGRESSION ─────────────────────────────
  getDisciplineRank() {
    const activity = this.getPast30DaysActivity();
    const recent7 = activity.slice(-7);
    const avgScore = recent7.reduce((acc, d) => acc + (d.habitsDone || 0), 0) / (7 * 5); // 0 to 1
    const percent = Math.round(avgScore * 100);

    let rank = 'Novice';
    let nextRank = 'Iron Standard';
    let color = '#94a3b8';
    let minPct = 0;
    let nextPct = 25;

    if (percent >= 90) {
      rank = 'Apex Topper';
      nextRank = 'Legendary';
      color = '#38bdf8';
      minPct = 90;
      nextPct = 100;
    } else if (percent >= 75) {
      rank = 'Gold Discipline';
      nextRank = 'Apex Topper';
      color = '#f59e0b';
      minPct = 75;
      nextPct = 90;
    } else if (percent >= 60) {
      rank = 'Silver Focused';
      nextRank = 'Gold Discipline';
      color = '#a855f7';
      minPct = 60;
      nextPct = 75;
    } else if (percent >= 40) {
      rank = 'Bronze Grind';
      nextRank = 'Silver Focused';
      color = '#10b981';
      minPct = 40;
      nextPct = 60;
    } else if (percent >= 20) {
      rank = 'Iron Standard';
      nextRank = 'Bronze Grind';
      color = '#64748b';
      minPct = 20;
      nextPct = 40;
    }

    return {
      rank,
      nextRank,
      percent,
      color,
      progressInTier: Math.min(100, Math.max(0, Math.round(((percent - minPct) / (nextPct - minPct || 1)) * 100)))
    };
  },

  // ── TODAY VS YESTERDAY DISCIPLINE DUEL ─────────────────────────────
  getYesterdayVsToday() {
    const today = new Date();
    const todayKey = getTodayKey(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = getTodayKey(yesterday);

    const todayChecks = this.getDisciplineChecks(todayKey).filter(c => c.completed).length;
    const yesterdayChecks = this.getDisciplineChecks(yesterdayKey).filter(c => c.completed).length;

    const allSessions = this.getStudySessions();
    const todayStudyMins = allSessions.filter(s => s.date === todayKey).reduce((acc, s) => acc + (s.durationMins || 0), 0);
    const yesterdayStudyMins = allSessions.filter(s => s.date === yesterdayKey).reduce((acc, s) => acc + (s.durationMins || 0), 0);

    return {
      todayChecks,
      yesterdayChecks,
      checksDiff: todayChecks - yesterdayChecks,
      todayStudyHours: (todayStudyMins / 60).toFixed(1),
      yesterdayStudyHours: (yesterdayStudyMins / 60).toFixed(1)
    };
  },

  // ── DIGITAL TASBIH & DHIKR TACTILE COUNTER ────────────────────────
  getTasbihCounts() {
    const defaultCounts = {
      subhanallah: 0,
      alhamdulillah: 0,
      allahuakbar: 0,
      astaghfirullah: 0,
      lailahaillallah: 0
    };
    return safeJsonParse(STORAGE_KEYS.TASBIH, defaultCounts);
  },

  incrementTasbih(key) {
    const counts = this.getTasbihCounts();
    counts[key] = (counts[key] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.TASBIH, JSON.stringify(counts));
    window.dispatchEvent(new Event('journal_data_update'));
    return counts[key];
  },

  resetTasbih(key) {
    const counts = this.getTasbihCounts();
    if (key) {
      counts[key] = 0;
    } else {
      Object.keys(counts).forEach(k => counts[k] = 0);
    }
    localStorage.setItem(STORAGE_KEYS.TASBIH, JSON.stringify(counts));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  getDisciplinePledges() {
    const defaultPledges = [
      {
        id: 'p1',
        title: '7-Day Zero Careless Math Errors Drill',
        targetDays: 7,
        daysCompleted: [true, true, true, false, false, false, false],
        active: true,
        reward: 'Order electronics parts or special weekend treat'
      },
      {
        id: 'p2',
        title: '7-Day 5:00 AM Fajr Lock-In',
        targetDays: 7,
        daysCompleted: [true, true, true, true, false, false, false],
        active: true,
        reward: 'Full Sunday morning coding session guilt-free'
      }
    ];
    return safeJsonParse(STORAGE_KEYS.DISCIPLINE_PLEDGES, defaultPledges);
  },

  togglePledgeDay(pledgeId, dayIndex) {
    const list = this.getDisciplinePledges();
    const pledge = list.find(p => p.id === pledgeId);
    if (pledge && pledge.daysCompleted) {
      pledge.daysCompleted[dayIndex] = !pledge.daysCompleted[dayIndex];
      localStorage.setItem(STORAGE_KEYS.DISCIPLINE_PLEDGES, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  addPledge(pledge) {
    const list = this.getDisciplinePledges();
    const id = 'pledge_' + Date.now().toString(36);
    const newPledge = {
      ...pledge,
      id,
      daysCompleted: [false, false, false, false, false, false, false],
      active: true
    };
    list.unshift(newPledge);
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE_PLEDGES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
    return newPledge;
  },

  deletePledge(id) {
    let list = this.getDisciplinePledges();
    list = list.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE_PLEDGES, JSON.stringify(list));
    window.dispatchEvent(new Event('journal_data_update'));
  },

  // ── CLASS 9 & JEE SYLLABUS TRACKER ────────────────────────────────
  getSyllabus() {
    const defaultSyllabus = [
      { id: 'm_ch1', subject: 'Mathematics', chapter: 'Number Systems', status: 'Mastered' },
      { id: 'm_ch2', subject: 'Mathematics', chapter: 'Polynomials', status: 'Mastered' },
      { id: 'm_ch3', subject: 'Mathematics', chapter: 'Coordinate Geometry', status: 'Mastered' },
      { id: 'm_ch4', subject: 'Mathematics', chapter: 'Linear Equations in Two Variables', status: 'In Progress' },
      { id: 'm_ch5', subject: 'Mathematics', chapter: 'Lines and Angles', status: 'Mastered' },
      { id: 'm_ch6', subject: 'Mathematics', chapter: 'Triangles', status: 'In Progress' },
      { id: 'm_ch7', subject: 'Mathematics', chapter: 'Quadrilaterals', status: 'Needs Practice' },
      { id: 'm_ch8', subject: 'Mathematics', chapter: 'Circles', status: 'In Progress' },
      { id: 'm_ch9', subject: 'Mathematics', chapter: "Heron's Formula", status: 'Mastered' },
      { id: 'm_ch10', subject: 'Mathematics', chapter: 'Surface Areas and Volumes', status: 'Needs Practice' },
      { id: 'm_ch11', subject: 'Mathematics', chapter: 'Statistics', status: 'Mastered' },

      { id: 's_p1', subject: 'Physics', chapter: 'Motion & Equations', status: 'Mastered' },
      { id: 's_p2', subject: 'Physics', chapter: 'Force & Laws of Motion', status: 'Mastered' },
      { id: 's_p3', subject: 'Physics', chapter: 'Gravitation', status: 'In Progress' },
      { id: 's_p4', subject: 'Physics', chapter: 'Work and Energy', status: 'In Progress' },
      { id: 's_p5', subject: 'Physics', chapter: 'Sound', status: 'Needs Practice' },

      { id: 's_c1', subject: 'Chemistry', chapter: 'Matter in Our Surroundings', status: 'Mastered' },
      { id: 's_c2', subject: 'Chemistry', chapter: 'Is Matter Around Us Pure', status: 'Mastered' },
      { id: 's_c3', subject: 'Chemistry', chapter: 'Atoms and Molecules (Mole Concept)', status: 'In Progress' },
      { id: 's_c4', subject: 'Chemistry', chapter: 'Structure of the Atom', status: 'In Progress' },

      { id: 's_b1', subject: 'Biology', chapter: 'The Fundamental Unit of Life (Cell)', status: 'Mastered' },
      { id: 's_b2', subject: 'Biology', chapter: 'Tissues', status: 'In Progress' },
      { id: 's_b3', subject: 'Biology', chapter: 'Improvement in Food Resources', status: 'Needs Practice' }
    ];
    return safeJsonParse(STORAGE_KEYS.SYLLABUS, defaultSyllabus);
  },

  toggleSyllabusStatus(id) {
    const list = this.getSyllabus();
    const item = list.find(s => s.id === id);
    if (item) {
      if (item.status === 'Needs Practice') item.status = 'In Progress';
      else if (item.status === 'In Progress') item.status = 'Mastered';
      else item.status = 'Needs Practice';
      localStorage.setItem(STORAGE_KEYS.SYLLABUS, JSON.stringify(list));
      window.dispatchEvent(new Event('journal_data_update'));
    }
  },

  // ── 30-DAY CONSISTENCY & HABIT HEATMAP ────────────────────────────
  getPast30DaysActivity() {
    const list = [];
    const today = new Date();
    const habitLogs = safeJsonParse(STORAGE_KEYS.HABIT_LOGS, {});
    const routineLogs = safeJsonParse(STORAGE_KEYS.ROUTINE_LOGS, {});
    const focusSessions = safeJsonParse(STORAGE_KEYS.FOCUS_SESSIONS, []);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getTodayKey(d);

      const hLog = habitLogs[key];
      const habitsDone = hLog?.isRestDay ? 5 : Object.values(hLog?.completed || {}).filter(Boolean).length;
      const rLog = routineLogs[key] || {};
      const routineDone = Object.values(rLog).filter(Boolean).length;
      const focusMins = focusSessions.filter(s => s.date === key).reduce((acc, s) => acc + (s.minutes || 0), 0);

      const score = (habitsDone * 2) + routineDone + (focusMins > 30 ? 3 : 0);
      let level = 0;
      if (score > 12) level = 4;
      else if (score > 8) level = 3;
      else if (score > 4) level = 2;
      else if (score > 0) level = 1;

      list.push({
        dateKey: key,
        dayName: d.toLocaleDateString([], { weekday: 'narrow' }),
        dayNum: d.getDate(),
        level,
        score,
        habitsDone,
        focusMins
      });
    }
    return list;
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
      activeProject: this.getActiveProject(),
      projectsList: this.getProjectsList(),
      ideaVault: this.getIdeaVault(),
      equationDrills: this.getEquationDrills(),
      examCountdowns: this.getExamCountdowns(),
      scratchpad: this.getScratchpad(),
      focusSessions: this.getFocusSessions(),
      studySessions: this.getStudySessions(),
      ironRules: this.getIronRules(),
      realityChecks: this.getRealityCheckLines(),
      disciplineChecks: safeJsonParse(STORAGE_KEYS.DISCIPLINE_CHECKS, {}),
      disciplinePledges: this.getDisciplinePledges()
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
      if (data.activeProject) localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, JSON.stringify(data.activeProject));
      if (data.projectsList) localStorage.setItem(STORAGE_KEYS.PROJECTS_LIST, JSON.stringify(data.projectsList));
      if (data.ideaVault) localStorage.setItem(STORAGE_KEYS.IDEA_VAULT, JSON.stringify(data.ideaVault));
      if (data.equationDrills) localStorage.setItem(STORAGE_KEYS.EQUATION_FORGE, JSON.stringify(data.equationDrills));
      if (data.examCountdowns) localStorage.setItem(STORAGE_KEYS.EXAM_COUNTDOWNS, JSON.stringify(data.examCountdowns));
      if (data.scratchpad) localStorage.setItem(STORAGE_KEYS.SCRATCHPAD, data.scratchpad);
      if (data.focusSessions) localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(data.focusSessions));
      if (data.studySessions) localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(data.studySessions));
      if (data.ironRules) localStorage.setItem(STORAGE_KEYS.IRON_RULES, JSON.stringify(data.ironRules));
      if (data.realityChecks) localStorage.setItem(STORAGE_KEYS.REALITY_CHECKS, JSON.stringify(data.realityChecks));
      if (data.disciplineChecks) localStorage.setItem(STORAGE_KEYS.DISCIPLINE_CHECKS, JSON.stringify(data.disciplineChecks));
      if (data.disciplinePledges) localStorage.setItem(STORAGE_KEYS.DISCIPLINE_PLEDGES, JSON.stringify(data.disciplinePledges));

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

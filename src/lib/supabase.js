// Local-First Mock Supabase Client
// Decoupled from all external services & remote databases.
// Runs completely offline using in-memory and localStorage persistence.

const STORAGE_KEY = 'acadevance_local_db';
const USER_KEY = 'acadevance_user';

const getDefaultUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return {
    id: 'scholar-local-01',
    email: 'scholar@local.dev',
    full_name: 'Alex Scholar',
    avatar_emoji: '⚡',
    level: 5,
    xp: 1450,
    era_tokens: 2500,
    role: 'admin',
    grade_level: '9th',
    onboarding_completed: true,
    last_activity_date: new Date().toISOString(),
    streak: 3,
    achievements: ['scholar_initiate', 'first_steps', 'focus_first', 'streak_3'],
    stats_focus_sessions: 6,
    stats_flashcards_reviewed: 42,
    stats_quizzes_correct: 28,
    stats_math_completed: 8,
    stats_science_completed: 6,
    stats_social_completed: 4,
    stats_homework_completed: 5,
    stats_boss_defeated: 1,
    stats_quests_completed: 4,
    login_streak: 3,
    last_login_reward_date: new Date().toISOString(),
    unlocked_avatars: ['⚡', '🎓', '🚀', '🧠', '👑', '🔥'],
    claimed_season_tiers: [1],
    boss_chapter_progress: {
      dragon:    { hp: 350, max: 1000,  status: 'active',  claimed: false },
      algebra:   { hp: 2500, max: 2500,  status: 'locked',  claimed: false },
      geometry:  { hp: 4000, max: 4000,  status: 'locked',  claimed: false },
      cell:      { hp: 1500, max: 1500,  status: 'active',  claimed: false },
      motion:    { hp: 3000, max: 3000,  status: 'locked',  claimed: false },
      atom:      { hp: 5000, max: 5000,  status: 'locked',  claimed: false },
      empire:    { hp: 2000, max: 2000,  status: 'active',  claimed: false },
      leviathan: { hp: 6000, max: 6000,  status: 'locked',  claimed: false },
    }
  };
};

const getInitialDB = () => {
  const defaultUser = getDefaultUser();
  return {
    profiles: [
      defaultUser,
      {
        id: 'mock-aarav',
        full_name: 'Aarav Sharma',
        avatar_emoji: '🦁',
        level: 12,
        xp: 4250,
        era_tokens: 1800,
        grade_level: '9th',
        role: 'student',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-diya',
        full_name: 'Diya Patel',
        avatar_emoji: '🦊',
        level: 26,
        xp: 15400,
        era_tokens: 6200,
        grade_level: '9th',
        role: 'student',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-ishaan',
        full_name: 'Ishaan Verma',
        avatar_emoji: '🐼',
        level: 7,
        xp: 850,
        era_tokens: 450,
        grade_level: '9th',
        role: 'student',
        updated_at: new Date(Date.now() - 3600000).toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: 'mock-ananya',
        full_name: 'Ananya Iyer',
        avatar_emoji: '🦉',
        level: 18,
        xp: 8900,
        era_tokens: 3400,
        grade_level: '9th',
        role: 'student',
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ],
    tasks: [
      {
        id: 't-1',
        title: 'Complete Number Systems Practice',
        subject: 'Math',
        due: 'Today',
        priority: 'High',
        completed: false,
        user_id: defaultUser.id,
        created_at: new Date().toISOString()
      },
      {
        id: 't-2',
        title: 'Review Motion Laws Flashcards',
        subject: 'Physics',
        due: 'Tomorrow',
        priority: 'Medium',
        completed: false,
        user_id: defaultUser.id,
        created_at: new Date().toISOString()
      },
      {
        id: 't-3',
        title: 'Cell Structure Quiz Prep',
        subject: 'Biology',
        due: 'In 2 days',
        priority: 'Low',
        completed: true,
        user_id: defaultUser.id,
        created_at: new Date().toISOString()
      }
    ],
    decks: [
      {
        id: 'd-1',
        user_id: defaultUser.id,
        title: 'Grade 9 Math: Coordinate Geometry',
        subject: 'Math',
        cards: [
          { front: 'What is the Origin?', back: 'The intersection point of x and y axes: (0, 0).' },
          { front: 'What is the Abscissa?', back: 'The x-coordinate of a point.' },
          { front: 'What is the Ordinate?', back: 'The y-coordinate of a point.' }
        ],
        created_at: new Date().toISOString()
      },
      {
        id: 'd-2',
        user_id: defaultUser.id,
        title: 'Physics: Newton’s Laws',
        subject: 'Science',
        cards: [
          { front: 'Newton’s 1st Law', back: 'An object remains at rest or in uniform motion unless acted upon by a net external force.' },
          { front: 'Formula for Force', back: 'F = m * a (Force = Mass × Acceleration)' }
        ],
        created_at: new Date().toISOString()
      }
    ],
    messages: [
      {
        id: 'm-1',
        sender_id: 'mock-diya',
        recipient_id: defaultUser.id,
        content: 'Hey Alex! Ready for the math boss raid tonight?',
        is_read: false,
        created_at: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        id: 'm-2',
        sender_id: 'mock-aarav',
        recipient_id: defaultUser.id,
        content: 'Check out the new flashcards I added in the CBSE hub.',
        is_read: true,
        created_at: new Date(Date.now() - 120 * 60000).toISOString()
      }
    ],
    group_memberships: [
      {
        id: 'gm-1',
        group_id: 'grp-9th-cbse',
        group_name: 'Grade 9 Elite Vanguard',
        user_id: defaultUser.id,
        role: 'leader',
        created_at: new Date().toISOString()
      }
    ],
    game_matches: [
      {
        id: 'match-1',
        user_id: defaultUser.id,
        game_type: 'trivia',
        score: 95,
        xp_earned: 150,
        created_at: new Date().toISOString()
      }
    ],
    xp_logs: [
      {
        id: 'xp-1',
        user_id: defaultUser.id,
        amount: 150,
        reason: 'Trivia Match Victory',
        category: 'game',
        created_at: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        id: 'xp-2',
        user_id: defaultUser.id,
        amount: 100,
        reason: 'Daily Focus Session',
        category: 'streak',
        created_at: new Date(Date.now() - 240 * 60000).toISOString()
      }
    ],
    focus_sessions: [
      {
        id: 'fs-1',
        user_id: defaultUser.id,
        duration_minutes: 25,
        subject: 'Math',
        created_at: new Date().toISOString()
      }
    ],
    inventory: [
      {
        id: 'inv-1',
        user_id: defaultUser.id,
        item_id: 'streak_shield',
        name: 'Streak Aegis',
        created_at: new Date().toISOString()
      }
    ],
    system_config: [
      { key: 'xp_rate', value: '1.0' },
      { key: 'maintenance_mode', value: 'false' },
      { key: 'version', value: '2.0.0-offline' }
    ],
    admin_logs: [
      {
        id: 'al-1',
        admin_id: defaultUser.id,
        action: 'SYSTEM_BOOT',
        details: 'Offline mode active with local persistence.',
        created_at: new Date().toISOString()
      }
    ],
    view_suspicious_activity: []
  };
};

const getLocalDB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  const initial = getInitialDB();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveLocalDB = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.warn("Could not write to local DB:", e);
  }
};

class LocalQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orders = [];
    this.limitVal = null;
    this.isSingle = false;
    this.isMaybeSingle = false;
    this.isCountOnly = false;
    this.selectedFields = '*';
    this.mutationType = 'select'; // 'select' | 'insert' | 'update' | 'delete'
    this.mutationPayload = null;
  }

  select(fields = '*', options = {}) {
    this.selectedFields = fields;
    if (options.count) {
      this.isCountOnly = true;
    }
    return this;
  }

  insert(rows) {
    this.mutationType = 'insert';
    this.mutationPayload = Array.isArray(rows) ? rows : [rows];
    return this;
  }

  update(fields) {
    this.mutationType = 'update';
    this.mutationPayload = fields;
    return this;
  }

  delete() {
    this.mutationType = 'delete';
    return this;
  }

  eq(col, val) {
    this.filters.push((item) => item[col] === val);
    return this;
  }

  neq(col, val) {
    this.filters.push((item) => item[col] !== val);
    return this;
  }

  gt(col, val) {
    this.filters.push((item) => item[col] > val);
    return this;
  }

  gte(col, val) {
    this.filters.push((item) => item[col] >= val);
    return this;
  }

  lt(col, val) {
    this.filters.push((item) => item[col] < val);
    return this;
  }

  lte(col, val) {
    this.filters.push((item) => item[col] <= val);
    return this;
  }

  in(col, vals) {
    const set = new Set(vals);
    this.filters.push((item) => set.has(item[col]));
    return this;
  }

  or(conditionStr) {
    // Basic support for ilike / eq comma-separated or groups
    return this;
  }

  ilike(col, pattern) {
    const cleanPattern = pattern.replace(/%/g, '').toLowerCase();
    this.filters.push((item) => String(item[col] || '').toLowerCase().includes(cleanPattern));
    return this;
  }

  like(col, pattern) {
    const cleanPattern = pattern.replace(/%/g, '');
    this.filters.push((item) => String(item[col] || '').includes(cleanPattern));
    return this;
  }

  order(col, options = {}) {
    this.orders.push({ col, ascending: options.ascending !== false });
    return this;
  }

  limit(n) {
    this.limitVal = n;
    return this;
  }

  range(from, to) {
    this.limitVal = to - from + 1;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  _execute() {
    const db = getLocalDB();
    if (!db[this.table]) {
      db[this.table] = [];
    }

    if (this.mutationType === 'insert') {
      const inserted = this.mutationPayload.map((item) => ({
        id: item.id || 'id-' + Math.random().toString(36).substr(2, 9),
        created_at: item.created_at || new Date().toISOString(),
        ...item
      }));
      db[this.table].unshift(...inserted);
      saveLocalDB(db);
      return {
        data: this.isSingle ? inserted[0] : inserted,
        error: null,
        count: inserted.length
      };
    }

    if (this.mutationType === 'update') {
      let updatedCount = 0;
      let lastUpdated = null;
      db[this.table] = db[this.table].map((item) => {
        const matches = this.filters.every((f) => f(item));
        if (matches) {
          updatedCount++;
          const merged = { ...item, ...this.mutationPayload, updated_at: new Date().toISOString() };
          lastUpdated = merged;
          return merged;
        }
        return item;
      });
      saveLocalDB(db);
      return {
        data: this.isSingle ? lastUpdated : (lastUpdated ? [lastUpdated] : []),
        error: null,
        count: updatedCount
      };
    }

    if (this.mutationType === 'delete') {
      const beforeLen = db[this.table].length;
      db[this.table] = db[this.table].filter((item) => !this.filters.every((f) => f(item)));
      const count = beforeLen - db[this.table].length;
      saveLocalDB(db);
      return { data: null, error: null, count };
    }

    // Default: 'select'
    let results = [...db[this.table]];
    for (const filter of this.filters) {
      results = results.filter(filter);
    }

    for (const order of this.orders) {
      results.sort((a, b) => {
        const va = a[order.col];
        const vb = b[order.col];
        if (va < vb) return order.ascending ? -1 : 1;
        if (va > vb) return order.ascending ? 1 : -1;
        return 0;
      });
    }

    const totalCount = results.length;

    if (this.limitVal !== null) {
      results = results.slice(0, this.limitVal);
    }

    let finalData = results;
    if (this.isSingle) {
      finalData = results[0] || null;
    } else if (this.isMaybeSingle) {
      finalData = results[0] || null;
    }

    return {
      data: finalData,
      error: null,
      count: totalCount
    };
  }

  // Promise interface so it can be awaited directly: await supabase.from(...)
  then(resolve, reject) {
    try {
      const res = this._execute();
      resolve(res);
    } catch (e) {
      resolve({ data: null, error: e, count: 0 });
    }
  }
}

class LocalChannel {
  constructor(name) {
    this.name = name;
  }
  on() {
    return this;
  }
  subscribe(callback) {
    if (typeof callback === 'function') {
      setTimeout(() => callback('SUBSCRIBED'), 0);
    }
    return this;
  }
}

export const supabase = {
  auth: {
    getSession: async () => {
      const user = getDefaultUser();
      return {
        data: {
          session: {
            user,
            access_token: 'local-access-token',
            expires_at: 9999999999
          }
        },
        error: null
      };
    },
    getUser: async () => {
      return {
        data: { user: getDefaultUser() },
        error: null
      };
    },
    onAuthStateChange: (callback) => {
      // Execute immediately with local session
      const user = getDefaultUser();
      if (typeof callback === 'function') {
        setTimeout(() => {
          callback('SIGNED_IN', { user, access_token: 'local-token' });
        }, 0);
      }
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async () => ({
      data: { user: getDefaultUser(), session: { user: getDefaultUser() } },
      error: null
    }),
    signInWithOAuth: async () => ({
      data: { url: null },
      error: null
    }),
    signInAnonymously: async () => ({
      data: { user: getDefaultUser(), session: { user: getDefaultUser() } },
      error: null
    }),
    signOut: async () => ({
      error: null
    })
  },

  from: (table) => new LocalQueryBuilder(table),

  rpc: async (fnName, args = {}) => {
    const user = getDefaultUser();
    if (fnName === 'rpc_award_xp') {
      const xpToAdd = args.amount_to_add || 0;
      const newXp = (user.xp || 0) + xpToAdd;
      const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);
      const leveledUp = newLevel > (user.level || 1);
      user.xp = newXp;
      user.level = newLevel;
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {}
      return {
        data: {
          success: true,
          leveled_up: leveledUp,
          profile: user
        },
        error: null
      };
    }

    if (fnName === 'rpc_add_tokens') {
      const tokensToAdd = args.amount_to_add || 0;
      user.era_tokens = (user.era_tokens || 0) + tokensToAdd;
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {}
      return {
        data: {
          success: true,
          profile: user
        },
        error: null
      };
    }

    if (fnName === 'rpc_get_admin_stats') {
      return {
        data: {
          total_users: 148,
          active_today: 42,
          total_xp: 489500,
          system_health: 'Optimal (Local Engine)'
        },
        error: null
      };
    }

    if (fnName === 'rpc_admin_user_action') {
      return {
        data: { success: true },
        error: null
      };
    }

    return { data: { success: true }, error: null };
  },

  channel: (name) => new LocalChannel(name),
  removeChannel: () => {}
};

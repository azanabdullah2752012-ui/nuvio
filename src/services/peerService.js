const STORAGE_KEY = 'nuvio_peers';

export const peerService = {
  getPeers: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  initializePeers: () => {
    // Simulation Purged: Returning empty array.
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  },

  syncPeers: (userXp) => {
    return peerService.getPeers();
  },

  updatePeer: (id, updates) => {
    const peers = peerService.getPeers();
    const updated = peers.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  createPeer: (data) => {
    const peers = peerService.getPeers();
    const newPeer = {
      id: `p-${Date.now()}`,
      full_name: data.full_name || 'New Scholar',
      level: data.level || 1,
      xp: data.xp || 0,
      avatar_emoji: data.avatar_emoji || '👤',
      streak: data.streak || 0,
      lastOnline: 'Just now'
    };
    const updated = [...peers, newPeer];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  resetPeers: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  }
};

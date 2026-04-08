const STORAGE_KEY = 'nuvio_peers';

const GAMER_TAGS = [
  'ZodiacMaster', 'StudySage', 'NovaPhantom', 'QuantumLeap', 
  'CortexCrusher', 'PixelProfessor', 'ZenithLearner', 'AuraArchon',
  'NeonNinja', 'BinaryBard', 'CyberScholar', 'DataDragon',
  'EtherEdge', 'FluxFighter', 'GlitchGoat', 'HyperHypoxia'
];

export const peerService = {
  getPeers: () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return peerService.initializePeers();
    return JSON.parse(data);
  },

  initializePeers: () => {
    const peers = Array.from({ length: 15 }, (_, i) => ({
      id: `p-${i}`,
      full_name: GAMER_TAGS[i % GAMER_TAGS.length] || `Scholar_${i}`,
      level: Math.floor(Math.random() * 10) + 5,
      xp: Math.floor(Math.random() * 5000) + 1000,
      avatar_emoji: ['🤖', '⚡', '🌌', '🐉', '🌪️', '⚔️', '🧠'][i % 7],
      streak: Math.floor(Math.random() * 15) + 1,
      lastOnline: 'Just now'
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(peers));
    return peers;
  },

  // Simulate competition by growing peer XP
  syncPeers: (userXp) => {
    const peers = peerService.getPeers();
    const updated = peers.map(p => {
      // 50% chance for a peer to gain bit of XP when user does
      if (Math.random() > 0.5) {
        const gain = Math.floor(Math.random() * 50);
        return { ...p, xp: p.xp + gain, level: Math.floor((p.xp + gain) / 1000) + 1 };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  resetPeers: () => {
    localStorage.removeItem(STORAGE_KEY);
    return peerService.initializePeers();
  }
};

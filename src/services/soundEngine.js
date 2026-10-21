// Pure Web Audio API Sound Generator (Zero external audio files required)
// Provides Things 3-style tactile UI pops, gentle bells, and focus ambient generators

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.currentMode = null; // 'rain' | 'brown' | 'binaural' | null
    this.nodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  stop() {
    this.nodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.nodes = [];
    this.currentMode = null;
  }

  // Tactile "pop" sound when checking off a task (Things 3 feel)
  playPop() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  // Gentle Tibetan bell chime for finishing focus
  playBell(freq = 528) {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }

  // Soft rain ambient noise
  playRain(volume = 0.04) {
    this.init();
    this.stop();

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate soft raindrops
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();

    this.nodes.push(whiteNoise, filter, gainNode);
    this.currentMode = 'rain';
  }

  // Organic Brown Noise Generator (deep, warm acoustic masking)
  playBrownNoise(volume = 0.05) {
    this.init();
    this.stop();

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();

    this.nodes.push(whiteNoise, filter, gainNode);
    this.currentMode = 'brown';
  }

  // 40Hz Binaural Beat
  play40HzBinaural(volume = 0.07) {
    this.init();
    this.stop();

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(200, this.ctx.currentTime);
    const pannerL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pannerL) {
      pannerL.pan.setValueAtTime(-1, this.ctx.currentTime);
      oscL.connect(pannerL);
      pannerL.connect(masterGain);
    } else {
      oscL.connect(masterGain);
    }

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(240, this.ctx.currentTime);
    const pannerR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pannerR) {
      pannerR.pan.setValueAtTime(1, this.ctx.currentTime);
      oscR.connect(pannerR);
      pannerR.connect(masterGain);
    } else {
      oscR.connect(masterGain);
    }

    oscL.start();
    oscR.start();

    this.nodes.push(oscL, oscR, masterGain);
    if (pannerL) this.nodes.push(pannerL);
    if (pannerR) this.nodes.push(pannerR);
    this.currentMode = 'binaural';
  }
}

export const soundEngine = new SoundEngine();

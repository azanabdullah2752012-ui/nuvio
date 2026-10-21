// Pure Web Audio API Sound Generator (No external MP3 files required)
// Implements Huberman-recommended 40Hz Binaural Beats & Brown Noise Masking

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.currentMode = null; // 'binaural' | 'brown' | null
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

  // 40Hz Binaural Beat (MIT & Huberman protocol for focus & neuroplasticity)
  // Left ear: 200 Hz, Right ear: 240 Hz -> Brain synthesizes 40 Hz gamma resonance
  play40HzBinaural(volume = 0.08) {
    this.init();
    this.stop();

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);

    // Left channel
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

    // Right channel
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

  // Organic Brown Noise Generator (deep, warm acoustic masking for high focus)
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
      output[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter low frequencies
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start();

    this.nodes.push(whiteNoise, filter, gainNode);
    this.currentMode = 'brown';
  }

  // Chime chime sound on intervals
  playBell(freq = 528) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
}

export const soundEngine = new SoundEngine();

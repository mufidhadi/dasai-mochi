/**
 * Web Audio API Procedural Synthesizer for Digital Robot Tamagotchi
 * Generates 8-bit digital bleeps, bloops, purrs, and chimes on demand.
 */

class RobotAudioEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /** Play a short digital bleep */
  playBleep(freq = 600, duration = 0.08, type: OscillatorType = 'square') {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked before user gesture
    }
  }

  /** Play eating sound (sequence of chewing bleeps) */
  playEatSound() {
    [0, 0.08, 0.16, 0.24].forEach((delay, idx) => {
      setTimeout(() => {
        const freq = 400 + (idx % 2) * 200;
        this.playBleep(freq, 0.06, 'triangle');
      }, delay * 1000);
    });
  }

  /** Play happy arpeggio */
  playHappySound() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playBleep(note, 0.1, 'sine');
      }, idx * 70);
    });
  }

  /** Play sleepy lullaby tone */
  playSleepSound() {
    const notes = [440, 392, 349.23, 329.63];
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playBleep(note, 0.2, 'sine');
      }, idx * 150);
    });
  }

  /** Play pet purr (low frequency pulsing pulse wave) */
  playPetPurr() {
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch {
      // AudioContext fallback
    }
  }
}

export const robotAudio = new RobotAudioEngine();

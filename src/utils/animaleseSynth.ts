/**
 * Animalese Voice Engine (Nintendo Animal Crossing Style Character Mumbling)
 * Generates procedural high-pitched cute character bleeps for speech overlay.
 */

class AnimaleseSynthEngine {
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

  /**
   * Speak a text string with Nintendo Animal Crossing style mumbling audio
   * and typewriter callback.
   */
  speakText(
    text: string, 
    onChar: (typedText: string) => void,
    onComplete: () => void,
    pitchBase = 1.3
  ) {
    this.init();
    if (!this.ctx) {
      onChar(text);
      onComplete();
      return;
    }

    let charIdx = 0;
    const chars = Array.from(text);

    const speakNextChar = () => {
      if (charIdx >= chars.length) {
        onComplete();
        return;
      }

      const currentChar = chars[charIdx];
      const partialText = text.slice(0, charIdx + 1);
      onChar(partialText);

      // Determine pitch shift based on character code
      const charCode = currentChar.toLowerCase().charCodeAt(0);
      let pitchMultiplier = 1.0;
      let duration = 0.05; // 50ms per character chirp

      if (['a', 'e', 'i', 'o', 'u'].includes(currentChar.toLowerCase())) {
        pitchMultiplier = 1.25 + (charCode % 5) * 0.1;
      } else if (/[a-z0-9]/.test(currentChar.toLowerCase())) {
        pitchMultiplier = 0.95 + (charCode % 7) * 0.08;
      }

      if (currentChar === ' ' || currentChar === ',' || currentChar === '.') {
        duration = currentChar === ' ' ? 0.04 : 0.2;
      } else {
        this.playCuteChirp(880 * pitchBase * pitchMultiplier, duration);
      }

      charIdx++;
      setTimeout(speakNextChar, duration * 1000 * 1.2);
    };

    speakNextChar();
  }

  private playCuteChirp(freq: number, duration: number) {
    try {
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext fallback
    }
  }
}

export const animaleseSynth = new AnimaleseSynthEngine();

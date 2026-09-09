class AudioEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startDelay: number = 0, gainLevel: number = 0.15): void {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime + startDelay
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(gainLevel, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + duration)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Cute robot chime (e.g. Mochi wake up or greeting)
  public playChime(): void {
    if (!this.enabled) return
    this.playTone(523.25, 'triangle', 0.1, 0, 0.18) // C5
    this.playTone(659.25, 'triangle', 0.12, 0.08, 0.18) // E5
    this.playTone(783.99, 'triangle', 0.14, 0.16, 0.18) // G5
    this.playTone(1046.50, 'triangle', 0.25, 0.24, 0.2) // C6
  }

  // Purr / Petting happy tone
  public playPurr(): void {
    if (!this.enabled) return
    this.playTone(440, 'sine', 0.08, 0, 0.12)
    this.playTone(480, 'sine', 0.08, 0.06, 0.14)
    this.playTone(554.37, 'sine', 0.12, 0.12, 0.15)
  }

  // Engine rev sound on acceleration
  public playEngineRev(speed: number): void {
    if (!this.enabled) return
    const baseFreq = 80 + Math.min(speed * 3, 400)
    this.playTone(baseFreq, 'sawtooth', 0.18, 0, 0.08)
  }

  // Brake screech / startled sound
  public playBrakeScreech(): void {
    if (!this.enabled) return
    this.playTone(880, 'square', 0.1, 0, 0.1)
    this.playTone(440, 'sawtooth', 0.15, 0.08, 0.12)
  }

  // Boing / dizzy sound
  public playDizzyBoing(): void {
    if (!this.enabled) return
    this.playTone(300, 'sine', 0.1, 0, 0.15)
    this.playTone(500, 'sine', 0.1, 0.08, 0.15)
    this.playTone(200, 'sine', 0.2, 0.16, 0.15)
  }

  // Love / fan-fare sound
  public playLoveFanfare(): void {
    if (!this.enabled) return
    this.playTone(659.25, 'triangle', 0.12, 0, 0.18)
    this.playTone(783.99, 'triangle', 0.12, 0.1, 0.18)
    this.playTone(987.77, 'triangle', 0.12, 0.2, 0.18)
    this.playTone(1318.51, 'triangle', 0.3, 0.3, 0.22)
  }
}

export const audioEngine = new AudioEngine()

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { audioEngine } from '../utils/audioEngine'

describe('audioEngine', () => {
  beforeEach(() => {
    audioEngine.setEnabled(true)
  })

  it('should allow toggling sound on and off', () => {
    expect(audioEngine.isEnabled()).toBe(true)
    audioEngine.setEnabled(false)
    expect(audioEngine.isEnabled()).toBe(false)
  })

  it('should trigger play sound methods without throwing errors', () => {
    expect(() => audioEngine.playChime()).not.toThrow()
    expect(() => audioEngine.playPurr()).not.toThrow()
    expect(() => audioEngine.playEngineRev(60)).not.toThrow()
    expect(() => audioEngine.playBrakeScreech()).not.toThrow()
    expect(() => audioEngine.playDizzyBoing()).not.toThrow()
    expect(() => audioEngine.playLoveFanfare()).not.toThrow()
  })

  it('should not play sound if disabled', () => {
    audioEngine.setEnabled(false)
    const spy = vi.spyOn(audioEngine as any, 'playTone')
    audioEngine.playChime()
    expect(spy).not.toHaveBeenCalled()
  })
})

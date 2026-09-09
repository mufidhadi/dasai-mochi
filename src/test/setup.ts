import '@testing-library/jest-dom'

// Mock HTMLMediaElement and Web Audio API for tests
class MockAudioContext {
  state = 'running'
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {},
    }
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {},
    }
  }
  destination = {}
  close() { return Promise.resolve() }
  resume() { return Promise.resolve() }
}

// @ts-expect-error Mocking global AudioContext
window.AudioContext = window.AudioContext || MockAudioContext
;(window as any).webkitAudioContext = (window as any).webkitAudioContext || MockAudioContext

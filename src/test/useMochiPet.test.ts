import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMochiPet } from '../hooks/useMochiPet'

describe('useMochiPet Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with default idle state and 100% battery', () => {
    const { result } = renderHook(() => useMochiPet())
    expect(result.current.emotion).toBe('idle')
    expect(result.current.battery).toBeGreaterThanOrEqual(90)
    expect(result.current.soundEnabled).toBe(true)
    expect(result.current.helmet).toBe('cyber_visor')
  })

  it('handles petting interaction and changes emotion to happy/love', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.petMochi()
    })
    expect(['happy', 'love']).toContain(result.current.emotion)
    expect(result.current.petCount).toBe(1)
  })

  it('changes emotion manually and returns to idle after timeout', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.setTemporaryEmotion('dizzy', 2000)
    })
    expect(result.current.emotion).toBe('dizzy')

    act(() => {
      vi.advanceTimersByTime(2100)
    })
    expect(result.current.emotion).toBe('idle')
  })

  it('updates driving physics and triggers cornering emotion', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.steer(-0.8) // sharp left turn
    })
    expect(result.current.emotion).toBe('cornering_left')

    act(() => {
      result.current.steer(0.8) // sharp right turn
    })
    expect(result.current.emotion).toBe('cornering_right')
  })

  it('accelerates and triggers driving speed emotion', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.accelerate(80)
    })
    expect(result.current.speed).toBe(80)
    expect(result.current.emotion).toBe('driving')
  })

  it('brakes hard and triggers braking / surprised emotion', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.accelerate(70)
    })
    act(() => {
      result.current.brakeHard()
    })
    expect(result.current.speed).toBe(0)
    expect(['braking', 'surprised']).toContain(result.current.emotion)
  })

  it('switches helmets cleanly', () => {
    const { result } = renderHook(() => useMochiPet())
    act(() => {
      result.current.setHelmet('neko_ears')
    })
    expect(result.current.helmet).toBe('neko_ears')
  })
})

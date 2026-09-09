import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTamagotchi } from '../hooks/useTamagotchi';

describe('useTamagotchi Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with default full stats and neutral expression', () => {
    const { result } = renderHook(() => useTamagotchi());
    
    expect(result.current.stats.hunger).toBe(100);
    expect(result.current.stats.energy).toBe(100);
    expect(result.current.stats.happiness).toBe(100);
    expect(result.current.stats.battery).toBe(100);
    expect(result.current.expression).toBe('neutral');
    expect(result.current.isSleeping).toBe(false);
  });

  it('should increase hunger stat and trigger happy/eating expression when feed action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    // Reduce hunger manually by advancing time
    act(() => {
      vi.advanceTimersByTime(30000); // 30s decay
    });
    
    const initialHunger = result.current.stats.hunger;

    act(() => {
      result.current.feed();
    });

    expect(result.current.stats.hunger).toBeGreaterThan(initialHunger);
    expect(result.current.expression).toBe('happy');
  });

  it('should boost happiness and trigger excited expression when play action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.play();
    });

    expect(result.current.expression).toBe('excited');
  });

  it('should toggle sleep state and recharge energy', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.toggleSleep();
    });

    expect(result.current.isSleeping).toBe(true);
    expect(result.current.expression).toBe('sleeping');

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.stats.energy).toBe(100);
  });

  it('should trigger love expression and increase happiness when petted', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.pet();
    });

    expect(result.current.expression).toBe('love');
    expect(result.current.stats.happiness).toBe(100);
  });

  it('should change theme correctly', () => {
    const { result } = renderHook(() => useTamagotchi());

    expect(result.current.theme).toBe('cyan');

    act(() => {
      result.current.setTheme('amber');
    });

    expect(result.current.theme).toBe('amber');
  });
});

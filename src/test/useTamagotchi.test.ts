import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTamagotchi } from '../hooks/useTamagotchi';

describe('useTamagotchi Hook with Interactive Action Animations', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with default full stats and idle action state', () => {
    const { result } = renderHook(() => useTamagotchi());
    
    expect(result.current.stats.hunger).toBe(100);
    expect(result.current.stats.energy).toBe(100);
    expect(result.current.stats.happiness).toBe(100);
    expect(result.current.stats.battery).toBe(100);
    expect(result.current.expression).toBe('neutral');
    expect(result.current.activeAction).toBe('idle');
  });

  it('should set activeAction to feeding and trigger happy/eating expression when feed action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.feed();
    });

    expect(result.current.activeAction).toBe('feeding');
    expect(result.current.expression).toBe('happy');

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(result.current.activeAction).toBe('idle');
  });

  it('should set activeAction to playing and trigger excited expression when play action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.play();
    });

    expect(result.current.activeAction).toBe('playing');
    expect(result.current.expression).toBe('excited');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.activeAction).toBe('idle');
  });

  it('should set activeAction to cleaning when clean action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.clean();
    });

    expect(result.current.activeAction).toBe('cleaning');

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(result.current.activeAction).toBe('idle');
  });

  it('should set activeAction to petting when pet action is invoked', () => {
    const { result } = renderHook(() => useTamagotchi());

    act(() => {
      result.current.pet();
    });

    expect(result.current.activeAction).toBe('petting');
    expect(result.current.expression).toBe('love');

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(result.current.activeAction).toBe('idle');
  });
});

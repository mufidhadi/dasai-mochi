import { useState, useEffect, useCallback } from 'react';
import type { TamagotchiStats, TamagotchiExpression, ColorTheme } from '../types/tamagotchi';
import { robotAudio } from '../utils/robotAudio';

const INITIAL_STATS: TamagotchiStats = {
  hunger: 100,
  energy: 100,
  happiness: 100,
  battery: 100,
};

export function useTamagotchi() {
  const [stats, setStats] = useState<TamagotchiStats>(INITIAL_STATS);
  const [isSleeping, setIsSleeping] = useState(false);
  const [activeExpressionOverride, setActiveExpressionOverride] = useState<TamagotchiExpression | null>(null);
  const [theme, setTheme] = useState<ColorTheme>('cyan');

  // Automatic state decay loop
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => {
        if (isSleeping) {
          return {
            ...prev,
            energy: Math.min(100, prev.energy + 5),
            hunger: Math.max(0, prev.hunger - 1),
            battery: Math.min(100, prev.battery + 2),
          };
        }

        return {
          hunger: Math.max(0, prev.hunger - 2),
          energy: Math.max(0, prev.energy - 1.5),
          happiness: Math.max(0, prev.happiness - 1.5),
          battery: Math.max(0, prev.battery - 1),
        };
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isSleeping]);

  // Temporary expression override helper
  const triggerExpression = useCallback((expr: TamagotchiExpression, duration = 3000) => {
    setActiveExpressionOverride(expr);
    setTimeout(() => {
      setActiveExpressionOverride(null);
    }, duration);
  }, []);

  // Actions
  const feed = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      energy: Math.min(100, prev.energy + 10),
    }));
    robotAudio.playEatSound();
    triggerExpression('happy', 2500);
  }, [triggerExpression]);

  const play = useCallback(() => {
    if (isSleeping) return;
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 10),
    }));
    robotAudio.playHappySound();
    triggerExpression('excited', 2500);
  }, [isSleeping, triggerExpression]);

  const toggleSleep = useCallback(() => {
    setIsSleeping((prev) => {
      const nextState = !prev;
      if (nextState) {
        robotAudio.playSleepSound();
      } else {
        robotAudio.playBleep(800, 0.1);
      }
      return nextState;
    });
  }, []);

  const clean = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      battery: Math.min(100, prev.battery + 35),
      happiness: Math.min(100, prev.happiness + 15),
    }));
    robotAudio.playBleep(1000, 0.15, 'sine');
    triggerExpression('happy', 2000);
  }, [triggerExpression]);

  const pet = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
    }));
    robotAudio.playPetPurr();
    triggerExpression('love', 2000);
  }, [triggerExpression]);

  // Derived Expression
  let expression: TamagotchiExpression = 'neutral';
  if (activeExpressionOverride) {
    expression = activeExpressionOverride;
  } else if (isSleeping) {
    expression = 'sleeping';
  } else if (stats.battery < 20) {
    expression = 'low_battery';
  } else if (stats.hunger < 30) {
    expression = 'hungry';
  } else if (stats.energy < 25) {
    expression = 'sleepy';
  }

  return {
    stats,
    expression,
    isSleeping,
    theme,
    setTheme,
    feed,
    play,
    toggleSleep,
    clean,
    pet,
    triggerExpression,
  };
}

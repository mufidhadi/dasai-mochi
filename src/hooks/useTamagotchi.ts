import { useState, useEffect, useCallback } from 'react';
import type { TamagotchiStats, TamagotchiExpression, TamagotchiActionState, ColorTheme } from '../types/tamagotchi';
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
  const [activeAction, setActiveAction] = useState<TamagotchiActionState>('idle');
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

  // Temporary action and expression trigger helper
  const triggerAction = useCallback((action: TamagotchiActionState, expr: TamagotchiExpression, duration = 3500) => {
    setActiveAction(action);
    setActiveExpressionOverride(expr);

    setTimeout(() => {
      setActiveAction('idle');
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
    triggerAction('feeding', 'happy', 3500);
  }, [triggerAction]);

  const play = useCallback(() => {
    if (isSleeping) return;
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 25),
      energy: Math.max(0, prev.energy - 10),
    }));
    robotAudio.playHappySound();
    triggerAction('playing', 'excited', 4000);
  }, [isSleeping, triggerAction]);

  const toggleSleep = useCallback(() => {
    setIsSleeping((prev) => {
      const nextState = !prev;
      if (nextState) {
        setActiveAction('sleeping');
        robotAudio.playSleepSound();
      } else {
        setActiveAction('idle');
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
    triggerAction('cleaning', 'happy', 3500);
  }, [triggerAction]);

  const pet = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 10),
    }));
    robotAudio.playPetPurr();
    triggerAction('petting', 'love', 2500);
  }, [triggerAction]);

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
    activeAction,
    isSleeping,
    theme,
    setTheme,
    feed,
    play,
    toggleSleep,
    clean,
    pet,
    triggerAction,
  };
}

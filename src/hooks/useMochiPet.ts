import { useState, useEffect, useRef, useCallback } from 'react'
import type { MochiEmotion, HelmetType } from '../types/mochi'
import { audioEngine } from '../utils/audioEngine'

export function useMochiPet() {
  const [emotion, setEmotion] = useState<MochiEmotion>('idle')
  const [helmet, setHelmet] = useState<HelmetType>('cyber_visor')
  const [speed, setSpeed] = useState<number>(0)
  const [gForceX, setGForceX] = useState<number>(0)
  const [gForceY, setGForceY] = useState<number>(0)
  const [battery] = useState<number>(94)
  const [mood, setMood] = useState<number>(95)
  const [petCount, setPetCount] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [gyroEnabled, setGyroEnabled] = useState<boolean>(true)
  const [mode, setMode] = useState<'car' | 'desk'>('car')

  const emotionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleBlinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const next = !prev
      audioEngine.setEnabled(next)
      if (next) audioEngine.playChime()
      return next
    })
  }, [])

  // Toggle mode
  const toggleMode = useCallback(() => {
    setMode(prev => (prev === 'car' ? 'desk' : 'car'))
  }, [])

  // Temporary emotion helper
  const setTemporaryEmotion = useCallback((newEmotion: MochiEmotion, durationMs: number = 2500) => {
    if (emotionTimeoutRef.current) {
      clearTimeout(emotionTimeoutRef.current)
    }
    setEmotion(newEmotion)
    emotionTimeoutRef.current = setTimeout(() => {
      setEmotion('idle')
    }, durationMs)
  }, [])

  // Petting interaction
  const petMochi = useCallback(() => {
    setPetCount(prev => prev + 1)
    setMood(prev => Math.min(100, prev + 5))
    const isLove = Math.random() > 0.4
    const selectedEmotion: MochiEmotion = isLove ? 'love' : 'happy'
    
    if (isLove) {
      audioEngine.playLoveFanfare()
    } else {
      audioEngine.playPurr()
    }

    setTemporaryEmotion(selectedEmotion, 2800)
  }, [setTemporaryEmotion])

  // Steer left / right (simulating car cornering or gyroscope tilt)
  const steer = useCallback((intensity: number) => {
    // intensity is -1.0 (hard left) to +1.0 (hard right)
    const clamped = Math.max(-1, Math.min(1, intensity))
    setGForceX(clamped)

    if (clamped < -0.4) {
      setTemporaryEmotion('cornering_left', 2000)
      audioEngine.playEngineRev(40)
    } else if (clamped > 0.4) {
      setTemporaryEmotion('cornering_right', 2000)
      audioEngine.playEngineRev(40)
    }
  }, [setTemporaryEmotion])

  // Accelerate
  const accelerate = useCallback((targetSpeed: number = 80) => {
    const nextSpeed = Math.min(180, Math.max(0, targetSpeed))
    setSpeed(nextSpeed)
    setGForceY(0.6)
    audioEngine.playEngineRev(nextSpeed)

    if (nextSpeed > 40) {
      setTemporaryEmotion('driving', 3000)
    }
  }, [setTemporaryEmotion])

  // Brake hard
  const brakeHard = useCallback(() => {
    setSpeed(0)
    setGForceY(-0.9)
    audioEngine.playBrakeScreech()
    setTemporaryEmotion('braking', 2200)
  }, [setTemporaryEmotion])

  // Natural idle blinking and micro-animations
  useEffect(() => {
    if (emotion !== 'idle') return

    const scheduleBlink = () => {
      const delay = Math.random() * 4000 + 3000
      idleBlinkTimeoutRef.current = setTimeout(() => {
        if (emotion === 'idle') {
          // brief wink or tiny happy glance
          if (Math.random() > 0.6) {
            setEmotion('winking')
            setTimeout(() => setEmotion('idle'), 600)
          }
        }
        scheduleBlink()
      }, delay)
    }

    scheduleBlink()
    return () => {
      if (idleBlinkTimeoutRef.current) clearTimeout(idleBlinkTimeoutRef.current)
    }
  }, [emotion])

  // Gyroscope / Device orientation event listener
  useEffect(() => {
    if (!gyroEnabled || typeof window === 'undefined') return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        // gamma is left-to-right tilt in degrees (-90 to 90)
        const tiltX = e.gamma / 45
        if (Math.abs(tiltX) > 0.5) {
          steer(tiltX)
        }
      }
    }

    window.addEventListener('deviceorientation', handleOrientation)
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [gyroEnabled, steer])

  return {
    emotion,
    setEmotion,
    helmet,
    setHelmet,
    speed,
    gForceX,
    gForceY,
    battery,
    mood,
    petCount,
    soundEnabled,
    toggleSound,
    gyroEnabled,
    setGyroEnabled,
    mode,
    toggleMode,
    petMochi,
    steer,
    accelerate,
    brakeHard,
    setTemporaryEmotion,
  }
}

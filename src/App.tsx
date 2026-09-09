import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Header } from './components/Header'
import { MochiHelmet } from './components/MochiHelmet'
import { DrivingControls } from './components/DrivingControls'
import { EmotionDeck } from './components/EmotionDeck'
import { HelmetSelector } from './components/HelmetSelector'
import { useMochiPet } from './hooks/useMochiPet'

export default function App() {
  const {
    emotion,
    helmet,
    setHelmet,
    speed,
    gForceX,
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
  } = useMochiPet()

  // Confetti burst on milestone pets
  const handlePetWithEffects = () => {
    petMochi()
    if ((petCount + 1) % 5 === 0) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FF2A85', '#FFB800'],
      })
    }
  }

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          steer(-0.8)
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          steer(0.8)
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          accelerate(speed + 30)
          break
        case 'ArrowDown':
        case 's':
        case 'S':
        case ' ':
          brakeHard()
          break
        case 'p':
        case 'P':
          handlePetWithEffects()
          break
        case 'm':
        case 'M':
          toggleSound()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [steer, accelerate, brakeHard, speed, toggleSound])

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation & Header */}
      <Header
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        mode={mode}
        toggleMode={toggleMode}
        battery={battery}
        mood={mood}
        petCount={petCount}
        gyroEnabled={gyroEnabled}
        toggleGyro={() => setGyroEnabled(!gyroEnabled)}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center lg:items-start gap-8 justify-between">
        {/* Left Column: Physical Mochi Unit Display */}
        <section className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[440px] sticky top-24">
          <div className="relative w-full flex flex-col items-center">
            {/* Mode Tag */}
            <div className="mb-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-cyan-400">
              {mode === 'car' ? 'DASHBOARD COMPANION MOUNT' : 'DESK PET STANDBY'}
            </div>

            {/* Mochi Device with Helmet and Screen */}
            <MochiHelmet
              helmet={helmet}
              emotion={emotion}
              speed={speed}
              onPet={handlePetWithEffects}
            />

            {/* Keyboard shortcuts helper bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">W / ↑ Gas</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">S / Space Brake</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">A / ← Left</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">D / → Right</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">P Pet</span>
            </div>
          </div>
        </section>

        {/* Right Column: Interactive Controls HUD */}
        <section className="w-full lg:w-1/2 flex flex-col gap-6">
          {/* Driving HUD & Inertia Controls */}
          <DrivingControls
            speed={speed}
            gForceX={gForceX}
            onSteer={steer}
            onAccelerate={accelerate}
            onBrake={brakeHard}
          />

          {/* Facial Expressions Matrix */}
          <EmotionDeck
            currentEmotion={emotion}
            onSelectEmotion={em => setTemporaryEmotion(em, 3000)}
            onPet={handlePetWithEffects}
          />

          {/* Interchangeable Helmet Customizer */}
          <HelmetSelector
            currentHelmet={helmet}
            onSelectHelmet={setHelmet}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DASAI MOCHI DIGITAL PET COMPANION • GEN-3 OLED</span>
          <span className="text-cyan-400/80">mochi.masmuf.cloud</span>
        </div>
      </footer>
    </div>
  )
}

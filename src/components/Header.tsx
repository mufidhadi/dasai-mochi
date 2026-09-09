import React from 'react'
import { Volume2, VolumeX, Car, Monitor, Compass, BatteryCharging } from 'lucide-react'

interface HeaderProps {
  soundEnabled: boolean
  toggleSound: () => void
  mode: 'car' | 'desk'
  toggleMode: () => void
  battery: number
  mood: number
  petCount: number
  gyroEnabled: boolean
  toggleGyro: () => void
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  toggleSound,
  mode,
  toggleMode,
  battery,
  mood,
  petCount,
  gyroEnabled,
  toggleGyro,
}) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-xl">
          🍡
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              DASAI MOCHI
            </h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              v3.2 OLED
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive Digital Companion & Driving Bot
          </p>
        </div>
      </div>

      {/* Telemetry badges & controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Mood meter */}
        <div className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-xs">
          <span className="text-pink-400">♥</span>
          <span className="text-slate-400">Mood:</span>
          <span className="font-mono font-bold text-cyan-300">{mood}%</span>
        </div>

        {/* Pet count */}
        <div className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-xs">
          <span className="text-amber-400">✨</span>
          <span className="text-slate-400">Pets:</span>
          <span className="font-mono font-bold text-white">{petCount}</span>
        </div>

        {/* Battery meter */}
        <div className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-xs">
          <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-bold text-emerald-400">{battery}%</span>
        </div>

        {/* Gyro toggle button */}
        <button
          onClick={toggleGyro}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            gyroEnabled
              ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
          }`}
          title="Toggle Gyroscope / Inertia reactivity"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gyro:</span>
          <span>{gyroEnabled ? 'ON' : 'OFF'}</span>
        </button>

        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
            soundEnabled
              ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
          }`}
          title={soundEnabled ? 'Mute Sounds' : 'Enable 8-bit Sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Mode Toggle (Car vs Desk) */}
        <button
          onClick={toggleMode}
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-all"
          title="Toggle Car Dash / Desk Mode"
        >
          {mode === 'car' ? (
            <>
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>Car Dash</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-pink-400" />
              <span>Desk Pet</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}

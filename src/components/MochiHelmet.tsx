import React from 'react'
import type { HelmetType, MochiEmotion } from '../types/mochi'
import { OledDisplay } from './OledDisplay'

interface MochiHelmetProps {
  helmet: HelmetType
  emotion: MochiEmotion
  speed?: number
  onPet: () => void
}

export const MochiHelmet: React.FC<MochiHelmetProps> = ({
  helmet,
  emotion,
  speed = 0,
  onPet,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none py-6">
      {/* Floating chassis container */}
      <div
        data-testid="mochi-chassis"
        onClick={onPet}
        className="group relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02] active:scale-95 animate-float"
      >
        {/* Neko Cat Ears Helmet */}
        {helmet === 'neko_ears' && (
          <div data-testid="helmet-neko_ears" className="absolute -top-7 inset-x-0 flex justify-between px-10 pointer-events-none z-30">
            <div className="w-12 h-12 bg-pink-600 rounded-tl-3xl rotate-12 border-4 border-pink-400/80 shadow-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white/70 rounded-tl-xl" />
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-tr-3xl -rotate-12 border-4 border-pink-400/80 shadow-lg flex items-center justify-center">
              <div className="w-5 h-5 bg-white/70 rounded-tr-xl" />
            </div>
          </div>
        )}

        {/* Samurai Kabuto Horns */}
        {helmet === 'samurai_kabuto' && (
          <div data-testid="helmet-samurai_kabuto" className="absolute -top-10 inset-x-0 flex items-center justify-center pointer-events-none z-30">
            {/* Golden Kabuto Crest */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-12 border-t-8 border-amber-400 rounded-t-full glow-amber" />
              <div className="absolute top-1 w-6 h-6 bg-amber-400 rotate-45 border-2 border-amber-200 shadow-md" />
            </div>
          </div>
        )}

        {/* Main Body Shell / Helmet Enclosure */}
        <div
          className={`relative p-5 sm:p-7 rounded-[48px] border-4 shadow-2xl transition-all duration-300 flex flex-col items-center ${
            getHelmetShellStyles(helmet)
          }`}
        >
          {/* Cyber Visor Neon Top Band */}
          {helmet === 'cyber_visor' && (
            <div
              data-testid="helmet-cyber_visor"
              className="absolute top-4 inset-x-6 h-3.5 rounded-full bg-cyan-400/90 glow-cyan border border-cyan-200 flex items-center justify-center"
            >
              <div className="w-12 h-1 bg-white rounded-full animate-pulse" />
            </div>
          )}

          {/* Carbon Fiber Racing Trim */}
          {helmet === 'carbon_jdm' && (
            <div
              data-testid="helmet-carbon_jdm"
              className="absolute top-3 inset-x-8 flex items-center justify-between"
            >
              <div className="w-8 h-2 bg-red-600 rounded-full glow-pink" />
              <div className="text-[10px] font-mono text-red-400 font-bold tracking-widest">
                CARBON R
              </div>
              <div className="w-8 h-2 bg-red-600 rounded-full glow-pink" />
            </div>
          )}

          {/* Retro 90s Arcade Visor */}
          {helmet === 'retro_arcade' && (
            <div
              data-testid="helmet-retro_arcade"
              className="absolute top-3 inset-x-8 flex items-center justify-center gap-1.5"
            >
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm" />
              <span className="text-[9px] font-bold text-amber-300 font-mono ml-2">90s ARCADE</span>
            </div>
          )}

          {/* OLED Display Container */}
          <div className="mt-3">
            <OledDisplay emotion={emotion} speed={speed} />
          </div>

          {/* Chassis branding badge */}
          <div className="mt-3 flex items-center justify-between w-full px-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              GEN-3
            </span>
            <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">
              DASAI // MOCHI
            </span>
          </div>
        </div>

        {/* Magnetic Swivel Stand / Base Mount */}
        <div className="mx-auto mt-2 w-32 h-6 bg-slate-900/90 border border-slate-700/80 rounded-full shadow-lg flex items-center justify-center">
          <div className="w-16 h-1.5 bg-cyan-400/40 rounded-full" />
        </div>

        {/* Ambient Underglow LED */}
        <div
          className={`absolute -bottom-4 inset-x-12 h-8 rounded-full blur-xl opacity-60 pointer-events-none transition-colors duration-500 ${
            getUnderglowColor(helmet)
          }`}
        />
      </div>

      {/* Pet Hint Interaction Pill */}
      <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/70 text-slate-400 text-xs flex items-center gap-2">
        <span className="text-pink-400 animate-pulse">♥</span>
        <span>Tap / Click Mochi to Pet & Cheer Up!</span>
      </div>
    </div>
  )
}

function getHelmetShellStyles(helmet: HelmetType): string {
  switch (helmet) {
    case 'cyber_visor':
      return 'bg-gradient-to-b from-slate-900 via-slate-950 to-cyan-950/40 border-cyan-500/80 shadow-[0_0_40px_rgba(0,240,255,0.25)]'
    case 'carbon_jdm':
      return 'bg-neutral-950 border-red-600/70 shadow-[0_0_35px_rgba(220,38,38,0.25)]'
    case 'neko_ears':
      return 'bg-gradient-to-b from-slate-900 via-pink-950/30 to-slate-950 border-pink-500/80 shadow-[0_0_35px_rgba(236,72,153,0.25)]'
    case 'retro_arcade':
      return 'bg-gradient-to-b from-purple-950 via-slate-950 to-teal-950 border-teal-400/80 shadow-[0_0_35px_rgba(45,212,191,0.25)]'
    case 'samurai_kabuto':
      return 'bg-gradient-to-b from-neutral-900 via-amber-950/30 to-slate-950 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
    case 'none':
    default:
      return 'bg-slate-900 border-slate-700/80 shadow-[0_0_25px_rgba(15,23,42,0.6)]'
  }
}

function getUnderglowColor(helmet: HelmetType): string {
  switch (helmet) {
    case 'cyber_visor':
      return 'bg-cyan-500'
    case 'carbon_jdm':
      return 'bg-red-500'
    case 'neko_ears':
      return 'bg-pink-500'
    case 'retro_arcade':
      return 'bg-purple-500'
    case 'samurai_kabuto':
      return 'bg-amber-500'
    case 'none':
    default:
      return 'bg-cyan-500/60'
  }
}

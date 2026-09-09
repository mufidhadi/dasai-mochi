import React from 'react'
import type { MochiEmotion } from '../types/mochi'

interface OledDisplayProps {
  emotion: MochiEmotion
  speed?: number
  onClick?: () => void
}

export const OledDisplay: React.FC<OledDisplayProps> = ({
  emotion,
  speed = 0,
  onClick,
}) => {
  const isSpeeding = speed > 50 || emotion === 'driving'
  const isCorneringLeft = emotion === 'cornering_left'
  const isCorneringRight = emotion === 'cornering_right'

  // Calculate tilt transform for cornering inertia
  let tiltClass = 'transition-transform duration-300'
  if (isCorneringLeft) tiltClass += ' -rotate-6 translate-x-[-8px]'
  if (isCorneringRight) tiltClass += ' rotate-6 translate-x-[8px]'
  if (emotion === 'braking') tiltClass += ' translate-y-3 scale-95'

  return (
    <div
      data-testid="oled-display"
      onClick={onClick}
      className={`relative w-72 h-52 sm:w-84 sm:h-60 rounded-3xl oled-glass border-2 border-slate-700/60 overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none ${tiltClass}`}
    >
      {/* Scanline CRT overlay */}
      <div className="absolute inset-0 scanlines opacity-50 z-20 pointer-events-none" />

      {/* Screen reflection highlight */}
      <div className="absolute -top-12 -left-12 w-48 h-32 bg-white/5 rounded-full blur-xl transform rotate-12 pointer-events-none z-20" />

      {/* Speed lines on high speed / driving */}
      {isSpeeding && (
        <div data-testid="speed-lines" className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-6 left-2 w-12 h-0.5 bg-cyan-400/40 animate-pulse" />
          <div className="absolute top-16 left-6 w-16 h-0.5 bg-cyan-400/60 animate-pulse delay-75" />
          <div className="absolute bottom-12 right-4 w-20 h-0.5 bg-cyan-400/50 animate-pulse delay-100" />
          <div className="absolute bottom-6 right-8 w-10 h-0.5 bg-cyan-400/40 animate-pulse" />
        </div>
      )}

      {/* Sleeping floating zZz */}
      {emotion === 'sleeping' && (
        <div data-testid="sleeping-bubbles" className="absolute top-4 right-8 z-30 flex flex-col items-end pointer-events-none animate-pulse">
          <span className="text-cyan-300 text-sm font-bold animate-bounce">z</span>
          <span className="text-cyan-400 text-lg font-bold">Z</span>
          <span className="text-cyan-200 text-xs">z</span>
        </div>
      )}

      {/* Cool Sunglasses overlay */}
      {emotion === 'cool' && (
        <div data-testid="sunglasses" className="absolute top-16 z-30 flex items-center justify-center gap-2 animate-bounce">
          <div className="w-14 h-9 bg-slate-950 border-2 border-cyan-400 rounded-sm shadow-lg flex items-center justify-center">
            <div className="w-10 h-1 bg-cyan-300/40 -rotate-45" />
          </div>
          <div className="w-4 h-1 bg-cyan-400" />
          <div className="w-14 h-9 bg-slate-950 border-2 border-cyan-400 rounded-sm shadow-lg flex items-center justify-center">
            <div className="w-10 h-1 bg-cyan-300/40 -rotate-45" />
          </div>
        </div>
      )}

      {/* OLED Eyes Container */}
      <div data-testid="eyes-container" className="relative z-10 flex items-center justify-center gap-10 sm:gap-14 my-auto">
        {/* Render Eye Left */}
        {renderEye(emotion, 'left')}

        {/* Render Eye Right */}
        {renderEye(emotion, 'right')}
      </div>

      {/* Blush Cheeks and Mouth */}
      {['happy', 'love', 'winking'].includes(emotion) && (
        <div data-testid="blush-cheeks" className="relative z-10 flex items-center justify-between w-44 -mt-2">
          {/* Cheek Left */}
          <div className="w-6 h-2 rounded-full bg-pink-500/80 blur-[1px] glow-pink" />
          
          {/* Mouth */}
          <div className="w-5 h-2.5 rounded-b-full bg-cyan-300 glow-cyan" />

          {/* Cheek Right */}
          <div className="w-6 h-2 rounded-full bg-pink-500/80 blur-[1px] glow-pink" />
        </div>
      )}

      {/* Dizzy mouth or surprised mouth */}
      {emotion === 'dizzy' && (
        <div className="relative z-10 w-6 h-3 rounded-full border-2 border-cyan-400 border-dashed animate-spin -mt-2" />
      )}
      {emotion === 'braking' && (
        <div className="relative z-10 w-4 h-4 rounded-full bg-cyan-300 -mt-2 animate-ping" />
      )}

      {/* Bottom bezel status text */}
      <div className="absolute bottom-2 z-10 text-[9px] tracking-widest text-slate-500 font-mono">
        DASAI // MOCHI OLED
      </div>
    </div>
  )
}

function renderEye(emotion: MochiEmotion, side: 'left' | 'right') {
  switch (emotion) {
    case 'happy':
      return (
        <div className="w-10 h-6 border-t-4 border-cyan-400 rounded-t-full glow-cyan transform -translate-y-1" />
      )

    case 'love':
      return (
        <div className="text-3xl text-pink-500 glow-pink animate-pulse">
          ♥
        </div>
      )

    case 'winking':
      if (side === 'left') {
        return <div className="w-10 h-1 bg-cyan-400 rounded-full glow-cyan" />
      }
      return (
        <div className="w-10 h-12 bg-cyan-400 rounded-2xl glow-cyan flex items-start justify-end p-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-white/90" />
        </div>
      )

    case 'driving':
      return (
        <div className="w-11 h-6 border-b-4 border-amber-400 rounded-b-full glow-amber" />
      )

    case 'cornering_left':
      return (
        <div className="w-9 h-11 bg-cyan-400 rounded-2xl glow-cyan transform -skew-x-12 flex items-start justify-start p-1.5">
          <div className="w-3 h-3 rounded-full bg-white/90" />
        </div>
      )

    case 'cornering_right':
      return (
        <div className="w-9 h-11 bg-cyan-400 rounded-2xl glow-cyan transform skew-x-12 flex items-start justify-end p-1.5">
          <div className="w-3 h-3 rounded-full bg-white/90" />
        </div>
      )

    case 'braking':
    case 'surprised':
      return (
        <div className="w-12 h-14 bg-cyan-300 rounded-full glow-cyan flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-slate-950" />
        </div>
      )

    case 'dizzy':
      return (
        <div className="w-11 h-11 rounded-full border-4 border-amber-400 border-t-transparent animate-spin glow-amber" />
      )

    case 'sleeping':
      return (
        <div className="w-10 h-1.5 bg-cyan-400/80 rounded-full glow-cyan" />
      )

    case 'sleepy':
      return (
        <div className="w-10 h-5 bg-cyan-400/80 rounded-t-xl glow-cyan" />
      )

    case 'angry':
      return (
        <div className={`w-10 h-8 bg-rose-500 rounded-sm glow-pink transform ${side === 'left' ? 'rotate-12' : '-rotate-12'}`} />
      )

    case 'cool':
      // Under the sunglasses, normal eyes
      return (
        <div className="w-9 h-11 bg-cyan-400 rounded-2xl glow-cyan" />
      )

    case 'idle':
    default:
      return (
        <div className="w-10 h-13 sm:w-11 sm:h-14 bg-cyan-400 rounded-2xl glow-cyan flex items-start justify-end p-1.5 transition-all">
          <div className="w-3.5 h-3.5 rounded-full bg-white/90" />
        </div>
      )
  }
}

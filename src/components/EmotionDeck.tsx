import React from 'react'
import type { MochiEmotion } from '../types/mochi'
import { Smile, Sparkles, Flame, Moon, Glasses, Heart, AlertCircle, RefreshCw } from 'lucide-react'

interface EmotionDeckProps {
  currentEmotion: MochiEmotion
  onSelectEmotion: (emotion: MochiEmotion) => void
  onPet: () => void
}

interface EmotionButtonInfo {
  emotion: MochiEmotion
  label: string
  sub: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const EMOTIONS: EmotionButtonInfo[] = [
  { emotion: 'happy', label: 'Joy ^_^', sub: 'Cute Smile', icon: Smile, color: 'hover:border-cyan-400 hover:text-cyan-300' },
  { emotion: 'love', label: 'Love <3', sub: 'Heart Eyes', icon: Heart, color: 'hover:border-pink-500 hover:text-pink-300' },
  { emotion: 'winking', label: 'Wink ;)', sub: 'Playful', icon: Sparkles, color: 'hover:border-amber-400 hover:text-amber-300' },
  { emotion: 'cool', label: 'Cool 8-)', sub: 'Pixel Shades', icon: Glasses, color: 'hover:border-cyan-400 hover:text-cyan-300' },
  { emotion: 'driving', label: 'Focus >_<', sub: 'High Speed', icon: Flame, color: 'hover:border-amber-500 hover:text-amber-300' },
  { emotion: 'dizzy', label: 'Dizzy @_@', sub: 'Spiral Eyes', icon: RefreshCw, color: 'hover:border-amber-400 hover:text-amber-300' },
  { emotion: 'sleepy', label: 'Sleepy -_-', sub: 'Droopy Eyes', icon: Moon, color: 'hover:border-indigo-400 hover:text-indigo-300' },
  { emotion: 'surprised', label: 'Shocked !', sub: 'Wide Eyes', icon: AlertCircle, color: 'hover:border-rose-400 hover:text-rose-300' },
]

export const EmotionDeck: React.FC<EmotionDeckProps> = ({
  currentEmotion,
  onSelectEmotion,
  onPet,
}) => {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Facial Expressions & Mood Matrix</span>
        </h3>
        <button
          onClick={onPet}
          className="px-3 py-1 rounded-xl bg-pink-950/50 hover:bg-pink-900/60 border border-pink-500/50 text-pink-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(236,72,153,0.15)] active:scale-95"
        >
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
          <span>Pet Mochi</span>
        </button>
      </div>

      {/* Grid of emotions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {EMOTIONS.map(({ emotion, label, sub, icon: Icon, color }) => {
          const isActive = currentEmotion === emotion
          return (
            <button
              key={emotion}
              onClick={() => onSelectEmotion(emotion)}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                isActive
                  ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : `bg-slate-800/60 border-slate-700/80 text-slate-300 ${color}`
              }`}
            >
              <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">{label}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{sub}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import type { HelmetType, HelmetInfo } from '../types/mochi'
import { Shield, Sparkles, Zap, Cat, Gamepad2, Swords } from 'lucide-react'

interface HelmetSelectorProps {
  currentHelmet: HelmetType
  onSelectHelmet: (helmet: HelmetType) => void
}

const HELMET_CATALOG: (HelmetInfo & { icon: React.ComponentType<{ className?: string }> })[] = [
  {
    id: 'cyber_visor',
    name: 'Cyber Visor',
    subtitle: 'Cyberpunk Neon Strap',
    color: 'from-cyan-950/40 to-slate-900 border-cyan-500/80 text-cyan-300',
    accentColor: '#00F0FF',
    description: 'High-tech neon yellow/cyan HUD visor strap with side LED nodes',
    icon: Zap,
  },
  {
    id: 'carbon_jdm',
    name: 'Carbon JDM',
    subtitle: 'Track-Spec Aero Shell',
    color: 'from-red-950/40 to-neutral-950 border-red-600/80 text-red-300',
    accentColor: '#EF4444',
    description: 'Lightweight race-grade carbon finish with red vortex fins',
    icon: Shield,
  },
  {
    id: 'neko_ears',
    name: 'Neko Ears',
    subtitle: 'Kawaii Edition',
    color: 'from-pink-950/40 to-slate-900 border-pink-500/80 text-pink-300',
    accentColor: '#EC4899',
    description: 'Dual kitten ears with soft inner glow and playful charm',
    icon: Cat,
  },
  {
    id: 'retro_arcade',
    name: '90s Arcade',
    subtitle: 'Translucent Synthwave',
    color: 'from-purple-950/40 to-teal-950/40 border-teal-400/80 text-teal-300',
    accentColor: '#2DD4BF',
    description: 'Translucent purple-teal shell with golden arcade control badges',
    icon: Gamepad2,
  },
  {
    id: 'samurai_kabuto',
    name: 'Kabuto Helm',
    subtitle: 'Ronin Warrior Crest',
    color: 'from-amber-950/40 to-neutral-900 border-amber-500/80 text-amber-300',
    accentColor: '#F59E0B',
    description: 'Traditional golden Japanese Kabuto helmet crest horns',
    icon: Swords,
  },
  {
    id: 'none',
    name: 'Bare Chassis',
    subtitle: 'Minimal Stealth OLED',
    color: 'from-slate-900 to-slate-950 border-slate-700/80 text-slate-300',
    accentColor: '#64748B',
    description: 'Original Dasai clean matte white & black chassis unit',
    icon: Sparkles,
  },
]

export const HelmetSelector: React.FC<HelmetSelectorProps> = ({
  currentHelmet,
  onSelectHelmet,
}) => {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Interchangeable Helmets & Gear</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          6 Styles Available
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {HELMET_CATALOG.map(({ id, name, subtitle, color, description, icon: Icon }) => {
          const isSelected = currentHelmet === id
          return (
            <button
              key={id}
              onClick={() => onSelectHelmet(id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-b ${color} ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]`
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/70 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50">
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight text-white">{name}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{subtitle}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

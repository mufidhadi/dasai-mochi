import React from 'react'
import { Gauge, ArrowLeft, ArrowRight, Zap, OctagonAlert } from 'lucide-react'

interface DrivingControlsProps {
  speed: number
  gForceX: number
  onSteer: (intensity: number) => void
  onAccelerate: (speed: number) => void
  onBrake: () => void
}

export const DrivingControls: React.FC<DrivingControlsProps> = ({
  speed,
  gForceX,
  onSteer,
  onAccelerate,
  onBrake,
}) => {
  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
            Driving Companion & G-Force HUD
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span>SPEED:</span>
          <span className="text-cyan-400 font-bold text-sm">{speed} km/h</span>
        </div>
      </div>

      {/* G-Force Lateral Tilt Meter */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>LATERAL G-FORCE (INERTIA)</span>
          <span className={gForceX < 0 ? 'text-amber-400' : gForceX > 0 ? 'text-cyan-400' : 'text-slate-500'}>
            {gForceX.toFixed(2)} G
          </span>
        </div>
        <div className="relative w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Center reference point */}
          <div className="absolute w-0.5 h-full bg-slate-700 z-10" />
          {/* G-Force Indicator bubble */}
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full transition-all duration-200"
            style={{
              width: `${Math.abs(gForceX) * 50}%`,
              transform: gForceX < 0 ? `translateX(-50%)` : `translateX(50%)`,
            }}
          />
        </div>
      </div>

      {/* Driving Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Turn Left */}
        <button
          onClick={() => onSteer(-0.8)}
          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-cyan-950/60 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 flex flex-col items-center justify-center gap-1 transition-all group"
        >
          <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-semibold">Turn Left</span>
          <span className="text-[10px] text-slate-400 font-mono">-0.8G Corner</span>
        </button>

        {/* Turn Right */}
        <button
          onClick={() => onSteer(0.8)}
          className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-cyan-950/60 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 flex flex-col items-center justify-center gap-1 transition-all group"
        >
          <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          <span className="text-xs font-semibold">Turn Right</span>
          <span className="text-[10px] text-slate-400 font-mono">+0.8G Corner</span>
        </button>

        {/* Accelerate Gas */}
        <button
          onClick={() => onAccelerate(speed + 35)}
          className="p-3 rounded-xl bg-gradient-to-b from-amber-950/40 to-slate-900 hover:from-amber-900/60 active:scale-95 border border-amber-500/60 text-amber-300 flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] group"
        >
          <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Gas Pedal</span>
          <span className="text-[10px] text-amber-400/80 font-mono">Rev Engine</span>
        </button>

        {/* Brake Hard */}
        <button
          onClick={onBrake}
          className="p-3 rounded-xl bg-gradient-to-b from-rose-950/40 to-slate-900 hover:from-rose-900/60 active:scale-95 border border-rose-500/60 text-rose-300 flex flex-col items-center justify-center gap-1 transition-all shadow-[0_0_20px_rgba(244,63,94,0.15)] group"
        >
          <OctagonAlert className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Brake Hard</span>
          <span className="text-[10px] text-rose-400/80 font-mono">Sudden Stop</span>
        </button>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import type { TamagotchiStats, ColorTheme } from '../types/tamagotchi';
import { Utensils, Gamepad2, Moon, Sparkles, Heart, Eye, EyeOff, Maximize, Minimize, Palette } from 'lucide-react';
import { VoiceChatButton } from './VoiceChatButton';

interface TamagotchiHUDProps {
  stats: TamagotchiStats;
  theme: ColorTheme;
  isSleeping: boolean;
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
  onClean: () => void;
  onPet: () => void;
  onThemeChange: (newTheme: ColorTheme) => void;
  onStartSpeaking: (prompt: string, reply: string) => void;
  onTypedText: (text: string) => void;
  onFinishSpeaking: () => void;
}

export const TamagotchiHUD: React.FC<TamagotchiHUDProps> = ({
  stats,
  theme,
  isSleeping,
  onFeed,
  onPlay,
  onSleep,
  onClean,
  onPet,
  onThemeChange,
  onStartSpeaking,
  onTypedText,
  onFinishSpeaking,
}) => {
  const [isHudVisible, setIsHudVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const themes: ColorTheme[] = ['cyan', 'amber', 'green', 'magenta', 'white'];

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col justify-between p-4 z-20">
      {/* Top Header / Control Bar */}
      <div className="flex flex-wrap justify-between items-center w-full gap-2">
        {/* Left: Brand Badge & Voice Chat Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-full text-xs font-mono text-cyan-400 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>MOCHI AI AGENT</span>
          </div>

          <VoiceChatButton
            onStartSpeaking={onStartSpeaking}
            onTypedText={onTypedText}
            onFinishSpeaking={onFinishSpeaking}
          />
        </div>

        {/* Right: Quick Utility Toggles */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1 bg-slate-950/70 border border-slate-800/80 backdrop-blur-md p-1.5 rounded-full">
            <Palette className="w-4 h-4 text-slate-400 ml-1" />
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`w-5 h-5 rounded-full transition-all border ${
                  theme === t ? 'scale-110 border-white ring-2 ring-cyan-400' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    t === 'cyan' ? '#00f3ff' : t === 'amber' ? '#ffb700' : t === 'green' ? '#00ff66' : t === 'magenta' ? '#ff0055' : '#e2f1f8',
                }}
                title={`Theme: ${t}`}
              />
            ))}
          </div>

          {/* Toggle HUD Visibility */}
          <button
            onClick={() => setIsHudVisible(!isHudVisible)}
            className="p-2.5 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md rounded-full transition-all"
            title={isHudVisible ? 'Hide Controls' : 'Show Controls'}
          >
            {isHudVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white backdrop-blur-md rounded-full transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Retractable Bottom Controls & Stats Panel */}
      {isHudVisible && (
        <div className="pointer-events-auto w-full max-w-xl mx-auto bg-slate-950/80 border border-slate-800/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Status Bars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Hunger Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>HUNGER</span>
                <span>{Math.round(stats.hunger)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${stats.hunger}%` }}
                />
              </div>
            </div>

            {/* Energy Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>ENERGY</span>
                <span>{Math.round(stats.energy)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${stats.energy}%` }}
                />
              </div>
            </div>

            {/* Happiness Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>HAPPY</span>
                <span>{Math.round(stats.happiness)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-pink-500 h-full transition-all duration-500"
                  style={{ width: `${stats.happiness}%` }}
                />
              </div>
            </div>

            {/* Battery / Cleanliness Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>BATTERY</span>
                <span>{Math.round(stats.battery)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${stats.battery}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <button
              onClick={onFeed}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/60 rounded-2xl text-emerald-400 transition-all group"
            >
              <Utensils className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono tracking-wide">FEED</span>
            </button>

            <button
              onClick={onPlay}
              disabled={isSleeping}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/60 rounded-2xl text-amber-400 transition-all group disabled:opacity-40"
            >
              <Gamepad2 className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono tracking-wide">PLAY</span>
            </button>

            <button
              onClick={onSleep}
              className={`flex flex-col items-center justify-center p-2.5 border rounded-2xl transition-all group ${
                isSleeping
                  ? 'bg-purple-950/80 border-purple-500 text-purple-300 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700/60 text-purple-400'
              }`}
            >
              <Moon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono tracking-wide">
                {isSleeping ? 'WAKE' : 'SLEEP'}
              </span>
            </button>

            <button
              onClick={onClean}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/60 rounded-2xl text-cyan-400 transition-all group"
            >
              <Sparkles className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono tracking-wide">CLEAN</span>
            </button>

            <button
              onClick={onPet}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 border border-slate-700/60 rounded-2xl text-pink-400 transition-all group"
            >
              <Heart className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono tracking-wide">PET</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

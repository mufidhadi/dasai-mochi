import React from 'react';
import { Volume2, X } from 'lucide-react';

interface SpeechOverlayProps {
  userPrompt: string | null;
  agentReply: string | null;
  typedText: string;
  isSpeaking: boolean;
  onClose: () => void;
}

export const SpeechOverlay: React.FC<SpeechOverlayProps> = ({
  userPrompt,
  agentReply,
  typedText,
  isSpeaking,
  onClose,
}) => {
  if (!agentReply && !userPrompt) return null;

  return (
    <div className="pointer-events-auto fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-30 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative bg-slate-950/90 border-2 border-cyan-500/80 backdrop-blur-2xl p-5 rounded-3xl shadow-[0_0_40px_rgba(0,243,255,0.25)] text-slate-100 font-sans space-y-3">
        {/* Header bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-pink-400' : ''}`} />
            <span className="font-bold uppercase tracking-wider">MOCHI AI VOICE</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Prompt Bubble (if available) */}
        {userPrompt && (
          <div className="text-xs font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-pink-400 font-semibold">Mas Mufid:</span> "{userPrompt}"
          </div>
        )}

        {/* Mochi Reply Typewriter Text */}
        <div className="text-sm sm:text-base leading-relaxed text-cyan-100 font-medium min-h-[50px]">
          {typedText || agentReply}
          {isSpeaking && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
        </div>
      </div>
    </div>
  );
};

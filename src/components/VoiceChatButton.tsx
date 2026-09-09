import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { animaleseSynth } from '../utils/animaleseSynth';

interface VoiceChatButtonProps {
  onStartSpeaking: (prompt: string, reply: string) => void;
  onTypedText: (text: string) => void;
  onFinishSpeaking: () => void;
}

export const VoiceChatButton: React.FC<VoiceChatButtonProps> = ({
  onStartSpeaking,
  onTypedText,
  onFinishSpeaking,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToBackend(audioBlob);

        // Stop all mic tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert('Akses mikrofon ditolak atau tidak didukung di browser ini.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice.webm');

      // Use relative API path or window location origin
      const apiUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/voice-chat` : '/api/voice-chat';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal memproses suara ke backend');
      }

      const data = await response.json();
      const { prompt, reply } = data;

      onStartSpeaking(prompt, reply);

      // Play Nintendo Animal Crossing style mumbling voice
      animaleseSynth.speakText(
        reply,
        (typedText) => {
          onTypedText(typedText);
        },
        () => {
          onFinishSpeaking();
        }
      );
    } catch (err) {
      console.error(err);
      onStartSpeaking('Maaf, Mochi tidak mendengar suara mas mufid.', 'Bisa diulangi lagi mas mufid?');
      animaleseSynth.speakText(
        'Bisa diulangi lagi mas mufid?',
        (typedText) => onTypedText(typedText),
        () => onFinishSpeaking()
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-bold transition-all shadow-lg active:scale-95 ${
          isRecording
            ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse border-2 border-red-400'
            : isLoading
            ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white border border-pink-400/50'
        }`}
        title={isRecording ? 'Klik untuk Mengirim Suara' : 'Bicara dengan Mochi AI (Voice)'}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
            <span>MOCHI MENGINGAT...</span>
          </>
        ) : isRecording ? (
          <>
            <MicOff className="w-4 h-4" />
            <span>REKAM SUARA (STOP)</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span>NGOBROL VOICES</span>
          </>
        )}
      </button>
    </div>
  );
};

import { useState } from 'react';
import { useTamagotchi } from './hooks/useTamagotchi';
import { VirtualRobotFace } from './components/VirtualRobotFace';
import { TamagotchiHUD } from './components/TamagotchiHUD';
import { SpeechOverlay } from './components/SpeechOverlay';

export function App() {
  const {
    stats,
    expression,
    activeAction,
    isSleeping,
    theme,
    setTheme,
    feed,
    play,
    toggleSleep,
    clean,
    pet,
  } = useTamagotchi();

  const [userPrompt, setUserPrompt] = useState<string | null>(null);
  const [agentReply, setAgentReply] = useState<string | null>(null);
  const [typedText, setTypedText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleStartSpeaking = (prompt: string, reply: string) => {
    setUserPrompt(prompt);
    setAgentReply(reply);
    setTypedText('');
    setIsSpeaking(true);
  };

  const handleTypedText = (text: string) => {
    setTypedText(text);
  };

  const handleFinishSpeaking = () => {
    setIsSpeaking(false);
  };

  const handleCloseSpeech = () => {
    setUserPrompt(null);
    setAgentReply(null);
    setTypedText('');
    setIsSpeaking(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 1. Full-screen Virtual Robot Face Canvas */}
      <VirtualRobotFace
        expression={isSpeaking ? 'happy' : expression}
        activeAction={activeAction}
        theme={theme}
        onPet={pet}
      />

      {/* 2. Speech Overlay Bubble (Nintendo Animal Crossing Style Speech) */}
      <SpeechOverlay
        userPrompt={userPrompt}
        agentReply={agentReply}
        typedText={typedText}
        isSpeaking={isSpeaking}
        onClose={handleCloseSpeech}
      />

      {/* 3. Floating Retractable Tamagotchi HUD Overlay */}
      <TamagotchiHUD
        stats={stats}
        theme={theme}
        isSleeping={isSleeping}
        onFeed={feed}
        onPlay={play}
        onSleep={toggleSleep}
        onClean={clean}
        onPet={pet}
        onThemeChange={setTheme}
        onStartSpeaking={handleStartSpeaking}
        onTypedText={handleTypedText}
        onFinishSpeaking={handleFinishSpeaking}
      />
    </div>
  );
}

export default App;

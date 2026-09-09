import { useTamagotchi } from './hooks/useTamagotchi';
import { VirtualRobotFace } from './components/VirtualRobotFace';
import { TamagotchiHUD } from './components/TamagotchiHUD';

export function App() {
  const {
    stats,
    expression,
    isSleeping,
    theme,
    setTheme,
    feed,
    play,
    toggleSleep,
    clean,
    pet,
  } = useTamagotchi();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 1. Full-screen Virtual Robot Face Canvas (Only Eyes & Mouth) */}
      <VirtualRobotFace
        expression={expression}
        theme={theme}
        onPet={pet}
      />

      {/* 2. Floating Retractable Tamagotchi HUD Overlay */}
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
      />
    </div>
  );
}

export default App;

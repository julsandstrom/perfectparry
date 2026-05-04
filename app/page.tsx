import GameRoot from "./components/game/GameRoot";
import { SoundProvider } from "./context/SoundContext";

export default function Home() {
  return (
    <SoundProvider>
      <GameRoot />
    </SoundProvider>
  );
}

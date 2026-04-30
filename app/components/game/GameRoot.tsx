"use client";
import { useCallback, useState } from "react";
import Game from "./Game";
import StartScreen from "./StartGame";

export default function GameRoot() {
  const [screen, setScreen] = useState<"start" | "game">("start");
  const [gameKey, setGameKey] = useState(0);
  const [lightning, setLightning] = useState(false);

  const triggerLightning = useCallback(() => {
    setLightning(true);
    const t = setTimeout(() => setLightning(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const restart = () => {
    setLightning(false);
    setGameKey((k) => k + 1);
  };

  if (screen === "start") {
    return <StartScreen onStart={() => setScreen("game")} />;
  }

  return (
    <Game
      key={gameKey}
      onRestart={restart}
      lightning={lightning}
      onMiss={triggerLightning}
    />
  );
}

"use client";
import { useCallback, useRef, useState } from "react";
import Game from "./Game";
import StartScreen from "./StartGame";

export default function GameRoot() {
  const [screen, setScreen] = useState<"start" | "game">("start");
  const [gameKey, setGameKey] = useState(0);
  const [lightning, setLightning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    const audio = new Audio("/music/Lost-Shrine.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
    audioRef.current = audio;

    setTimeout(() => setScreen("game"), 1500);
  };
  const restart = () => {
    endAudioRef.current?.pause();
    endAudioRef.current = null;
    setLightning(false);
    setGameKey((k) => k + 1);
    const audio = new Audio("/music/Lost-Shrine.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
    audioRef.current = audio;
  };

  const triggerLightning = useCallback(() => {
    setLightning(true);
    const t = setTimeout(() => setLightning(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (screen === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  return (
    <Game
      key={gameKey}
      onRestart={restart}
      lightning={lightning}
      onMiss={triggerLightning}
      audioRef={audioRef}
      endAudioRef={endAudioRef}
    />
  );
}

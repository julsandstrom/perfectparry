"use client";
import { useCallback, useRef, useState } from "react";
import Game from "./Game";
import StartScreen from "./StartGame";
import { useSoundEnabled } from "@/app/context/SoundContext";

export default function GameRoot() {
  const [screen, setScreen] = useState<"start" | "game">("start");
  const [gameKey, setGameKey] = useState(0);
  const [lightning, setLightning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const thunderAudioRef = useRef<HTMLAudioElement | null>(null);
  const { soundEnabled } = useSoundEnabled();

  const handleStart = () => {
    const audio = new Audio("/music/Lost-Shrine.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    if (soundEnabled) {
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
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
    if (soundEnabled) {
      audio.play();
    }
    audioRef.current = audio;
  };

  const handleExit = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    endAudioRef.current?.pause();
    endAudioRef.current = null;
    setLightning(false);
    setScreen("start");
  };

  const triggerLightning = useCallback(() => {
    setLightning(true);
    if (soundEnabled) {
      if (thunderAudioRef.current) {
        thunderAudioRef.current.currentTime = 0;
        thunderAudioRef.current.play().catch(() => {});
      } else {
        const audio = new Audio("/sfx/thunder.mp3");
        audio.volume = 0.6;
        audio.play().catch(() => {});
        thunderAudioRef.current = audio;
      }
    }
    const t = setTimeout(() => setLightning(false), 1500);
    return () => clearTimeout(t);
  }, [soundEnabled]);

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
      onExit={handleExit}
    />
  );
}

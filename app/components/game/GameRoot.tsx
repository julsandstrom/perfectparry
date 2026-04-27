"use client";
import { useState } from "react";
import Game from "./Game";

export default function GameRoot() {
  const [gameKey, setGameKey] = useState(0);
  const restart = () => setGameKey((k) => k + 1);
  return <Game key={gameKey} onRestart={restart} />;
}

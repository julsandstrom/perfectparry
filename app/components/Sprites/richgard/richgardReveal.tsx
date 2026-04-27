"use client";
import { useEffect, useState } from "react";

const FRAME_WIDTH = 102;
const FRAME_HEIGHT = 102;
const FRAME_COUNT = 15;
const SCALE = 2;

export function SpriteEnemyIdle() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % FRAME_COUNT);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,
        backgroundImage: "url('/Reveal.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${FRAME_HEIGHT * SCALE}px`,
        backgroundPosition: `-${frame * FRAME_WIDTH * SCALE}px 0px`,
        imageRendering: "pixelated",
        transform: "scaleX(-1)",
      }}
    />
  );
}

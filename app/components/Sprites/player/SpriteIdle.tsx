"use client";

import { useEffect, useState } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 6;
const SCALE = 4;

export function SpriteIdle() {
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
        backgroundImage: "url('/Soldier-Idle.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${
          FRAME_HEIGHT * SCALE
        }px`,
        marginBottom: -170,
        backgroundPosition: `-${frame * FRAME_WIDTH * SCALE}px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

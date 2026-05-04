"use client";

import { useEffect, useState } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 6;

export function SpriteIdle({ scale = 4 }: { scale?: number }) {
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
        width: FRAME_WIDTH * scale,
        height: FRAME_HEIGHT * scale,
        backgroundImage: "url('/Soldier-Idle.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * scale}px ${
          FRAME_HEIGHT * scale
        }px`,

        backgroundPosition: `-${frame * FRAME_WIDTH * scale}px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

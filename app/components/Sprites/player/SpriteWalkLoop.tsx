"use client";
import { useEffect, useRef } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 8;
const FPS = 10;
const FRAME_MS = 1000 / FPS;

export function SpriteWalkLoop({
  frozen = false,
  scale = 1,
}: {
  frozen?: boolean;
  scale?: number;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (frozen) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const step = (t: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = t;
      const delta = t - lastTimeRef.current;

      if (delta >= FRAME_MS) {
        frameRef.current = (frameRef.current + 1) % FRAME_COUNT;
        lastTimeRef.current = t;
        if (divRef.current) {
          divRef.current.style.backgroundPosition = `-${frameRef.current * FRAME_WIDTH * scale}px 0px`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frozen, scale]);

  return (
    <div
      ref={divRef}
      style={{
        width: FRAME_WIDTH * scale,
        height: FRAME_HEIGHT * scale,
        backgroundImage: "url('/Soldier-Walk.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * scale}px ${FRAME_HEIGHT * scale}px`,
        backgroundPosition: "0px 0px",
        imageRendering: "pixelated",
      }}
    />
  );
}

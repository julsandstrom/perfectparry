"use client";
import { useEffect, useRef } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 4;
const SCALE = 4;
const DIE_DURATION_MS = 1000;

export function SpriteDie({
  trigger,
  onComplete,
}: {
  trigger: number;
  onComplete?: () => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    let start: number | null = null;

    const step = (t: number) => {
      if (start === null) start = t;
      const progress = t - start;
      const frame = Math.min(
        FRAME_COUNT - 1,
        Math.floor((progress / DIE_DURATION_MS) * FRAME_COUNT),
      );
      if (divRef.current) {
        divRef.current.style.backgroundPosition = `-${frame * FRAME_WIDTH * SCALE}px 0px`;
      }
      if (progress < DIE_DURATION_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger, onComplete]);

  return (
    <div
      ref={divRef}
      style={{
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,
        backgroundImage: "url('/Soldier-Death.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${FRAME_HEIGHT * SCALE}px`,
        backgroundPosition: `0px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

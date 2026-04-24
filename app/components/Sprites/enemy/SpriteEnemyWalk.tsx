"use client";
import { useEffect, useRef } from "react";

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 64;
const FRAME_COUNT = 10;
const SCALE = 2;
const WALK_DURATION_MS = 600;

export function SpriteEnemyWalk({
  trigger,
  onComplete,
  flipped = false,
}: {
  trigger: number;
  onComplete?: () => void;
  flipped?: boolean;
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
        Math.floor((progress / WALK_DURATION_MS) * FRAME_COUNT),
      );
      if (divRef.current) {
        divRef.current.style.backgroundPosition = `-${frame * FRAME_WIDTH * SCALE}px 0px`;
      }
      if (progress < WALK_DURATION_MS) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trigger]);

  return (
    <div
      ref={divRef}
      style={{
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,
        backgroundImage: "url('/Skeleton_01_White_Walk.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${FRAME_HEIGHT * SCALE}px`,
        backgroundPosition: `0px 0px`,
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(1)" : "scaleX(-1)",
      }}
    />
  );
}

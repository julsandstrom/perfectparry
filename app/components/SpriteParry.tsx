"use client";

import { useEffect, useState, useCallback } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 6;
const ATTACK_DURATION_MS = 500;
const HIT_FRAME = 3;

export function SpriteParry({
  trigger,
  onHitFrame,
  onComplete,
}: {
  trigger: number;
  onHitFrame?: () => void;
  onComplete?: () => void;
}) {
  const [frame, setFrame] = useState(0);
  const [hitFired, setHitFired] = useState(false);

  const play = useCallback(() => {
    let start: number | null = null;
    setHitFired(false);

    const step = (t: number) => {
      if (start === null) start = t;

      const progress = t - start;

      const nextFrame = Math.min(
        FRAME_COUNT - 1,
        Math.floor((progress / ATTACK_DURATION_MS) * FRAME_COUNT),
      );

      setFrame(nextFrame);

      // 👉 HIT WINDOW TRIGGER
      if (!hitFired && nextFrame >= HIT_FRAME) {
        setHitFired(true);
        onHitFrame?.();
      }

      if (progress < ATTACK_DURATION_MS) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  }, [hitFired, onHitFrame]);

  useEffect(() => {
    setFrame(0);
    setHitFired(false);
    play();
  }, [trigger]);

  return (
    <div
      style={{
        width: FRAME_WIDTH * 8,
        height: FRAME_HEIGHT * 8,
        backgroundImage: "url('/Soldier-Parry01.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * 8}px ${
          FRAME_HEIGHT * 8
        }px`,
        backgroundPosition: `-${frame * FRAME_WIDTH * 8}px 0px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

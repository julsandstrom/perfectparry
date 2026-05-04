"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 9;
const ATTACK_DURATION_MS = 800;
const HIT_FRAME = 3;

export function SpriteCounterAttack({
  trigger,
  onHitFrame,
  onComplete,
  scale = 4,
}: {
  trigger: number;
  onHitFrame?: () => void;
  onComplete?: () => void;
  scale?: number;
}) {
  const [frame, setFrame] = useState(0);
  const [hitFired, setHitFired] = useState(false);
  const hitFiredRef = useRef(false);
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

      if (!hitFiredRef.current && nextFrame >= HIT_FRAME) {
        hitFiredRef.current = true;
        onHitFrame?.();
      }
      hitFiredRef.current = false;
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
        width: FRAME_WIDTH * scale,
        height: FRAME_HEIGHT * scale,
        backgroundImage: "url('/Soldier-Counter-Attack.png')",
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

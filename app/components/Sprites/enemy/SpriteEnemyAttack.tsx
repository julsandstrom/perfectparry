"use client";
import { useEffect, useState, useCallback } from "react";

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 64;
const FRAME_COUNT = 9;
const SCALE = 2;
const ATTACK_DURATION_MS = 600;
const HIT_FRAME = 7;

export function SpriteEnemyAttack({
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
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,
        backgroundImage: "url('/Skeleton_01_White_Attack01.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${FRAME_HEIGHT * SCALE}px`,
        backgroundPosition: `-${frame * FRAME_WIDTH * SCALE}px 0px`,
        imageRendering: "pixelated",
        transform: "scaleX(-1)",
      }}
    />
  );
}

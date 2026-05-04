"use client";
import { useEffect, useState, useCallback, useRef } from "react";

const FRAME_WIDTH = 96;
const FRAME_HEIGHT = 64;
const FRAME_COUNT = 9;

const ATTACK_DURATION_MS = 800;
const HIT_FRAME = 7;

export function SpriteEnemyAttack({
  trigger,
  onHitFrame,
  onComplete,
  scale = 2,
}: {
  trigger: number;
  scale?: number;
  onHitFrame?: () => void;
  onComplete?: () => void;
}) {
  const [frame, setFrame] = useState(0);
  const hitFiredRef = useRef(false);

  const play = useCallback(() => {
    let start: number | null = null;
    hitFiredRef.current = false;
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
      if (progress < ATTACK_DURATION_MS) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };
    requestAnimationFrame(step);
  }, [onHitFrame]);

  useEffect(() => {
    setFrame(0);
    hitFiredRef.current = false;
    play();
  }, [trigger]);

  return (
    <div
      style={{
        width: FRAME_WIDTH * scale,
        height: FRAME_HEIGHT * scale,
        backgroundImage: "url('/Skeleton_01_White_Attack01.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * scale}px ${FRAME_HEIGHT * scale}px`,
        backgroundPosition: `-${frame * FRAME_WIDTH * scale}px 0px`,
        imageRendering: "pixelated",

        transform: "scaleX(-1)",
      }}
    />
  );
}

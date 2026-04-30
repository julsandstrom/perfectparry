"use client";
import { useCallback, useEffect, useState } from "react";

const FRAME_WIDTH = 100;
const FRAME_HEIGHT = 100;
const FRAME_COUNT = 4;
const SCALE = 4;
const HURT_DURATION_MS = 600;

export function SpriteHurt({
  trigger,
  onComplete,
}: {
  trigger: number;
  onComplete?: () => void;
}) {
  const [frame, setFrame] = useState(0);

  const play = useCallback(() => {
    let start: number | null = null;

    const step = (t: number) => {
      if (start === null) start = t;
      const progress = t - start;

      const nextFrame = Math.min(
        FRAME_COUNT - 1,
        Math.floor((progress / HURT_DURATION_MS) * FRAME_COUNT),
      );

      setFrame(nextFrame);

      if (progress < HURT_DURATION_MS) {
        requestAnimationFrame(step);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  useEffect(() => {
    if (trigger > 0) {
      setFrame(0);
      play();
    }
  }, [trigger, play]);

  return (
    <div
      style={{
        width: FRAME_WIDTH * SCALE,
        height: FRAME_HEIGHT * SCALE,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: FRAME_WIDTH * SCALE,
          height: FRAME_HEIGHT * SCALE,
          backgroundImage: "url('/Soldier-Hurt.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${FRAME_WIDTH * FRAME_COUNT * SCALE}px ${FRAME_HEIGHT * SCALE}px`,
          backgroundPosition: `-${frame * FRAME_WIDTH * SCALE}px 0px`,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

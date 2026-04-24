import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimingBarOptions {
  durationMs: number;
  autoRun?: boolean;
  onComplete?: () => void;
}

interface UseTimingBarReturn {
  progress: number;
  start: () => void;
  release: () => number;
  reset: () => void;
  stop: () => void;
}

export function useTimingBar({
  durationMs,
  onComplete,
}: UseTimingBarOptions): UseTimingBarReturn {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const activeRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const runLoop = useCallback(() => {
    const tick = (now: number) => {
      if (!activeRef.current) return;
      if (startRef.current === null) startRef.current = now;
      const p = Math.min(1, (now - startRef.current) / durationMs);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        activeRef.current = false;
        onCompleteRef.current?.();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs]);

  const start = useCallback(() => {
    console.log("TimingBar start() called");
    stop();
    activeRef.current = true;
    startRef.current = null;
    runLoop();
  }, [stop, runLoop]);

  const progressRef = useRef(0);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const release = useCallback((): number => {
    stop();
    return progressRef.current;
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setProgress(0);
    startRef.current = null;
  }, [stop]);

  return { progress, start, release, reset, stop };
}

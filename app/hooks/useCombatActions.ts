import { useCallback, useRef, useState } from "react";
import { useTimingBar } from "./useTimingBar";
import { ATTACK_META, PARRY_META } from "../lib/combatConfig";
import { CombatActionsOptions } from "../types";

export function useCombatActions({
  phase,
  engine,
  anim,
  setResult,
  onParryTimeout,
}: CombatActionsOptions) {
  const pendingAttack = useRef<number | null>(null);
  const pendingCounter = useRef<number | null>(null);
  const [releaseAt, setReleaseAt] = useState<number | null>(null);

  const isParry = phase === "enemy_attack";
  const durationMs = isParry ? PARRY_META.durationMs : ATTACK_META.durationMs;

  const { progress, start, release, reset, stop } = useTimingBar({
    durationMs,
    onComplete: () => {
      if (phase === "player_attack") {
        const result = engine.onAttack(1.0);
        setResult(result);
      }
      if (phase === "enemy_attack") onParryTimeout(1.0);
      if (phase === "counter") {
        const result = engine.onCounter(1.0);
        setResult(result);
      }
    },
  });

  const onHitFrame = useCallback(() => {
    if (phase === "victory" || phase === "defeat") return;
    if (pendingAttack.current !== null) {
      const result = engine.onAttack(pendingAttack.current);
      setResult(result);
      pendingAttack.current = null;
    }
    if (pendingCounter.current !== null) {
      const result = engine.onCounter(pendingCounter.current);
      setResult(result);
      pendingCounter.current = null;
    }
  }, [phase, engine, setResult]);

  const handlePointerDown = useCallback(() => {
    if (phase === "player_attack") start();
  }, [phase, start]);

  const handlePointerUp = useCallback(() => {
    if (phase === "player_attack") {
      pendingAttack.current = release();
      anim.triggerAttack();
    }
  }, [phase, release, anim]);

  const handleTap = useCallback(() => {
    if (phase === "enemy_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { event, result } = engine.onParry(snapshot);
      setResult(result);
      if (event.type === "HURT") anim.triggerHurt();
      else if (event.type === "PARRY") anim.triggerParry();
    }
    if (phase === "counter") {
      const snapshot = release();
      setReleaseAt(snapshot);
      pendingCounter.current = snapshot;
      anim.triggerCounter();
    }
  }, [phase, release, engine, anim, setResult]);

  return {
    progress,
    start,
    stop,
    reset,
    releaseAt,
    setReleaseAt,
    onHitFrame,
    handlePointerDown,
    handlePointerUp,
    handleTap,
  };
}

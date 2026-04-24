import { useCallback, useRef, useState } from "react";
import { useTimingBar } from "./useTimingBar";
import { ATTACK_META, PARRY_META } from "../lib/combatConfig";
import { CombatActionsOptions } from "../types";
import { evaluateAttack } from "../lib/combatMath";

export function useCombatActions({
  phase,
  engine,
  anim,
  setAttackResult,
  setParryResult,
  onParryTimeout,
}: CombatActionsOptions) {
  const pendingAttack = useRef<number | null>(null);
  const pendingCounter = useRef<number | null>(null);
  const [releaseAt, setReleaseAt] = useState<number | null>(null);
  const pendingAttackType = useRef<"sword" | "arrow" | null>(null);

  const isParry = phase === "enemy_attack";
  const durationMs = isParry ? PARRY_META.durationMs : ATTACK_META.durationMs;

  const { progress, start, release, reset, stop } = useTimingBar({
    durationMs,
    onComplete: () => {
      if (phase === "player_attack") {
        const result = engine.onAttack(1.0);
        setAttackResult(result);
      }
      if (phase === "enemy_attack") onParryTimeout(1.0);
      if (phase === "counter") {
        const result = engine.onCounter(1.0);
        setAttackResult(result);
      }
    },
  });

  const onHitFrame = useCallback(() => {
    if (phase === "victory" || phase === "defeat") return;
    if (pendingAttack.current !== null) {
      const result = engine.onAttack(pendingAttack.current);
      setAttackResult(result);
      pendingAttack.current = null;
      if (result !== "arrow") anim.triggerEnemyHurt();
    }
    if (pendingCounter.current !== null) {
      const result = engine.onCounter(pendingCounter.current);
      setAttackResult(result);
      pendingCounter.current = null;
      anim.triggerEnemyHurt();
    }
  }, [phase, engine, setAttackResult, anim]);

  const handlePointerDown = useCallback(() => {
    if (phase === "player_attack") start();
  }, [phase, start]);

  const handlePointerUp = useCallback(() => {
    if (phase === "player_attack") {
      const snapshot = release();
      pendingAttack.current = snapshot;
      // peek at what type this will be to decide animation
      const { result } = evaluateAttack(snapshot);
      pendingAttackType.current = result === "miss" ? null : result;
      if (result === "arrow") {
        anim.triggerBowAttack(); // ← no walk, just fire arrow
      } else {
        anim.triggerWalkIn(); // ← sword walk as before
      }
    }
  }, [phase, release, anim]);

  const handleTap = useCallback(() => {
    if (phase === "resolving") return;
    if (phase === "enemy_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { event, result } = engine.onParry(snapshot);
      setParryResult(result);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
    }
    if (phase === "counter") {
      const snapshot = release();
      setReleaseAt(snapshot);
      pendingCounter.current = snapshot;
      anim.triggerCounter();
    }
  }, [phase, release, engine, anim, setParryResult]);

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

import { useCallback, useRef, useState } from "react";
import { useTimingBar } from "./useTimingBar";
import { ATTACK_BAR, COUNTER_BAR, PARRY_BAR } from "../lib/combatConfig";
import { CombatActionsOptions } from "../types";
import { evaluateZones } from "../lib/combatMath";

export function useCombatActions({
  phase,
  engine,
  anim,
  onParryTimeout,
}: CombatActionsOptions) {
  const pendingAttack = useRef<number | null>(null);
  const pendingCounter = useRef<number | null>(null);
  const [releaseAt, setReleaseAt] = useState<number | null>(null);

  const isParry = phase === "enemy_attack";
  const durationMs = isParry
    ? PARRY_BAR.durationMs
    : phase === "counter"
      ? COUNTER_BAR.durationMs
      : ATTACK_BAR.durationMs;

  const { progress, start, release, reset, stop } = useTimingBar({
    durationMs,
    onComplete: () => {
      if (phase === "player_attack") engine.onAttack(1.0);
      if (phase === "enemy_attack") onParryTimeout(1.0);
      if (phase === "counter") engine.onCounter(1.0);
    },
  });

  const onHitFrame = useCallback(() => {
    if (phase === "victory" || phase === "defeat") return;
    if (pendingAttack.current !== null) {
      const result = engine.onAttack(pendingAttack.current);
      pendingAttack.current = null;
      if (result !== "secondary") anim.triggerEnemyHurt();
    }
    if (pendingCounter.current !== null) {
      engine.onCounter(pendingCounter.current);
      pendingCounter.current = null;
      anim.triggerEnemyHurt();
    }
  }, [phase, engine, anim]);

  const handlePointerDown = useCallback(() => {
    if (phase === "player_attack") start();
  }, [phase, start]);

  const handlePointerUp = useCallback(() => {
    if (phase === "player_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      pendingAttack.current = snapshot;
      const { hitResult } = evaluateZones(snapshot, ATTACK_BAR.zones);
      if (hitResult === "secondary") {
        anim.triggerBowAttack();
      } else {
        anim.triggerWalkIn();
      }
    }
  }, [phase, release, anim, setReleaseAt]);

  const handleTap = useCallback(() => {
    if (phase === "resolving") return;
    if (phase === "enemy_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { event } = engine.onParry(snapshot);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
    }
    if (phase === "counter") {
      const snapshot = release();
      setReleaseAt(snapshot);
      pendingCounter.current = snapshot;
      anim.triggerCounter();
    }
  }, [phase, release, engine, anim]);

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

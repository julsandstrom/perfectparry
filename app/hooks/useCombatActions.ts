import { useCallback, useRef, useState } from "react";
import { useTimingBar } from "./useTimingBar";

import { CombatActionsOptions } from "../types";
import { evaluateZones } from "../lib/combatMath";

export function useCombatActions({
  phase,
  engine,
  anim,
  onParryTimeout,
  attackBar,
  parryBar,
  counterBar,
  onMiss,
}: CombatActionsOptions) {
  const pendingAttack = useRef<number | null>(null);
  const pendingCounter = useRef<number | null>(null);
  const [releaseAt, setReleaseAt] = useState<number | null>(null);
  const suppressPlayerHurt = useRef(false);

  const isParry = phase === "enemy_attack";
  const durationMs = isParry
    ? parryBar.durationMs
    : phase === "counter"
      ? counterBar.durationMs
      : attackBar.durationMs;

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
      if (result === "miss") {
        anim.triggerEnemyAttack("miss");
      } else {
        anim.triggerEnemyHurt();
      }
    }
    if (pendingCounter.current !== null) {
      const result = engine.onCounter(pendingCounter.current);
      pendingCounter.current = null;
      if (result !== "secondary") anim.triggerEnemyHurt();
    }
  }, [phase, engine, anim]);

  const handlePointerDown = useCallback(() => {
    if (phase === "player_attack") start();
  }, [phase, start]);

  const handlePointerUp = useCallback(() => {
    if (phase === "player_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { zone } = evaluateZones(snapshot, attackBar.zones);
      if (zone?.outcome === "arrow") {
        pendingAttack.current = snapshot;
        anim.triggerBowAttack();
      } else if (zone?.outcome === "heal") {
        engine.onAttack(snapshot);
      } else {
        pendingAttack.current = snapshot;
        const isMiss = !zone || zone.outcome === "miss";
        if (isMiss) onMiss?.();
        anim.triggerWalkIn();
      }
    }
  }, [phase, release, anim, setReleaseAt, attackBar, engine, onMiss]);

  const handleTap = useCallback(() => {
    if (phase === "resolving") return;
    if (phase === "enemy_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { event } = engine.onParry(snapshot);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
      else if (event.type === "NONE") anim.triggerEnemyAttack("hurt");
    }
    if (phase === "counter") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { hitResult } = evaluateZones(snapshot, counterBar.zones);
      if (hitResult === "secondary") {
        engine.onCounter(snapshot);
      } else {
        pendingCounter.current = snapshot;

        anim.triggerCounter();
      }
    }
  }, [phase, release, engine, anim, counterBar]);

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

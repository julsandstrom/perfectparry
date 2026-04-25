import { useState } from "react";
import { applyDamage, evaluateZones } from "../lib/combatMath";
import {
  CombatEngineState,
  TransitionFn,
  ParryOutcome,
  ResolveFn,
  CombatDisplayEvent,
  HitResult,
} from "../types";

import { ATTACK_BAR, COUNTER_BAR, PARRY_BAR } from "../lib/combatConfig";

const ENEMY_BASE_HP = 40;
const PLAYER_BASE_HP = 20;
const ENEMY_ATTACK_DAMAGE = 6;

export function useCombatEngine(
  transition: TransitionFn,
  resolve: ResolveFn,
  onEnemyDie: () => void,
  onPlayerDie: () => void,
): CombatEngineState {
  const [playerHp, setPlayerHp] = useState(PLAYER_BASE_HP);
  const [enemyHp, setEnemyHp] = useState(ENEMY_BASE_HP);
  const clearCombatEvent = () => setLastCombatEvent(null);
  const [lastCombatEvent, setLastCombatEvent] =
    useState<CombatDisplayEvent | null>(null);

  const onAttack = (progress: number): HitResult => {
    const { hitResult, zone } = evaluateZones(progress, ATTACK_BAR.zones);
    setLastCombatEvent({
      label: hitResult === "miss" ? "Missed!" : `+${zone!.damage} dmg`,
      enemyDamage: zone?.damage ?? null,
      playerDamage: null,
      playerHeal: null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: ATTACK_BAR,
    });
    const damage = zone?.damage ?? 0;
    let gameOver = false;
    setEnemyHp((prev) => {
      if (prev <= 0) return 0;
      const next = applyDamage(prev, damage);
      if (next <= 0) {
        gameOver = true;
        onEnemyDie();
        return 0;
      }
      return next;
    });
    if (!gameOver) resolve("enemy_attack");
    return hitResult;
  };

  const onParry = (progress: number): ParryOutcome => {
    const { hitResult, zone } = evaluateZones(progress, PARRY_BAR.zones);
    const blocked = hitResult !== "miss";
    const counter = hitResult === "primary" ? 1 : 0;
    setLastCombatEvent({
      label: blocked
        ? counter
          ? "Perfect Parry!"
          : "Blocked!"
        : "You've been hit!",
      enemyDamage: null,
      playerDamage: !blocked ? ENEMY_ATTACK_DAMAGE : null,
      playerHeal: null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: PARRY_BAR,
    });
    if (blocked) {
      if (counter > 0) resolve("counter", 600);
      else resolve("player_attack");
      return {
        event: { type: counter > 0 ? "PARRY" : "NONE" },
        result: hitResult,
      };
    }
    let gameOver = false;
    setTimeout(() => {
      setPlayerHp((prev) => {
        const next = applyDamage(prev, ENEMY_ATTACK_DAMAGE);
        return next <= 0 ? 0 : next;
      });
    }, 500);
    setPlayerHp((prev) => {
      const next = applyDamage(prev, ENEMY_ATTACK_DAMAGE);
      if (next <= 0) {
        gameOver = true;
        onPlayerDie();
      }
      return prev;
    });
    if (!gameOver) resolve("player_attack");
    return { event: { type: "HURT" }, result: hitResult };
  };

  const onCounter = (progress: number): HitResult => {
    clearCombatEvent();
    const { hitResult, zone } = evaluateZones(progress, COUNTER_BAR.zones);
    setLastCombatEvent({
      label:
        hitResult === "miss"
          ? "Missed!"
          : zone!.heal > 0
            ? `+${zone!.heal} hp`
            : `+${zone!.damage} dmg`,
      enemyDamage: zone?.damage ?? null,
      playerDamage: null,
      playerHeal: zone?.heal ?? null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: COUNTER_BAR,
    });
    if (zone?.heal) {
      setPlayerHp((prev) => Math.min(PLAYER_BASE_HP, prev + zone.heal));
    }
    const damage = zone?.damage ?? 0;
    let gameOver = false;
    setEnemyHp((prev) => {
      if (prev <= 0) return 0;
      const next = applyDamage(prev, damage);
      if (next <= 0) {
        gameOver = true;
        onEnemyDie();
        return 0;
      }
      return next;
    });
    if (!gameOver) resolve("player_attack");
    return hitResult;
  };
  return {
    playerHp,
    enemyHp,
    onAttack,
    onParry,
    onCounter,
    lastCombatEvent,
  };
}

import { useRef, useState } from "react";
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
const ENEMY_ATTACK_DAMAGE = 10;

export function useCombatEngine(
  transition: TransitionFn,
  resolve: ResolveFn,
  onEnemyDie: () => void,
  onPlayerDie: () => void,
): CombatEngineState {
  const [playerHp, setPlayerHp] = useState(PLAYER_BASE_HP);
  const [enemyHp, setEnemyHp] = useState(ENEMY_BASE_HP);
  const [lastCombatEvent, setLastCombatEvent] =
    useState<CombatDisplayEvent | null>(null);
  const playerHpRef = useRef(PLAYER_BASE_HP);
  const enemyHpRef = useRef(ENEMY_BASE_HP);

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
    const nextEnemyHp = applyDamage(enemyHpRef.current, damage);
    enemyHpRef.current = nextEnemyHp;
    setEnemyHp(nextEnemyHp);
    if (nextEnemyHp <= 0) {
      onEnemyDie();
    } else {
      resolve("enemy_attack");
    }
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
    const nextHp = applyDamage(playerHpRef.current, ENEMY_ATTACK_DAMAGE);
    playerHpRef.current = nextHp;
    if (nextHp <= 0) {
      setPlayerHp(0);
      onPlayerDie();
    } else {
      setTimeout(() => setPlayerHp(nextHp), 500);
      resolve("player_attack");
    }
    return { event: { type: "HURT" }, result: hitResult };
  };

  const onCounter = (progress: number): HitResult => {
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
      const nextHp = Math.min(PLAYER_BASE_HP, playerHpRef.current + zone.heal);
      playerHpRef.current = nextHp;
      setPlayerHp(nextHp);
    }
    const damage = zone?.damage ?? 0;
    const nextEnemyHp = applyDamage(enemyHpRef.current, damage);
    enemyHpRef.current = nextEnemyHp;
    setEnemyHp(nextEnemyHp);
    if (nextEnemyHp <= 0) {
      onEnemyDie();
    } else {
      resolve("player_attack");
    }
    return hitResult;
  };

  return { playerHp, enemyHp, onAttack, onParry, onCounter, lastCombatEvent };
}

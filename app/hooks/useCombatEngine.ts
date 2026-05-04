import { useRef, useState } from "react";
import { applyDamage, evaluateZones } from "../lib/combatMath";
import {
  CombatEngineState,
  TransitionFn,
  ParryOutcome,
  ResolveFn,
  CombatDisplayEvent,
  HitResult,
  PhaseBarConfig,
  EnemyConfig,
  PlayerStatus,
  CombatStats,
} from "../types";

import {
  ATTACK_LABELS,
  COUNTER_LABELS,
  PARRY_LABELS,
} from "../lib/resultOutput";
import { CONFUSED_SKELETON } from "../lib/combatConfig";

const PLAYER_BASE_HP = 25;

export function useCombatEngine(
  transition: TransitionFn,
  resolve: ResolveFn,
  onEnemyDie: () => void,
  onPlayerDie: () => void,
  attackBar: PhaseBarConfig,
  parryBar: PhaseBarConfig,
  counterBar: PhaseBarConfig,
  enemyConfig: EnemyConfig = CONFUSED_SKELETON,
): CombatEngineState {
  const [playerHp, setPlayerHp] = useState(PLAYER_BASE_HP);
  const [enemyHp, setEnemyHp] = useState(enemyConfig.baseHp);
  const enemyHpRef = useRef(enemyConfig.baseHp);
  const clearLastCombatEvent = () => setLastCombatEvent(null);
  const [combatStats, setCombatStats] = useState<CombatStats>({
    swordHits: 0,
    arrowHits: 0,
    blocks: 0,
    parries: 0,
    heals: 0,
    misses: 0,
  });

  const [lastCombatEvent, setLastCombatEvent] =
    useState<CombatDisplayEvent | null>(null);
  const playerHpRef = useRef(PLAYER_BASE_HP);

  const pickEnemyDamage = () => {
    const damages = enemyConfig.attackDamages;
    return damages[Math.floor(Math.random() * damages.length)];
  };

  const getPlayerStatus = (hp: number): PlayerStatus => {
    const ratio = hp / PLAYER_BASE_HP;
    if (ratio <= 0.4) return "critical";
    if (ratio <= 0.8) return "low";
    return "healthy";
  };

  const onAttack = (progress: number): HitResult => {
    const { hitResult, zone } = evaluateZones(progress, attackBar.zones);
    if (hitResult === "miss") {
      setCombatStats((s) => ({ ...s, misses: s.misses + 1 }));
      const enemyDamageOnMiss = pickEnemyDamage();
      setLastCombatEvent({
        playerLabel:
          hitResult === "miss"
            ? ATTACK_LABELS["miss"]
            : ATTACK_LABELS[zone!.outcome],
        enemyLabel: zone?.damage ? `-${zone.damage}` : null,
        playerHeal: zone?.heal ?? null,

        enemyDamage: null,
        playerDamage: enemyDamageOnMiss,

        hitZoneMin: null,
        hitZoneMax: null,
        activeConfig: attackBar,
        eventPhase: "player_attack",
      });
      const nextHp = applyDamage(playerHpRef.current, enemyDamageOnMiss);
      playerHpRef.current = nextHp;

      if (nextHp <= 0) {
        setPlayerHp(0);
        onPlayerDie();
      } else {
        setTimeout(() => setPlayerHp(nextHp), 500);
        resolve("enemy_attack");
      }
      return hitResult;
    }
    setLastCombatEvent({
      playerLabel: ATTACK_LABELS[zone!.outcome],
      enemyLabel: zone?.damage ? `-${zone.damage}` : null,
      enemyDamage: zone?.damage ?? null,
      playerDamage: null,
      playerHeal: zone?.heal ?? null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: attackBar,
      eventPhase: "player_attack",
    });
    if (zone?.heal) {
      setCombatStats((s) => ({ ...s, heals: s.heals + 1 }));
      const nextHp = Math.min(PLAYER_BASE_HP, playerHpRef.current + zone.heal);
      playerHpRef.current = nextHp;
      setPlayerHp(nextHp);
    } else if (zone?.outcome === "parry") {
      setCombatStats((s) => ({ ...s, parries: s.parries + 1 }));
    }
    const damage = zone?.damage ?? 0;
    if (zone?.outcome === "sword")
      setCombatStats((s) => ({ ...s, swordHits: s.swordHits + 1 }));
    if (zone?.outcome === "arrow")
      setCombatStats((s) => ({ ...s, arrowHits: s.arrowHits + 1 }));
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
    const { hitResult, zone } = evaluateZones(progress, parryBar.zones);
    const blocked = hitResult !== "miss";
    const counter = hitResult === "primary" ? 1 : 0;
    const enemyDamageThisHit = blocked ? 0 : pickEnemyDamage();

    setLastCombatEvent({
      playerLabel: PARRY_LABELS[hitResult],
      enemyLabel: null,
      enemyDamage: zone?.damage ? zone.damage : null,
      playerDamage: enemyDamageThisHit > 0 ? enemyDamageThisHit : null,
      playerHeal: zone?.heal ? zone.heal : null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: parryBar,
      eventPhase: "enemy_attack",
    });

    if (blocked) {
      if (counter > 0) {
        setCombatStats((s) => ({ ...s, parries: s.parries + 1 }));
      } else {
        setCombatStats((s) => ({ ...s, blocks: s.blocks + 1 }));
      }
      if (counter > 0) resolve("counter", 2500);
      else resolve("player_attack");
      return {
        event: { type: counter > 0 ? "PARRY" : "NONE" },
        result: hitResult,
      };
    }
    const nextHp = applyDamage(playerHpRef.current, enemyDamageThisHit);
    playerHpRef.current = nextHp;
    if (nextHp <= 0) {
      setPlayerHp(0);
      onPlayerDie();
    } else {
      setTimeout(() => setPlayerHp(nextHp), 500);
      resolve("player_attack");
    }
    setCombatStats((s) => ({ ...s, misses: s.misses + 1 }));
    return { event: { type: "HURT" }, result: hitResult };
  };

  const onCounter = (progress: number): HitResult => {
    const { hitResult, zone } = evaluateZones(progress, counterBar.zones);
    setLastCombatEvent({
      playerLabel: COUNTER_LABELS[hitResult],
      enemyLabel: zone?.damage ? `-${zone.damage}` : null,
      enemyDamage: zone?.damage ?? null,
      playerDamage: null,
      playerHeal: zone?.heal ?? null,
      hitZoneMin: zone?.min ?? null,
      hitZoneMax: zone?.max ?? null,
      activeConfig: counterBar,
      eventPhase: "counter",
    });
    if (zone?.heal) {
      setCombatStats((s) => ({ ...s, heals: s.heals + 1 }));
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

  return {
    playerHp,
    enemyHp,
    onAttack,
    onParry,
    onCounter,
    lastCombatEvent,
    playerStatus: getPlayerStatus(playerHp),
    clearLastCombatEvent,
    combatStats,
  };
}

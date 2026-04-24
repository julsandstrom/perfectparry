import { useState } from "react";
import { applyDamage, evaluateAttack, evaluateParry } from "../lib/combatMath";
import {
  CombatEngineState,
  TransitionFn,
  ParryOutcome,
  TimingGrade,
  ResolveFn,
  CombatDisplayEvent,
} from "../types";
import { RESULT_LABELS } from "../lib/resultOutput";

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

  const onAttack = (progress: number): TimingGrade => {
    clearCombatEvent();
    const { result, damage } = evaluateAttack(progress);
    setLastCombatEvent({
      label: (RESULT_LABELS.attack as Record<string, string>)[result],
      enemyDamage: damage > 0 ? damage : null,
      playerDamage: null,
      hitZone:
        result === "miss" ? "miss" : result === "arrow" ? "arrow" : "sword",
    });
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
    return result;
  };

  const onParry = (progress: number): ParryOutcome => {
    clearCombatEvent();
    const { result, blocked, counter } = evaluateParry(progress);
    setTimeout(() => {
      setLastCombatEvent({
        label: (RESULT_LABELS.parry as Record<string, string>)[result],
        enemyDamage: null,
        playerDamage: !blocked ? ENEMY_ATTACK_DAMAGE : null,
        hitZone:
          result === "miss" ? "miss" : result === "perfect" ? "sword" : "arrow",
      });
    }, 600);

    if (blocked) {
      if (counter > 0) resolve("counter", 600);
      else resolve("player_attack");
      return { event: { type: counter > 0 ? "PARRY" : "NONE" }, result };
    }

    let gameOver = false;

    setTimeout(() => {
      setPlayerHp((prev) => {
        const next = applyDamage(prev, ENEMY_ATTACK_DAMAGE);
        if (next <= 0) return 0;
        return next;
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
    return { event: { type: "HURT" }, result };
  };

  const onCounter = (progress: number): TimingGrade => {
    clearCombatEvent();
    const { result, damage } = evaluateAttack(progress);
    setLastCombatEvent({
      label: (RESULT_LABELS.attack as Record<string, string>)[result],
      enemyDamage: damage > 0 ? damage : null,
      playerDamage: null,
      hitZone:
        result === "miss" ? "miss" : result === "arrow" ? "arrow" : "sword",
    });

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
    return result;
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

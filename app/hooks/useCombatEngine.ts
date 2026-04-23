import { useState } from "react";
import { applyDamage, evaluateAttack, evaluateParry } from "../lib/combatMath";
import {
  CombatEngineState,
  TransitionFn,
  ParryOutcome,
  TimingGrade,
  ResolveFn,
} from "../types";

const ENEMY_BASE_HP = 100;
const PLAYER_BASE_HP = 100;
const ENEMY_ATTACK_DAMAGE = 40;

export function useCombatEngine(
  transition: TransitionFn,
  resolve: ResolveFn,
  onEnemyDie: () => void,
  onPlayerDie: () => void,
): CombatEngineState {
  const [playerHp, setPlayerHp] = useState(PLAYER_BASE_HP);
  const [enemyHp, setEnemyHp] = useState(ENEMY_BASE_HP);

  const onAttack = (progress: number): TimingGrade => {
    const { result, damage } = evaluateAttack(progress);
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
    const { result, blocked, counter } = evaluateParry(progress);
    if (blocked) {
      if (counter > 0) resolve("counter", 600);
      else resolve("player_attack");
      return { event: { type: counter > 0 ? "PARRY" : "NONE" }, result };
    }
    let gameOver = false;
    setPlayerHp((prev) => {
      const next = applyDamage(prev, ENEMY_ATTACK_DAMAGE);
      if (next <= 0) {
        gameOver = true;
        onPlayerDie();
        return 0;
      }
      return next;
    });
    if (!gameOver) resolve("player_attack");
    return { event: { type: "HURT" }, result };
  };

  const onCounter = (progress: number): TimingGrade => {
    const { result, damage } = evaluateAttack(progress);
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
  return { playerHp, enemyHp, onAttack, onParry, onCounter };
}

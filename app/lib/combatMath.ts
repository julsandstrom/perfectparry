import { AttackGrade, ParryGrade } from "../types";
import { ATTACK_WINDOW, PARRY_WINDOW } from "./combatConfig";

export function evaluateAttack(progress: number): {
  result: AttackGrade;
  damage: number;
} {
  const { sword, arrow } = ATTACK_WINDOW;
  if (progress >= sword[0] && progress <= sword[1])
    return { result: "sword", damage: 30 };
  if (progress >= arrow[0] && progress <= arrow[1])
    return { result: "arrow", damage: 15 };
  return { result: "miss", damage: 0 };
}

export function evaluateParry(progress: number): {
  result: ParryGrade;
  blocked: boolean;
  counter: number;
} {
  const { perfect, block } = PARRY_WINDOW;
  if (progress >= perfect[0] && progress <= perfect[1])
    return { result: "perfect", blocked: true, counter: 1 };
  if (progress >= block[0] && progress <= block[1])
    return { result: "block", blocked: true, counter: 0 };
  return { result: "miss", blocked: false, counter: 0 };
}

export function applyDamage(hp: number, damage: number) {
  return Math.max(0, hp - damage);
}

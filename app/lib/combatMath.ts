import { TimingGrade } from "../types";
import { ATTACK_WINDOW, PARRY_WINDOW } from "./combatConfig";

type Range = readonly [number, number];

interface TimingWindow {
  perfect: Range;
  good: Range;
}

function evaluateTiming(progress: number, window: TimingWindow): TimingGrade {
  const EPSILON = 0.01;

  const [pMin, pMax] = window.perfect;
  const [gMin, gMax] = window.good;

  if (progress >= pMin - EPSILON && progress <= pMax + EPSILON)
    return "perfect";

  if (progress >= gMin - EPSILON && progress <= gMax + EPSILON) return "good";

  return "miss";
}

export function evaluateAttack(progress: number) {
  const result = evaluateTiming(progress, ATTACK_WINDOW);

  const damageMap = {
    perfect: 30,
    good: 15,
    miss: 0,
  };

  return {
    result,
    damage: damageMap[result],
  };
}

export function evaluateParry(progress: number) {
  const result = evaluateTiming(progress, PARRY_WINDOW);

  const outcome = {
    perfect: { blocked: true, counter: 20 },
    good: { blocked: true, counter: 0 },
    miss: { blocked: false, counter: 0 },
  };

  return {
    result,
    ...outcome[result],
  };
}

export function applyDamage(hp: number, damage: number) {
  return Math.max(0, hp - damage);
}

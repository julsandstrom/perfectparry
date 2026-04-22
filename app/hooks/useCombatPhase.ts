import { useCallback, useState } from "react";
import { Phase, TimingGrade, TransitionFn } from "../types";

export function useCombatPhase() {
  const [phase, setPhase] = useState<Phase>("player_attack");
  const [result, setResult] = useState<TimingGrade | null>(null);

  const transition = useCallback<TransitionFn>((to, delayMs = 0) => {
    const go = () => {
      setResult(null);
      setPhase(to);
    };
    if (delayMs > 0) setTimeout(go, delayMs);
    else go();
  }, []);

  // Use this instead of transition when you want a freeze frame first
  const resolve = useCallback((to: Phase, holdMs = 800) => {
    setPhase("resolving");
    setTimeout(() => {
      setResult(null);
      setPhase(to);
    }, holdMs);
  }, []);

  return { phase, result, setResult, transition, resolve };
}

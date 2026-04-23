import { useCallback, useState } from "react";
import { Phase, ResolveFn, TimingGrade, TransitionFn } from "../types";

export function useCombatPhase() {
  const [phase, setPhase] = useState<Phase>("player_attack");
  const [result, setResult] = useState<TimingGrade | null>(null);

  const transition = useCallback<TransitionFn>((to, delayMs = 0) => {
    const go = () => {
      setPhase((current) => {
        if (current === "victory" || current === "defeat") return current; // ← locked
        setResult(null);
        return to;
      });
    };
    if (delayMs > 0) setTimeout(go, delayMs);
    else go();
  }, []);

  const resolve = useCallback<ResolveFn>((to, holdMs = 800) => {
    setPhase((current) => {
      if (current === "victory" || current === "defeat") return current; // ← locked
      setTimeout(() => {
        setPhase((c) => {
          if (c === "victory" || c === "defeat") return c;
          setResult(null);
          return to;
        });
      }, holdMs);
      return "resolving";
    });
  }, []);

  return { phase, result, setResult, transition, resolve };
}

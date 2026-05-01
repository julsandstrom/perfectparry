import { useCallback, useState } from "react";
import { Phase, ResolveFn, HitResult, TransitionFn } from "../types";

export function useCombatPhase() {
  const [phase, setPhase] = useState<Phase>("player_attack");
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [result, setResult] = useState<HitResult | null>(null);
  const [resultContext, setResultContext] = useState<"attack" | "parry" | null>(
    null,
  );
  const [frozen, setFrozen] = useState(false);

  const setAttackResult = (r: HitResult | null) => {
    setResultContext(r ? "attack" : null);
    setResult(r);
  };

  const setParryResult = (r: HitResult | null) => {
    setResultContext(r ? "parry" : null);
    setResult(r);
  };

  const transition = useCallback<TransitionFn>((to, delayMs = 0) => {
    const go = () => {
      setPhase((current) => {
        if (current === "victory" || current === "defeat") return current;
        setResult(null);
        if (to === "victory" || to === "defeat") {
          setTimeout(() => setShowEndScreen(true), 1000);
        }
        return to;
      });
    };
    if (delayMs > 0) setTimeout(go, delayMs);
    else go();
  }, []);

  const resolve = useCallback<ResolveFn>((to, holdMs = 3000) => {
    setPhase((current) => {
      if (current === "victory" || current === "defeat") return current;
      setFrozen(true);
      setTimeout(() => {
        setFrozen(false);
        setPhase((c) => {
          if (c === "victory" || c === "defeat") return c;
          setResult(null);
          return to;
        });
      }, holdMs);
      return "resolving";
    });
  }, []);

  return {
    phase,
    showEndScreen,
    result,
    setResult,
    transition,
    resolve,
    setParryResult,
    setAttackResult,
    resultContext,
    frozen,
  };
}

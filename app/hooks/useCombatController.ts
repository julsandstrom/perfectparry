import { useEffect } from "react";
import { CombatControllerOptions } from "../types";

export function useCombatController({
  phase,
  start,
  stop,
  reset,
  resetUI,
}: CombatControllerOptions) {
  useEffect(() => {
    resetUI();

    if (phase === "enemy_attack" || phase === "counter") {
      reset();
      const timer = setTimeout(() => start(), 50);
      return () => clearTimeout(timer);
    }

    stop();

    if (phase === "player_attack") reset();
  }, [phase, resetUI, reset, start, stop]);
}

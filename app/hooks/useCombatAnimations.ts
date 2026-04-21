import { useCallback, useEffect, useReducer, useState } from "react";
import { AnimState, AnimAction } from "../types";

function animReducer(state: AnimState, action: AnimAction): AnimState {
  switch (action.type) {
    case "ATTACK":
      return "attack";
    case "HURT":
      return "hurt";
    case "PARRY":
      return "parry";
    case "COUNTER":
      return "counter";
    case "RESET":
      return "idle";
    default:
      return state;
  }
}

export function useCombatAnimations() {
  const [animState, dispatchAnim] = useReducer(animReducer, "idle");
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [hurtTrigger, setHurtTrigger] = useState(0);
  const [parryTrigger, setParryTrigger] = useState(0);
  const [counterTrigger, setCounterTrigger] = useState(0);

  useEffect(() => {
    if (animState === "hurt" || animState === "parry") return;
    const t = setTimeout(() => dispatchAnim({ type: "RESET" }), 400);
    return () => clearTimeout(t);
  }, [animState]);

  const triggerAttack = useCallback(() => {
    setAttackTrigger((t) => t + 1);
    dispatchAnim({ type: "ATTACK" });
  }, []);

  const triggerHurt = useCallback(() => {
    setHurtTrigger((t) => t + 1);
    dispatchAnim({ type: "HURT" });
  }, []);

  const triggerParry = useCallback(() => {
    setParryTrigger((t) => t + 1);
    dispatchAnim({ type: "PARRY" });
  }, []);

  const triggerCounter = useCallback(() => {
    setCounterTrigger((t) => t + 1);
    dispatchAnim({ type: "COUNTER" });
  }, []);

  return {
    animState,
    attackTrigger,
    hurtTrigger,
    parryTrigger,
    counterTrigger,
    triggerAttack,
    triggerHurt,
    triggerParry,
    dispatchAnim,
    triggerCounter,
  };
}

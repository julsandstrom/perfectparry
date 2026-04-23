import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimState, AnimAction } from "../types";

function animReducer(state: AnimState, action: AnimAction): AnimState {
  switch (action.type) {
    case "ATTACK":
      return "attack";
    case "ENEMY_ATTACK":
      return "enemy_attack";
    case "HURT":
      return "hurt";
    case "PARRY":
      return "parry";
    case "COUNTER":
      return "counter";
    case "WALK_IN":
      return "walk_in";
    case "WALK_OUT":
      return "walk_out";
    case "ENEMY_WALK_IN":
      return "enemy_walk_in";
    case "ENEMY_WALK_OUT":
      return "enemy_walk_out";
    case "RESET":
      return "idle";
    default:
      return state;
  }
}

export function useCombatAnimations() {
  const [animState, dispatchAnim] = useReducer(animReducer, "idle");
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [walkInTrigger, setWalkInTrigger] = useState(0);
  const [walkOutTrigger, setWalkOutTrigger] = useState(0);
  const [hurtTrigger, setHurtTrigger] = useState(0);
  const [parryTrigger, setParryTrigger] = useState(0);
  const [counterTrigger, setCounterTrigger] = useState(0);
  const [enemyAttackTrigger, setEnemyAttackTrigger] = useState(0);
  const pendingEnemyResult = useRef<"parry" | "hurt">("hurt");
  const [enemyWalkInTrigger, setEnemyWalkInTrigger] = useState(0);
  const [enemyWalkOutTrigger, setEnemyWalkOutTrigger] = useState(0);

  useEffect(() => {
    if (animState === "hurt" || animState === "parry") return;
    const t = setTimeout(() => dispatchAnim({ type: "RESET" }), 400);
    return () => clearTimeout(t);
  }, [animState]);

  const triggerEnemyWalkIn = useCallback(() => {
    setEnemyWalkInTrigger((t) => t + 1);
    dispatchAnim({ type: "ENEMY_WALK_IN" });
  }, []);

  const triggerEnemyWalkOut = useCallback(() => {
    setEnemyWalkOutTrigger((t) => t + 1);
    dispatchAnim({ type: "ENEMY_WALK_OUT" });
  }, []);

  const triggerWalkIn = useCallback(() => {
    setWalkInTrigger((t) => t + 1);
    dispatchAnim({ type: "WALK_IN" });
  }, []);

  const triggerAttack = useCallback(() => {
    setAttackTrigger((t) => t + 1);
    dispatchAnim({ type: "ATTACK" });
  }, []);
  const triggerWalkOut = useCallback(() => {
    setWalkOutTrigger((t) => t + 1);
    dispatchAnim({ type: "WALK_OUT" });
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

  // const triggerEnemyAttack = useCallback((outcome: "parry" | "hurt") => {
  //   pendingEnemyResult.current = outcome;
  //   setEnemyAttackTrigger((t) => t + 1);
  //   dispatchAnim({ type: "ENEMY_ATTACK" });
  //   if (outcome === "parry") {
  //     setTimeout(() => {
  //       setParryTrigger((t) => t + 1);
  //       dispatchAnim({ type: "PARRY" });
  //     }, 300);
  //   }
  // }, []);
  const triggerEnemyAttack = useCallback((outcome: "parry" | "hurt") => {
    pendingEnemyResult.current = outcome;
    setEnemyWalkInTrigger((t) => t + 1);
    dispatchAnim({ type: "ENEMY_WALK_IN" });
    if (outcome === "parry") {
      setTimeout(() => {
        setParryTrigger((t) => t + 1);
        dispatchAnim({ type: "PARRY" });
      }, 560);
    }
  }, []);

  const triggerEnemyAttackAnim = useCallback(() => {
    setEnemyAttackTrigger((t) => t + 1);
    dispatchAnim({ type: "ENEMY_ATTACK" });
  }, []);

  return {
    animState,
    dispatchAnim,
    attackTrigger,
    walkInTrigger,
    walkOutTrigger,
    hurtTrigger,
    parryTrigger,
    counterTrigger,
    triggerWalkIn,
    triggerAttack,
    triggerWalkOut,
    triggerHurt,
    triggerParry,
    triggerCounter,
    triggerEnemyAttack,
    enemyAttackTrigger,
    pendingEnemyResult,
    enemyWalkInTrigger,
    enemyWalkOutTrigger,
    triggerEnemyWalkIn,
    triggerEnemyWalkOut,
    triggerEnemyAttackAnim,
  };
}

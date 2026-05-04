import { useCallback, useReducer, useRef, useState } from "react";
import {
  PlayerAnimState,
  PlayerAnimAction,
  EnemyAnimState,
  EnemyAnimAction,
} from "../types";

function playerReducer(
  state: PlayerAnimState,
  action: PlayerAnimAction,
): PlayerAnimState {
  switch (action.type) {
    case "WALK_IN":
      return "walk_in";
    case "ATTACK":
      return "attack";
    case "BOW_ATTACK":
      return "bow_attack";
    case "WALK_OUT":
      return "walk_out";
    case "HURT":
      return "hurt";
    case "PARRY":
      return "parry";
    case "COUNTER":
      return "counter";
    case "DIE":
      return "die";
    case "RESET":
      if (state === "die") return state;
      return "idle";
    default:
      return state;
  }
}

function enemyReducer(
  state: EnemyAnimState,
  action: EnemyAnimAction,
): EnemyAnimState {
  switch (action.type) {
    case "WALK_IN":
      return "walk_in";
    case "ATTACK":
      return "attack";
    case "HURT":
      return "hurt";
    case "WALK_OUT":
      return "walk_out";
    case "DIE":
      return "die";
    case "RESET":
      if (state === "die") return state;
      return "idle";
    default:
      return state;
  }
}

export function useCombatAnimations(onEnemyHitFrame?: () => void) {
  const [playerAnim, dispatchPlayer] = useReducer(playerReducer, "idle");
  const [enemyAnim, dispatchEnemy] = useReducer(enemyReducer, "idle");

  // --- triggers ---
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [walkInTrigger, setWalkInTrigger] = useState(0);
  const [walkOutTrigger, setWalkOutTrigger] = useState(0);
  const [hurtTrigger, setHurtTrigger] = useState(0);
  const [enemyHurtTrigger, setEnemyHurtTrigger] = useState(0);
  const [parryTrigger, setParryTrigger] = useState(0);
  const [counterTrigger, setCounterTrigger] = useState(0);
  const [enemyAttackTrigger, setEnemyAttackTrigger] = useState(0);
  const [enemyWalkInTrigger, setEnemyWalkInTrigger] = useState(0);
  const [enemyWalkOutTrigger, setEnemyWalkOutTrigger] = useState(0);
  const [enemyDieTrigger, setEnemyDieTrigger] = useState(0);
  const [playerDieTrigger, setPlayerDieTrigger] = useState(0);
  const [bowAttackTrigger, setBowAttackTrigger] = useState(0);

  const pendingEnemyResult = useRef<"parry" | "hurt" | "miss">("hurt");
  const playerDeadRef = useRef(false);
  const enemyDeadRef = useRef(false);
  const isMissRetaliationRef = useRef(false);
  const [isMissRetaliation, setIsMissRetaliation] = useState(false);

  // --- player triggers ---
  const triggerWalkIn = useCallback(() => {
    setWalkInTrigger((t) => t + 1);
    dispatchPlayer({ type: "WALK_IN" });
  }, []);

  const triggerAttack = useCallback(() => {
    setAttackTrigger((t) => t + 1);
    dispatchPlayer({ type: "ATTACK" });
  }, []);

  const clearMissRetaliation = useCallback(() => {
    setIsMissRetaliation(false);
  }, []);

  const triggerBowAttack = useCallback(() => {
    setBowAttackTrigger((t) => t + 1);
    dispatchPlayer({ type: "BOW_ATTACK" });
  }, []);

  const triggerWalkOut = useCallback(() => {
    setWalkOutTrigger((t) => t + 1);
    dispatchPlayer({ type: "WALK_OUT" });
  }, []);

  const triggerHurt = useCallback(() => {
    if (playerDeadRef.current) return;
    setHurtTrigger((t) => t + 1);
    dispatchPlayer({ type: "HURT" });
  }, []);

  const triggerParry = useCallback(() => {
    setParryTrigger((t) => t + 1);
    dispatchPlayer({ type: "PARRY" });
  }, []);

  const triggerCounter = useCallback(() => {
    setCounterTrigger((t) => t + 1);
    dispatchPlayer({ type: "COUNTER" });
  }, []);
  const triggerDie = useCallback(() => {
    playerDeadRef.current = true;
    setTimeout(() => {
      setPlayerDieTrigger((t) => t + 1);
      dispatchPlayer({ type: "DIE" });
    }, 800);
  }, []);
  const resetPlayer = useCallback(() => {
    dispatchPlayer({ type: "RESET" });
  }, []);
  // --- enemy triggers ---
  const triggerEnemyWalkIn = useCallback(() => {
    setEnemyWalkInTrigger((t) => t + 1);
    dispatchEnemy({ type: "WALK_IN" });
  }, []);

  const triggerEnemyAttackAnim = useCallback(() => {
    if (pendingEnemyResult.current === "hurt") {
      triggerHurt();
      onEnemyHitFrame?.();
    }
    setEnemyAttackTrigger((t) => t + 1);
    dispatchEnemy({ type: "ATTACK" });
  }, [triggerHurt, onEnemyHitFrame]);

  const triggerEnemyCounterAttack = useCallback(() => {
    pendingEnemyResult.current = "parry";
    setEnemyAttackTrigger((t) => t + 1);
    dispatchEnemy({ type: "ATTACK" });
  }, []);

  const triggerEnemyHurt = useCallback(() => {
    if (enemyDeadRef.current) return;
    setEnemyHurtTrigger((t) => t + 1);
    dispatchEnemy({ type: "HURT" });
  }, []);

  const triggerEnemyWalkOut = useCallback(() => {
    if (enemyDeadRef.current) return;
    setEnemyWalkOutTrigger((t) => t + 1);
    dispatchEnemy({ type: "WALK_OUT" });
  }, []);

  const triggerEnemyDie = useCallback(() => {
    console.log("triggerEnemyDie called, enemyDeadRef:", enemyDeadRef.current);
    enemyDeadRef.current = true;
    setEnemyDieTrigger((t) => t + 1);
    dispatchEnemy({ type: "DIE" });
  }, []);

  const resetEnemy = useCallback(() => {
    dispatchEnemy({ type: "RESET" });
  }, []);

  const triggerEnemyAttack = useCallback(
    (outcome: "parry" | "hurt" | "miss") => {
      pendingEnemyResult.current = outcome === "miss" ? "hurt" : outcome;
      setIsMissRetaliation(outcome === "miss");

      if (outcome === "miss") {
        console.log("TRIGGERING MISS");
        setEnemyAttackTrigger((t) => t + 1);
        dispatchEnemy({ type: "ATTACK" });
        return;
      }

      setEnemyWalkInTrigger((t) => t + 1);
      dispatchEnemy({ type: "WALK_IN" });

      if (outcome === "parry") {
        setTimeout(() => {
          setParryTrigger((t) => t + 1);
          dispatchPlayer({ type: "PARRY" });
        }, 800);
      }
    },
    [],
  );

  return {
    // states
    playerAnim,
    enemyAnim,
    // player
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
    triggerDie,
    playerDieTrigger,
    triggerBowAttack,
    bowAttackTrigger,
    resetPlayer,
    clearMissRetaliation,
    isMissRetaliation,

    // enemy
    enemyAttackTrigger,
    isMissRetaliationRef,
    enemyWalkInTrigger,
    enemyWalkOutTrigger,
    pendingEnemyResult,
    triggerEnemyAttack,
    triggerEnemyHurt,
    enemyHurtTrigger,
    triggerEnemyAttackAnim,
    triggerEnemyWalkIn,
    triggerEnemyWalkOut,
    triggerEnemyDie,
    enemyDieTrigger,
    triggerEnemyCounterAttack,
    resetEnemy,
  };
}

"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { EnemyConfig, PhaseBarConfig } from "../types";
import {
  DEFAULT_ATTACK_BAR,
  DEFAULT_COUNTER_BAR,
  DEFAULT_PARRY_BAR,
  getAttackBar,
  getCounterBar,
  getParryBar,
} from "../lib/combatConfig";
import { useCombatPhase } from "./useCombatPhase";
import { useCombatAnimations } from "./useCombatAnimations";
import { useCombatEngine } from "./useCombatEngine";
import { useCombatActions } from "./useCombatActions";
import { useCombatController } from "./useCombatController";

export function useCombat(enemyConfig: EnemyConfig) {
  const [attackBar, setAttackBar] =
    useState<PhaseBarConfig>(DEFAULT_ATTACK_BAR);
  const [parryBar, setParryBar] = useState<PhaseBarConfig>(DEFAULT_PARRY_BAR);
  const [counterBar, setCounterBar] =
    useState<PhaseBarConfig>(DEFAULT_COUNTER_BAR);
  const [, startTransition] = useTransition();

  const { phase, transition, resolve, setParryResult, frozen, showEndScreen } =
    useCombatPhase();
  const anim = useCombatAnimations();
  const engine = useCombatEngine(
    transition,
    resolve,
    () => anim.triggerEnemyDie(),
    () => anim.triggerDie(),
    attackBar,
    parryBar,
    counterBar,
    enemyConfig,
  );

  useEffect(() => {
    if (
      phase === "player_attack" ||
      phase === "enemy_attack" ||
      phase === "counter" ||
      phase === "victory" ||
      phase === "defeat"
    ) {
      engine.clearLastCombatEvent();
    }
  }, [phase]);

  const actions = useCombatActions({
    phase,
    engine,
    anim,
    attackBar,
    parryBar,
    counterBar,
    onParryTimeout: (p) => {
      const { event } = engine.onParry(p);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
      else if (event.type === "NONE") anim.triggerEnemyAttack("hurt");
    },
  });

  const resetUI = useCallback(
    () => actions.setReleaseAt(null),
    [actions.setReleaseAt],
  );
  useCombatController({
    phase,
    start: actions.start,
    stop: actions.stop,
    reset: actions.reset,
    resetUI,
  });

  useEffect(() => {
    startTransition(() => {
      setAttackBar(getAttackBar());
      setParryBar(getParryBar());
      setCounterBar(getCounterBar());
    });
  }, []);

  useEffect(() => {
    if (phase === "player_attack") setAttackBar(getAttackBar());
    else if (phase === "enemy_attack") setParryBar(getParryBar());
    else if (phase === "counter") setCounterBar(getCounterBar());
  }, [phase]);

  const barConfig =
    phase === "enemy_attack"
      ? parryBar
      : phase === "counter"
        ? counterBar
        : attackBar;

  return {
    phase,
    transition,
    frozen,
    engine,
    anim,
    actions,
    barConfig,
    showEndScreen,
  };
}

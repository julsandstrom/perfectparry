import { ReactNode } from "react";

export type Phase =
  | "player_attack"
  | "resolving"
  | "enemy_attack"
  | "counter"
  | "victory"
  | "defeat";
export type ZoneId = "primary" | "secondary";
export type HitResult = "primary" | "secondary" | "miss";
export type ResolveFn = (to: Phase, holdMs?: number) => void;

export type TransitionFn = (to: Phase, delayMs?: number) => void;

export interface ZoneConfig {
  id: ZoneId;
  min: number;
  max: number;
  icon: ReactNode;
  label: string;
  damage: number;
  heal: number;
}

export interface PhaseBarConfig {
  durationMs: number;
  zones: [ZoneConfig, ZoneConfig];
}

export interface TimingConfig {
  durationMs: number;
  sword: [number, number];
  arrow: [number, number];
}

export interface CombatDisplayEvent {
  label: string;
  playerDamage: number | null;
  enemyDamage: number | null;
  playerHeal: number | null;
  hitZoneMin: number | null;
  hitZoneMax: number | null;
  activeConfig: PhaseBarConfig;
}

export type CombatEvent =
  | { type: "ATTACK" }
  | { type: "HURT" }
  | { type: "PARRY" }
  | { type: "NONE" };

export interface ParryOutcome {
  event: CombatEvent;
  result: HitResult;
}

export interface CombatEngineState {
  playerHp: number;
  enemyHp: number;
  onAttack: (progress: number) => HitResult;
  onParry: (progress: number) => ParryOutcome;
  onCounter: (progress: number) => HitResult;
  lastCombatEvent: CombatDisplayEvent | null;
}

export type PlayerAnimState =
  | "idle"
  | "walk_in"
  | "attack"
  | "bow_attack"
  | "walk_out"
  | "hurt"
  | "parry"
  | "counter"
  | "die";

export type EnemyAnimState =
  | "idle"
  | "walk_in"
  | "attack"
  | "hurt"
  | "walk_out"
  | "die";

export type PlayerAnimAction =
  | { type: "WALK_IN" }
  | { type: "ATTACK" }
  | { type: "BOW_ATTACK" }
  | { type: "WALK_OUT" }
  | { type: "HURT" }
  | { type: "PARRY" }
  | { type: "COUNTER" }
  | { type: "DIE" }
  | { type: "RESET" };

export type EnemyAnimAction =
  | { type: "WALK_IN" }
  | { type: "ATTACK" }
  | { type: "HURT" }
  | { type: "WALK_OUT" }
  | { type: "DIE" }
  | { type: "RESET" };
// --- Controller ---
export interface CombatControllerOptions {
  phase: Phase;
  start: () => void;
  stop: () => void;
  reset: () => void;
  resetUI: () => void;
}

// --- Actions ---
export interface CombatActionsOptions {
  phase: Phase;
  engine: CombatEngineState;
  anim: {
    triggerWalkIn: () => void;
    triggerAttack: () => void;
    triggerBowAttack: () => void;
    triggerWalkOut: () => void;
    triggerHurt: () => void;
    triggerEnemyHurt: () => void;
    triggerParry: () => void;
    triggerCounter: () => void;
    triggerEnemyAttack: (outcome: "parry" | "hurt") => void;
    resetPlayer: () => void;
    resetEnemy: () => void;
  };
  onParryTimeout: (progress: number) => void;
}

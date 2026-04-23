export type Phase =
  | "player_attack"
  | "resolving"
  | "enemy_attack"
  | "counter"
  | "victory"
  | "defeat";

export type ResolveFn = (to: Phase, holdMs?: number) => void;

export type TimingGrade = "perfect" | "good" | "miss";

export type TransitionFn = (to: Phase, delayMs?: number) => void;

export interface TimingConfig {
  durationMs: number;
  perfect: [number, number];
  good: [number, number];
}

// --- Combat Events ---
export type CombatEvent =
  | { type: "ATTACK" }
  | { type: "HURT" }
  | { type: "PARRY" }
  | { type: "NONE" };

export interface ParryOutcome {
  event: CombatEvent;
  result: TimingGrade;
}

export interface CombatEngineState {
  playerHp: number;
  enemyHp: number;
  onAttack: (progress: number) => TimingGrade;
  onParry: (progress: number) => ParryOutcome;
  onCounter: (progress: number) => TimingGrade;
}

// --- Animations ---
export type PlayerAnimState =
  | "idle"
  | "walk_in"
  | "attack"
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
    triggerWalkOut: () => void;
    triggerHurt: () => void;
    triggerEnemyHurt: () => void;
    triggerParry: () => void;
    triggerCounter: () => void;
    triggerEnemyAttack: (outcome: "parry" | "hurt") => void;
    resetPlayer: () => void;
    resetEnemy: () => void;
  };
  setResult: (r: TimingGrade | null) => void;
  onParryTimeout: (progress: number) => void;
}

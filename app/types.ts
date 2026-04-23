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
export type AnimState =
  | "idle"
  | "walk_in"
  | "attack"
  | "walk_out"
  | "enemy_attack"
  | "enemy_walk_in"
  | "enemy_walk_out"
  | "hurt"
  | "parry"
  | "counter";

export type AnimAction =
  | { type: "ATTACK" }
  | { type: "WALK_IN" }
  | { type: "WALK_OUT" }
  | { type: "ENEMY_WALK_IN" }
  | { type: "ENEMY_ATTACK" }
  | { type: "ENEMY_WALK_OUT" }
  | { type: "HURT" }
  | { type: "PARRY" }
  | { type: "COUNTER" }
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
    triggerAttack: () => void;
    triggerWalkIn: () => void;
    triggerWalkOut: () => void;
    triggerHurt: () => void;
    triggerParry: () => void;
    triggerCounter: () => void;
    triggerEnemyAttack: (outcome: "parry" | "hurt") => void;
  };
  setResult: (r: TimingGrade | null) => void;
  onParryTimeout: (progress: number) => void;
}

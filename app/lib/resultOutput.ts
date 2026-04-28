import { HitResult } from "../types";

export const ATTACK_LABELS: Record<HitResult, string> = {
  primary: "Sword attack!",
  secondary: "Arrow shot!",
  miss: "I missed!",
};

export const PARRY_LABELS: Record<HitResult, string> = {
  primary: "Perfect Parry!",
  secondary: "Blocked!",
  miss: "You've been hit!",
};

export const COUNTER_LABELS: Record<HitResult, string> = {
  primary: "Counter!",
  secondary: "Healed!",
  miss: "I missed!",
};

import { HitResult, ZoneOutcome } from "../types";

export const ATTACK_LABELS: Record<ZoneOutcome | "miss", string> = {
  sword: "Sword Strike!",
  arrow: "Arrow Shot!",
  heal: "Healed up!",
  block: "",
  parry: "",
  miss: "Missed!",
};

export const PARRY_LABELS: Record<HitResult, string> = {
  primary: "Perfect Parry!",
  secondary: "Blocked!",
  miss: "You've been hit!",
};

export const COUNTER_LABELS: Record<HitResult, string> = {
  primary: "Counter!",
  secondary: "Healed up!",
  miss: "I missed!",
};

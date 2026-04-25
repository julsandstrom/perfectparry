import { BowArrow, Fish, Shield, Sword, Swords } from "lucide-react";
import { PhaseBarConfig } from "../types";

export const ATTACK_BAR: PhaseBarConfig = {
  durationMs: 900,
  zones: [
    {
      id: "secondary",
      min: 0.3,
      max: 0.42,
      icon: <BowArrow size={20} fill="black" />,
      label: "7",
      damage: 7,
      heal: 0,
    },
    {
      id: "primary",
      min: 0.7,
      max: 0.8,
      icon: <Sword size={20} fill="black" />,
      label: "13",
      damage: 13,
      heal: 0,
    },
  ],
};

export const PARRY_BAR: PhaseBarConfig = {
  durationMs: 3000,
  zones: [
    {
      id: "secondary",
      min: 0.7,
      max: 0.8,
      icon: <Shield size={20} fill="black" />,
      label: "block",
      damage: 0,
      heal: 0,
    },
    {
      id: "primary",
      min: 0.3,
      max: 0.42,
      icon: <Swords size={20} fill="black" />,
      label: "parry",
      damage: 0,
      heal: 0,
    },
  ],
};

export const COUNTER_BAR: PhaseBarConfig = {
  durationMs: 3500,
  zones: [
    {
      id: "secondary",
      min: 0.35,
      max: 0.45,
      icon: <Fish size={20} fill="black" />,
      label: "+5hp",
      damage: 0,
      heal: 5,
    },
    {
      id: "primary",
      min: 0.85,
      max: 0.95,
      icon: <BowArrow size={20} fill="black" />,
      label: "17",
      damage: 17,
      heal: 0,
    },
  ],
};

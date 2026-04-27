import { BowArrow, Fish, Shield, Sword, Swords } from "lucide-react";
import { PhaseBarConfig } from "../types";

const ATTACK_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 900,
    zones: [
      {
        id: "secondary",
        min: 0.2,
        max: 0.28,
        icon: <BowArrow size={20} fill="black" />,
        label: "7",
        damage: 7,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.8,
        max: 0.88,
        icon: <Sword size={20} fill="black" />,
        label: "13",
        damage: 13,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 900,
    zones: [
      {
        id: "secondary",
        min: 0.2,
        max: 0.28,
        icon: <BowArrow size={20} fill="black" />,
        label: "7",
        damage: 7,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.6,
        max: 0.68,
        icon: <Sword size={20} fill="black" />,
        label: "13",
        damage: 13,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 900,
    zones: [
      {
        id: "secondary",
        min: 0.4,
        max: 0.48,
        icon: <BowArrow size={20} fill="black" />,
        label: "7",
        damage: 7,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.75,
        max: 0.83,
        icon: <Sword size={20} fill="black" />,
        label: "13",
        damage: 13,
        heal: 0,
      },
    ],
  },
];

const PARRY_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 2000,
    zones: [
      {
        id: "secondary",
        min: 0.7,
        max: 0.78,
        icon: <Shield size={20} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.3,
        max: 0.38,
        icon: <Swords size={20} fill="black" />,
        label: "parry",
        damage: 0,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 2000,
    zones: [
      {
        id: "secondary",
        min: 0.6,
        max: 0.68,
        icon: <Shield size={20} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.2,
        max: 0.28,
        icon: <Swords size={20} fill="black" />,
        label: "parry",
        damage: 0,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 2000,
    zones: [
      {
        id: "secondary",
        min: 0.75,
        max: 0.83,
        icon: <Shield size={20} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.4,
        max: 0.48,
        icon: <Swords size={20} fill="black" />,
        label: "parry",
        damage: 0,
        heal: 0,
      },
    ],
  },
];

const COUNTER_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 3000,
    zones: [
      {
        id: "secondary",
        min: 0.35,
        max: 0.43,
        icon: <Fish size={20} fill="black" />,
        label: "+5hp",
        damage: 0,
        heal: 5,
      },
      {
        id: "primary",
        min: 0.85,
        max: 0.93,
        icon: <BowArrow size={20} fill="black" />,
        label: "17",
        damage: 17,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 3000,
    zones: [
      {
        id: "secondary",
        min: 0.2,
        max: 0.28,
        icon: <Fish size={20} fill="black" />,
        label: "+5hp",
        damage: 0,
        heal: 5,
      },
      {
        id: "primary",
        min: 0.7,
        max: 0.78,
        icon: <BowArrow size={20} fill="black" />,
        label: "17",
        damage: 17,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 3000,
    zones: [
      {
        id: "secondary",
        min: 0.5,
        max: 0.58,
        icon: <Fish size={20} fill="black" />,
        label: "+5hp",
        damage: 0,
        heal: 5,
      },
      {
        id: "primary",
        min: 0.78,
        max: 0.86,
        icon: <BowArrow size={20} fill="black" />,
        label: "17",
        damage: 17,
        heal: 0,
      },
    ],
  },
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getAttackBar = () => pick(ATTACK_VARIANTS);
export const getParryBar = () => pick(PARRY_VARIANTS);
export const getCounterBar = () => pick(COUNTER_VARIANTS);
export const DEFAULT_ATTACK_BAR = ATTACK_VARIANTS[0];
export const DEFAULT_PARRY_BAR = PARRY_VARIANTS[0];
export const DEFAULT_COUNTER_BAR = COUNTER_VARIANTS[0];

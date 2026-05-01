import { BowArrow, Fish, Shield, Sword, Swords } from "lucide-react";
import { EnemyConfig, PhaseBarConfig } from "../types";

export const CONFUSED_SKELETON: EnemyConfig = {
  baseHp: 30,
  attackDamages: [6, 6, 6],
};

const ATTACK_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.85,
        max: 0.98,
        outcome: "arrow",
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.6,
        max: 0.68,
        icon: <Sword size={26} strokeWidth={1} fill="black" />,
        label: "9",
        outcome: "sword",
        damage: 9,
        heal: 0,
      },
      {
        id: "secondary",
        outcome: "heal",
        min: 0.35,
        max: 0.46,
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
      },
    ],
  },
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.5,
        outcome: "arrow",
        max: 0.6,
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.8,
        max: 0.88,
        outcome: "sword",
        icon: <Sword size={26} strokeWidth={1} fill="black" />,
        label: "9",
        damage: 9,
        heal: 0,
      },
      {
        id: "secondary",
        outcome: "heal",
        min: 0.2,
        max: 0.32,
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
      },
    ],
  },
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.1,
        max: 0.2,
        outcome: "arrow",
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.4,
        max: 0.5,
        outcome: "sword",
        icon: <Sword size={26} strokeWidth={1} fill="black" />,
        label: "9",
        damage: 9,
        heal: 0,
      },
      {
        id: "secondary",
        outcome: "heal",
        min: 0.82,
        max: 0.95,
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
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
        outcome: "block",
        max: 0.83,
        icon: <Shield size={26} strokeWidth={1} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.3,
        max: 0.38,
        icon: <Swords size={26} strokeWidth={1} fill="black" />,
        label: "parry",
        outcome: "parry",
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
        min: 0.4,
        max: 0.53,
        outcome: "block",
        icon: <Shield size={26} strokeWidth={1} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.8,
        max: 0.9,
        icon: <Swords size={26} strokeWidth={1} fill="black" />,
        label: "parry",
        outcome: "parry",
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
        min: 0.25,
        max: 0.38,
        outcome: "block",
        icon: <Shield size={26} strokeWidth={1} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.6,
        max: 0.7,
        icon: <Swords size={26} strokeWidth={1} fill="black" />,
        label: "parry",
        outcome: "parry",
        damage: 0,
        heal: 0,
      },
    ],
  },
];

const COUNTER_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.35,
        max: 0.46,
        outcome: "heal",
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
      },
      {
        id: "primary",
        min: 0.85,
        max: 0.93,
        outcome: "arrow",
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
        label: "17",
        damage: 17,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.1,
        outcome: "heal",
        max: 0.22,
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
      },
      {
        id: "primary",
        min: 0.7,
        max: 0.78,
        outcome: "arrow",
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
        label: "17",
        damage: 17,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.5,
        max: 0.61,
        outcome: "heal",
        icon: <Fish size={26} strokeWidth={1} fill="black" />,
        label: "heal",
        damage: 0,
        heal: 20,
      },
      {
        id: "primary",
        min: 0.78,
        max: 0.86,
        outcome: "arrow",
        icon: <BowArrow size={26} strokeWidth={1} fill="black" />,
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

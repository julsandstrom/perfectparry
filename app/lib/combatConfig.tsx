import { BowArrow, Fish, Shield, Sword, Swords } from "lucide-react";
import { EnemyConfig, PhaseBarConfig } from "../types";

export const CONFUSED_SKELETON: EnemyConfig = {
  baseHp: 30,
  attackDamages: [6, 9, 7],
};

const ATTACK_VARIANTS: PhaseBarConfig[] = [
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.85,
        max: 0.98,
        icon: <BowArrow size={20} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.6,
        max: 0.68,
        icon: <Sword size={20} fill="black" />,
        label: "9",
        damage: 9,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.4,
        max: 0.53,
        icon: <BowArrow size={20} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.8,
        max: 0.88,
        icon: <Sword size={20} fill="black" />,
        label: "9",
        damage: 9,
        heal: 0,
      },
    ],
  },
  {
    durationMs: 1500,
    zones: [
      {
        id: "secondary",
        min: 0.4,
        max: 0.5,
        icon: <BowArrow size={20} fill="black" />,
        label: "4",
        damage: 4,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.9,
        max: 0.98,
        icon: <Sword size={20} fill="black" />,
        label: "9",
        damage: 9,
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
        max: 0.83,
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
        min: 0.4,
        max: 0.53,
        icon: <Shield size={20} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.8,
        max: 0.9,
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
        min: 0.25,
        max: 0.38,
        icon: <Shield size={20} fill="black" />,
        label: "block",
        damage: 0,
        heal: 0,
      },
      {
        id: "primary",
        min: 0.6,
        max: 0.7,
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
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.35,
        max: 0.46,
        icon: <Fish size={20} fill="black" />,
        label: "+13hp",
        damage: 0,
        heal: 13,
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
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.1,
        max: 0.22,
        icon: <Fish size={20} fill="black" />,
        label: "+10hp",
        damage: 0,
        heal: 10,
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
    durationMs: 2600,
    zones: [
      {
        id: "secondary",
        min: 0.5,
        max: 0.61,
        icon: <Fish size={20} fill="black" />,
        label: "+12hp",
        damage: 0,
        heal: 12,
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

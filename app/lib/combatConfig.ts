export const ATTACK_WINDOW = {
  perfect: [0.7, 0.8],
  good: [0.65, 0.85],
} as const;

export const PARRY_WINDOW = {
  perfect: [0.77, 0.85],
  good: [0.75, 0.95],
} as const;

export const ATTACK_META = {
  durationMs: 800,
};

export const PARRY_META = {
  durationMs: 800,
};

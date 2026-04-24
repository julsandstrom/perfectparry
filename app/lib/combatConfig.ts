export const ATTACK_WINDOW = {
  sword: [0.7, 0.8],
  arrow: [0.3, 0.42],
} as const;

export const PARRY_WINDOW = {
  perfect: [0.7, 0.8],
  block: [0.3, 0.42],
} as const;

export const ATTACK_META = {
  durationMs: 800,
};

export const PARRY_META = {
  durationMs: 800,
};

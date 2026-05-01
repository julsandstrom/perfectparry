import { CombatStats } from "../types";

export function calcScore(s: CombatStats): number {
  const totalActions =
    s.swordHits + s.arrowHits + s.blocks + s.heals + s.misses;
  if (totalActions === 0) return 0;

  const hits = s.swordHits + s.arrowHits + s.blocks + s.heals;
  const accuracy = hits / totalActions;

  const accuracyScore = accuracy * 8;
  const bonusScore =
    Math.min(s.arrowHits * 0.4, 1) + Math.min(s.heals * 0.5, 1);

  return Math.round(Math.min(10, Math.max(0, accuracyScore + bonusScore)));
}

export function calcTitle(s: CombatStats): { title: string; detail: string } {
  const candidates = [
    {
      key: "swordHits",
      count: s.swordHits,
      title: "The Swordsman",
      detail: `${s.swordHits} sword strikes`,
    },
    {
      key: "arrowHits",
      count: s.arrowHits,
      title: "The Archer",
      detail: `${s.arrowHits} arrow hits`,
    },
    {
      key: "blocks",
      count: s.blocks,
      title: "The Defender",
      detail: `${s.blocks} blocks`,
    },
    {
      key: "heals",
      count: s.heals,
      title: "The Survivor",
      detail: `${s.heals} heals`,
    },
  ];
  const best = candidates
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)[0];

  if (!best) return { title: "The Defeated", detail: "no hits landed" };
  return { title: best.title, detail: best.detail };
}

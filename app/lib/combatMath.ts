import { ZoneConfig, HitResult } from "../types";

export function evaluateZones(
  progress: number,
  zones: ZoneConfig[],
): {
  hitResult: HitResult;
  zone: ZoneConfig | null;
} {
  for (const zone of zones) {
    if (progress >= zone.min && progress <= zone.max) {
      return { hitResult: zone.id, zone };
    }
  }
  return { hitResult: "miss", zone: null };
}

export function applyDamage(hp: number, damage: number) {
  return Math.max(0, hp - damage);
}

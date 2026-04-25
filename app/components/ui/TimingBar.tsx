import { CombatDisplayEvent, PhaseBarConfig } from "@/app/types";
import AttackSelectionBar from "./AttackSelectionBar";

interface TimingBarProps {
  progress: number;
  config: PhaseBarConfig;
  releaseAt?: number | null;
  lastCombatEvent?: CombatDisplayEvent | null;
  frozen?: boolean;
}

export const TimingBar = ({
  progress,
  config,
  releaseAt = null,
  lastCombatEvent,
  frozen,
}: TimingBarProps) => {
  const missed = (frozen ?? false) && lastCombatEvent?.hitZoneMin === null;
  const visualProgress = releaseAt ?? progress;
  const displayConfig =
    frozen && lastCombatEvent?.activeConfig
      ? lastCombatEvent.activeConfig
      : config;

  return (
    <div
      className="relative h-16 w-full rounded-xs"
      style={{ backgroundColor: frozen && missed ? "#ef4444" : "#CBA788" }}
    >
      {displayConfig.zones.map((zone) => (
        <AttackSelectionBar
          key={zone.id + zone.min}
          min={zone.min}
          max={zone.max}
          icon={zone.icon}
          label={zone.label}
          highlight={
            (frozen ?? false) &&
            lastCombatEvent?.hitZoneMin === zone.min &&
            lastCombatEvent?.hitZoneMax === zone.max
          }
        />
      ))}
      <div
        className="absolute top-0 bottom-0 left-0 bg-[#151515] z-0"
        style={{ width: `${visualProgress * 100}%` }}
      />
    </div>
  );
};

import { CombatDisplayEvent, PhaseBarConfig } from "@/app/types";
import AttackSelectionBar from "./AttackSelectionBar";
import { SpriteWalkLoop } from "../Sprites/player/SpriteWalkLoop";
import { useResponsiveScale } from "@/app/hooks/useResponsiveSpriteScale";

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
  const scale = useResponsiveScale({ sm: 1.5, md: 2, lg: 4 });
  const missed = (frozen ?? false) && lastCombatEvent?.hitZoneMin === null;
  const visualProgress = releaseAt ?? progress;
  const displayConfig =
    frozen && lastCombatEvent?.activeConfig
      ? lastCombatEvent.activeConfig
      : config;

  return (
    <div
      className="relative h-20 w-full lg:h-28  "
      style={{ backgroundColor: frozen && missed ? "" : "" }}
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
        className="absolute top-0 -bottom-10 md:-bottom-15 lg:-bottom-32 z-40 flex items-end overflow-hidden"
        style={{
          left: `${visualProgress * 100}%`,
          transform: "translateX(-50%)",
        }}
      >
        <SpriteWalkLoop frozen={frozen} scale={scale} />
      </div>
    </div>
  );
};

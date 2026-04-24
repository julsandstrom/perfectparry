import { CombatDisplayEvent, TimingGrade } from "@/app/types";
import { BowArrow, Fish, Shield, Sword, Swords } from "lucide-react";
import AttackSelectionBar from "./AttackSelectionBar";
import { useState } from "react";

interface TimingBarProps {
  progress: number;
  sword: readonly [number, number];
  arrow: readonly [number, number];
  releaseAt?: number | null;
  result?: TimingGrade | null;
  isAttacking: boolean;
  isParry: boolean;
  isCounter: boolean;
  lastCombatEvent?: CombatDisplayEvent | null;
  frozen?: boolean;
}

export const TimingBar = ({
  progress,
  sword,
  arrow,
  isAttacking,
  isParry,
  isCounter,
  lastCombatEvent,
  frozen,
  releaseAt = null,
}: TimingBarProps) => {
  const [pMin, pMax] = sword;
  const [gMin, gMax] = arrow;
  const swordHit = (frozen ?? false) && lastCombatEvent?.hitZone === "sword";
  const arrowHit = (frozen ?? false) && lastCombatEvent?.hitZone === "arrow";
  const missed = (frozen ?? false) && lastCombatEvent?.hitZone === "miss";
  const [mode, setMode] = useState<"attack" | "parry" | "counter">("attack");

  if (isAttacking && mode !== "attack") setMode("attack");
  else if (isParry && mode !== "parry") setMode("parry");
  else if (isCounter && mode !== "counter") setMode("counter");
  const visualProgress = releaseAt ?? progress;
  console.log(
    "frozen:",
    frozen,
    "releaseAt:",
    releaseAt,
    "hitZone:",
    lastCombatEvent?.hitZone,
    "swordHit:",
    swordHit,
    "arrowHit:",
    arrowHit,
    "missed:",
    missed,
  );
  return (
    <div
      className="relative h-16 w-full rounded-xs"
      style={{ backgroundColor: frozen && missed ? "#ef4444" : "#CBA788" }}
    >
      {mode === "attack" && (
        <>
          <AttackSelectionBar
            min={gMin}
            max={gMax}
            icon={<BowArrow size={20} fill="black" />}
            damage={7}
            highlight={arrowHit}
          />
          <AttackSelectionBar
            min={pMin}
            max={pMax}
            icon={<Sword size={20} fill="black" />}
            damage={13}
            highlight={swordHit}
          />
        </>
      )}
      {mode === "parry" && (
        <>
          <AttackSelectionBar
            min={gMin}
            max={gMax}
            icon={<Shield size={20} fill="black" />}
            damage={7}
            highlight={arrowHit}
          />
          <AttackSelectionBar
            min={pMin}
            max={pMax}
            icon={<Swords size={20} fill="black" />}
            damage={13}
            highlight={swordHit}
          />
        </>
      )}
      {mode === "counter" && (
        <>
          <AttackSelectionBar
            min={gMin}
            max={gMax}
            icon={<Fish size={20} fill="black" />}
            damage={0}
            highlight={arrowHit}
          />
          <AttackSelectionBar
            min={pMin}
            max={pMax}
            icon={<BowArrow size={20} fill="black" />}
            damage={13}
            highlight={swordHit}
          />
        </>
      )}
      <div
        className="absolute top-0 bottom-0 left-0 bg-[#151515] z-0"
        style={{ width: `${visualProgress * 100}%` }}
      />
    </div>
  );
};

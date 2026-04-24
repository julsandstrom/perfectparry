import { TimingGrade } from "@/app/types";
import { BowArrow, Shield, Sword, Swords } from "lucide-react";
import AttackSelectionBar from "./AttackSelectionBar";

interface TimingBarProps {
  progress: number;
  sword: readonly [number, number];
  arrow: readonly [number, number];
  releaseAt?: number | null;
  result?: TimingGrade | null;
  isParry: boolean;
}

export const TimingBar = ({
  progress,
  sword,
  arrow,
  isParry,
  releaseAt = null,
  // result = null,
}: TimingBarProps) => {
  const [pMin, pMax] = sword;
  const [gMin, gMax] = arrow;

  // const markerColor =
  //   result === "sword" || result === "perfect"
  //     ? "bg-green-400"
  //     : result === "arrow" || result === "block"
  //       ? "bg-yellow-400"
  //       : result === "miss"
  //         ? "bg-red-500"
  //         : "";

  const visualProgress = releaseAt ?? progress;

  return (
    <div className="relative h-16 w-full rounded-xs bg-[#CBA788] ">
      <AttackSelectionBar
        min={gMin}
        max={gMax}
        icon={
          isParry ? (
            <Shield size={20} fill="black" />
          ) : (
            <BowArrow size={20} fill="black" />
          )
        }
        damage={7}
      />
      <AttackSelectionBar
        min={pMin}
        max={pMax}
        icon={
          isParry ? (
            <Swords size={20} fill="black" />
          ) : (
            <Sword size={20} fill="black" />
          )
        }
        damage={13}
      />
      {/* Fill */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-[#151515]"
        style={{ width: `${visualProgress * 100}%` }}
      />
      {/* Marker */}
      {/* {releaseAt !== null && (
        <div
          className={`absolute top-0 bottom-0 w-0.5 z-50 ${markerColor}`}
          style={{ left: `${releaseAt * 100}%` }}
        />
      )} */}
    </div>
  );
};

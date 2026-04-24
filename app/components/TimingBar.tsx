import { TimingGrade } from "../types";
import { BowArrow, Sword } from "lucide-react";
interface TimingBarProps {
  progress: number;
  perfect: readonly [number, number];
  good: readonly [number, number];
  releaseAt?: number | null;
  result?: TimingGrade | null;
}

export const TimingBar = ({
  progress,
  perfect,
  good,
  releaseAt = null,
  result = null,
}: TimingBarProps) => {
  const [pMin, pMax] = perfect;
  const [gMin, gMax] = good;

  const markerColor =
    result === "perfect"
      ? "bg-green-400"
      : result === "good"
        ? "bg-yellow-400"
        : result === "miss"
          ? "bg-red-500"
          : "";

  const visualProgress = releaseAt ?? progress;

  return (
    <div className="relative h-16 w-full rounded-xs bg-[#CFCFCF] ">
      {/* Bow Attack */}
      <div
        className="absolute top-0 bottom-0 bg-[#924EBA]"
        style={{
          left: `${gMin * 100}%`,
          width: `${(gMax - gMin) * 100}%`,
        }}
      />

      <div
        className="absolute -top-6 text-[#C068F3] z-50"
        style={{ left: `${gMin * 102}%` }}
      >
        <BowArrow size={20} />
      </div>

      {/* Sword Attack */}
      <div
        className="absolute top-0 bottom-0 bg-[#4A5A96]"
        style={{
          left: `${pMin * 100}%`,
          width: `${(pMax - pMin) * 100}%`,
        }}
      />

      <div
        className="absolute -top-6 text-[#96ACFF]"
        style={{ left: `${pMin * 104}%` }}
      >
        <Sword size={20} />
      </div>
      {/* Fill */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-[#151515]"
        style={{ width: `${visualProgress * 100}%` }}
      />

      {/* Marker */}
      {releaseAt !== null && (
        <div
          className={`absolute top-0 bottom-0 w-0.5 z-50 ${markerColor}`}
          style={{ left: `${releaseAt * 100}%` }}
        />
      )}
    </div>
  );
};

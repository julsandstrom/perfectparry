import { TimingGrade } from "../types";

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
    <div className="relative h-6 w-full rounded-xs bg-gray-800 overflow-hidden">
      {/* GOOD ZONE (outer, darker) */}
      <div
        className="absolute top-0 bottom-0 bg-yellow-500/40"
        style={{
          left: `${gMin * 100}%`,
          width: `${(gMax - gMin) * 100}%`,
        }}
      />

      {/* PERFECT ZONE (inner, lighter) */}
      <div
        className="absolute top-0 bottom-0 bg-green-400/70"
        style={{
          left: `${pMin * 100}%`,
          width: `${(pMax - pMin) * 100}%`,
        }}
      />

      {/* Fill */}
      <div
        className="absolute top-0 bottom-0 left-0 bg-blue-500"
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

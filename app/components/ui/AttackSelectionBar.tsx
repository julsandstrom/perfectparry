import { ReactNode } from "react";

interface AttackSelectionBarProps {
  min: number;
  max: number;
  icon: ReactNode;
  damage: number;
}

const AttackSelectionBar = ({
  min,
  max,
  icon,
  damage,
}: AttackSelectionBarProps) => {
  return (
    <>
      {/* Background bar */}
      <div
        className="bg-[#FFEBDA] absolute top-0 bottom-0"
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
          boxShadow: "0px 0px 5px rgba(0,0,0,0.25)",
        }}
      />

      {/* Icon + damage container, same position as bar */}
      <div
        className="absolute top-0 bottom-0 z-50 flex flex-col items-center justify-center"
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
        }}
      >
        <div
          style={{ transform: "translateY(-5px)" }}
          className="flex flex-col items-center "
        >
          <span className="text-black text-sm leading-none">{damage}</span>
          <div className="text-black">{icon}</div>
        </div>
      </div>
    </>
  );
};

export default AttackSelectionBar;

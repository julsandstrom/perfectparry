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
      <div
        className="bg-[#FFEBDA] absolute top-0 bottom-0"
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
        }}
      />
      <div
        className="absolute top-6 z-50 text-black ml-3"
        style={{ left: `${min * 100}%` }}
      >
        {icon}
      </div>
      <div
        className="absolute -top-6  z-50 text-white"
        style={{ left: `${min * 100}%` }}
      >
        {damage}
      </div>
    </>
  );
};

export default AttackSelectionBar;

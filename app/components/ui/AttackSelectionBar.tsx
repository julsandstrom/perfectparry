import { ReactNode } from "react";

interface AttackSelectionBarProps {
  min: number;
  max: number;
  icon: ReactNode;
  damage: number;
  highlight?: boolean;
}

const AttackSelectionBar = ({
  min,
  max,
  icon,
  damage,
  highlight = false,
}: AttackSelectionBarProps) => {
  return (
    <>
      {/* Background bar */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
          backgroundColor: highlight ? "#0DBA39" : "#FFEBDA",
          boxShadow: highlight
            ? "0px 0px 8px rgba(74,222,128,0.6)"
            : "0px 0px 5px rgba(0,0,0,0.25)",
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

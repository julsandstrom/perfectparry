import { ReactNode } from "react";

interface AttackSelectionBarProps {
  min: number;
  max: number;
  icon: ReactNode;
  label: string;
  highlight?: boolean;
}

const AttackSelectionBar = ({
  min,
  max,
  icon,
  label,
  highlight = false,
}: AttackSelectionBarProps) => {
  return (
    <>
      <style>{`
        @keyframes barShake {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-6px); }
          30%  { transform: translateX(6px); }
          45%  { transform: translateX(-4px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
          90%  { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .bar-shake {
          animation: barShake 0.5s ease-out forwards;
        }
      `}</style>

      <div
        key={highlight ? "highlighted" : "normal"}
        className={` absolute top-0 bottom-0 z-10 ${highlight ? "bar-shake" : ""}`}
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
          backgroundColor: highlight ? "#0DBA39" : "#AFD5D2",
          boxShadow: highlight
            ? "1px 0px 0px rgba(74,222,128,0.6)"
            : "1px 0px 0px rgba(0,0,0,0.25)",
        }}
      />

      <div
        key={highlight ? "icon-highlighted" : "icon-normal"}
        className={`absolute top-0 bottom-0 z-50 flex flex-col items-center justify-center ${highlight ? "bar-shake" : ""}`}
        style={{
          left: `${min * 100}%`,
          width: `${(max - min) * 100}%`,
        }}
      >
        <div
          style={{ transform: "translateY(-5px)" }}
          className="flex flex-col items-center"
        >
          <span className="text-black text-sm leading-none">{label}</span>
          <div className="text-black">{icon}</div>
        </div>
      </div>
    </>
  );
};

export default AttackSelectionBar;

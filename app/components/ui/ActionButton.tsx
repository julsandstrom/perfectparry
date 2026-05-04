import { Phase } from "@/app/types";
import { useState } from "react";

interface ActionButtonProps {
  phase: Phase;
  frozen: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onTap: () => void;
}

const ActionButton = ({
  phase,
  frozen,
  onPointerDown,
  onPointerUp,
  onTap,
}: ActionButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const isHoldPhase = phase === "player_attack";
  const isTapPhase = phase === "enemy_attack" || phase === "counter";

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsHolding(true);
    onPointerDown();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsHolding(false);
    onPointerUp();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsHolding(false);
    onPointerUp();
  };

  const handleClick = () => {
    if (!isTapPhase) return;
    onTap();
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <div className=" flex flex-col items-center ">
      <div className="flex flex-col gap-0 w-full h-full px-10 items-center">
        <button
          disabled={frozen || phase === "resolving"}
          className=" h-14 w-48 xl:w-60 xl:h-16 px-5 flex items-center justify-center text-center text-xl xl:text-3xl rounded-xl text-[#F1F1F1] bg-[#325298]   active:bg-[#2C3E65] transition-all select-none disabled:opacity-50 touch-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {phase === "player_attack"
            ? isHolding
              ? "Release!"
              : "Hold to strike"
            : phase === "enemy_attack"
              ? "Tap to block"
              : phase === "counter"
                ? "Tap to counter"
                : "Get ready"}
        </button>
      </div>
    </div>
  );
};

export default ActionButton;

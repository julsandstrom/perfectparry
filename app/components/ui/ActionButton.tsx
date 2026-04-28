import { Phase } from "@/app/types";

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
  const isHoldPhase = phase === "player_attack";
  const isTapPhase = phase === "enemy_attack" || phase === "counter";

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    onPointerDown();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    onPointerUp();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isHoldPhase) return;

    e.currentTarget.releasePointerCapture(e.pointerId);
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
    <div className="font-girassol flex flex-col items-center pb-[env(safe-area-inset-bottom)]">
      <div className="flex flex-col gap-0 w-full h-full">
        <button
          disabled={frozen || phase === "resolving"}
          className="w-full h-16 flex items-center justify-center text-center text-xl   text-[#120C0C] font-semibold bg-[#969E90] hover:bg-zinc-700 active:bg-zinc-600 transition-all select-none disabled:opacity-50 touch-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {phase === "player_attack"
            ? "Hold and release"
            : phase === "enemy_attack"
              ? "Tap to defend"
              : phase === "counter"
                ? "Tap to counter"
                : "Get ready!"}
          {/* Tap! */}
        </button>
      </div>
    </div>
  );
};

export default ActionButton;

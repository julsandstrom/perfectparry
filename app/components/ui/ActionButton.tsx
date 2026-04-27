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
  return (
    <div className=" font-girassol flex flex-col items-center pb-[env(safe-area-inset-bottom)] ">
      <button
        disabled={frozen || phase === "resolving"}
        className="w-40 h-40  flex items-center justify-center text-center text-base text-[#F1F1F1] font-semibold bg-[#1F1F1F] hover:bg-zinc-700 active:bg-zinc-600 rounded-full transition-all  select-none disabled:opacity-50"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={onTap}
      >
        {phase === "player_attack"
          ? "Hold and release"
          : phase === "enemy_attack"
            ? "Tap to defend"
            : phase === "counter"
              ? "Tap to counter"
              : "Get ready!"}
      </button>
    </div>
  );
};

export default ActionButton;

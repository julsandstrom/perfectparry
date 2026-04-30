import VictoryScreen from "../gameOver/VictoryScreen";
import { DefeatScreen } from "../gameOver/DefeatScreen";

import { BattleScene } from "../battleScene/battleScene";

import HpBars from "../hpBars/HpBars";
import ActionButton from "../ui/ActionButton";
import Logo from "../ui/Logo";
import { useCombat } from "@/app/hooks/useCombat";
import { TimingBar } from "../ui/TimingBar";
import Lightning from "../ui/Lightning";
import { CONFUSED_SKELETON } from "@/app/lib/combatConfig";

interface GameProps {
  onRestart: () => void;
  lightning: boolean;
  onMiss: () => void;
}

export default function Game({ onRestart, lightning, onMiss }: GameProps) {
  const {
    phase,
    transition,
    frozen,
    engine,
    anim,
    actions,
    barConfig,
    showEndScreen,
  } = useCombat(CONFUSED_SKELETON, onMiss);
  return (
    <main
      className="relative flex flex-col items-center h-dvh text-white pb-0
  bg-[url('/bg-01.png')] bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
    >
      {lightning && <Lightning />}
      {showEndScreen && phase === "victory" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90">
          <VictoryScreen onRestart={onRestart} />
        </div>
      )}
      {showEndScreen && phase === "defeat" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90">
          <DefeatScreen onRestart={onRestart} />
        </div>
      )}
      <div className="flex flex-col gap-5 w-full flex-1">
        <Logo />
        <div className="mt-[35dvh] ">
          <div className="relative  w-full mx-auto min-h-28 overflow-hidden">
            <BattleScene
              anim={anim}
              lastCombatEvent={engine.lastCombatEvent}
              onHitFrame={actions.onHitFrame}
              transition={transition}
              phase={phase}
              playerStatus={engine.playerStatus}
            />
          </div>
          <div className=" w-full flex justify-center   pt-2">
            <HpBars enemyHp={engine.enemyHp} />
          </div>
        </div>

        <div className="mt-auto w-full">
          <div className="mb-3">
            <TimingBar
              progress={actions.progress}
              config={barConfig}
              releaseAt={actions.releaseAt}
              lastCombatEvent={engine.lastCombatEvent}
              frozen={frozen}
            />
          </div>
          <ActionButton
            phase={phase}
            frozen={frozen}
            onPointerDown={actions.handlePointerDown}
            onPointerUp={actions.handlePointerUp}
            onTap={actions.handleTap}
          />
        </div>
      </div>
    </main>
  );
}

"use client";

import VictoryScreen from "../gameOver/VictoryScreen";
import { DefeatScreen } from "../gameOver/DefeatScreen";

import { BattleScene } from "../battleScene/battleScene";

import HpBars from "../hpBars/HpBars";
import ActionButton from "../ui/ActionButton";
import Logo from "../ui/Logo";
import { useCombat } from "@/app/hooks/useCombat";
import { CONFUSED_SKELETON } from "@/app/lib/combatConfig";
import { TimingBar } from "../ui/TimingBar";

export default function Game({ onRestart }: { onRestart: () => void }) {
  const {
    phase,
    transition,
    frozen,
    engine,
    anim,
    actions,
    barConfig,
    showEndScreen,
  } = useCombat(CONFUSED_SKELETON);

  return (
    <main className="relative flex flex-col items-center min-h-screen bg-[#e2e2e2] text-white pb-0">
      {showEndScreen && phase === "victory" && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/90">
          <VictoryScreen onRestart={onRestart} />
        </div>
      )}{" "}
      {/* <div className="flex justify-center pb-2 font-girassol text-5xl text-[#FFEBDA]">
            {phase === "player_attack"
              ? "Attack"
              : phase === "enemy_attack"
                ? "Defend"
                : phase === "counter"
                  ? "Counter attack"
                  : ""}
          </div> */}
      {showEndScreen && phase === "defeat" && (
        <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/90">
          <DefeatScreen onRestart={onRestart} />
        </div>
      )}
      <div className="flex flex-col gap-10 w-full ">
        <Logo />
        <div>
          <div className="relative  w-full mx-auto min-h-28 overflow-hidden">
            <BattleScene
              anim={anim}
              lastCombatEvent={engine.lastCombatEvent}
              onHitFrame={actions.onHitFrame}
              transition={transition}
            />
          </div>
          <div className=" w-full   pt-2">
            <HpBars playerHp={engine.playerHp} enemyHp={engine.enemyHp} />
          </div>
        </div>
        <div className="mt-10">
          <TimingBar
            progress={actions.progress}
            config={barConfig}
            releaseAt={actions.releaseAt}
            lastCombatEvent={engine.lastCombatEvent}
            frozen={frozen}
          />
        </div>
        <div className="">
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

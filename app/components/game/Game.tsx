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
import { useEffect, useState } from "react";

export default function Game({ onRestart }: { onRestart: () => void }) {
  const [lightning, setLightning] = useState(false);
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

  useEffect(() => {
    console.log("phase changed:", phase);
    if (phase === "enemy_attack") {
      setLightning(true);
      const t = setTimeout(() => setLightning(false), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <main
      className="relative flex flex-col items-center h-dvh text-white pb-0
  bg-[url('/bg-01.png')] bg-top bg-no-repeat bg-[length:100%_auto] bg-[#120C0C]"
    >
      {lightning && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 animate-lightning-flash bg-indigo-200/60" />
          <svg
            className="absolute inset-0 w-full h-full animate-lightning-flash"
            viewBox="0 0 400 800"
            preserveAspectRatio="xMidYMin meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              style={{
                filter:
                  "drop-shadow(0 0 8px #c4baff) drop-shadow(0 0 20px #9080ff)",
              }}
            >
              <polyline
                points="210,0 195,80 212,80 190,170 208,170 180,290"
                stroke="#e0dcff"
                strokeWidth="2.5"
                fill="none"
              />
              <polyline
                points="210,0 195,80 212,80 190,170 208,170 180,290"
                stroke="white"
                strokeWidth="0.8"
                fill="none"
              />
            </g>
            <g style={{ filter: "drop-shadow(0 0 5px #b8aaff)" }}>
              <polyline
                points="300,0 286,60 300,60 275,130 290,130 260,230"
                stroke="#c8c2ff"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          </svg>
        </div>
      )}
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
          {" "}
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

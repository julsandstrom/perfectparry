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
import { useEffect } from "react";
import HealthStatus from "../statusLabel/HealthStatus";

interface GameProps {
  onRestart: () => void;
  lightning: boolean;
  onMiss: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  endAudioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function Game({
  onRestart,
  lightning,
  onMiss,
  audioRef,
  endAudioRef,
}: GameProps) {
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

  useEffect(() => {
    if (!showEndScreen) return;
    const audio = audioRef.current;
    if (!audio) return;

    const FADE_MS = 500;
    const STEPS = 40;
    const startVolume = audio.volume;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVolume * (1 - step / STEPS));
      if (step >= STEPS) {
        clearInterval(interval);
        audio.pause();
        const endAudio = new Audio("/music/Title-Theme.mp3");
        endAudio.volume = 0.5;
        endAudio.play();
        endAudioRef.current = endAudio;
      }
    }, FADE_MS / STEPS);

    return () => clearInterval(interval);
  }, [showEndScreen, audioRef, endAudioRef]);

  return (
    <main
      className="relative flex flex-col h-dvh text-white
bg-[url('/bg-01.png')] bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
      style={
        engine.playerStatus === "critical"
          ? {
              backgroundImage: `url('/bg-01.png'), linear-gradient(to top, #550808 0%, #120C0C 15%, transparent 20%`,
            }
          : engine.playerStatus === "healthy"
            ? {
                backgroundImage: `url('/bg-01.png'), linear-gradient(to top, #09380A 0%, #120C0C 15%, transparent 20%`,
              }
            : engine.playerStatus === "low"
              ? {
                  backgroundImage: `url('/bg-01.png'), linear-gradient(to top, #573A00 0%, #120C0C 15%, transparent 20%`,
                }
              : undefined
      }
    >
      {" "}
      <div className="absolute w-full top-[70vw]">
        <BattleScene
          anim={anim}
          lastCombatEvent={engine.lastCombatEvent}
          onHitFrame={actions.onHitFrame}
          transition={transition}
          phase={phase}
          playerStatus={engine.playerStatus}
        />
      </div>
      {lightning && <Lightning />}
      {showEndScreen && phase === "victory" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90">
          <VictoryScreen onRestart={onRestart} stats={engine.combatStats} />
        </div>
      )}
      {showEndScreen && phase === "defeat" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90">
          <DefeatScreen onRestart={onRestart} />
        </div>
      )}
      {/* Top */}
      <div className="flex justify-center shrink-0">
        <Logo />
      </div>{" "}
      <div className="w-full flex justify-center mt-20">
        <HpBars enemyHp={engine.enemyHp} />
      </div>
      {/* Bottom */}
      <div className="flex-1" />
      <div className="relative z-50 ">
        {" "}
        <HealthStatus playerStatus={engine.playerStatus} />
        <ActionButton
          phase={phase}
          frozen={frozen}
          onPointerDown={actions.handlePointerDown}
          onPointerUp={actions.handlePointerUp}
          onTap={actions.handleTap}
        />
      </div>
      <div className=" mt-10">
        <TimingBar
          progress={actions.progress}
          config={barConfig}
          releaseAt={actions.releaseAt}
          lastCombatEvent={engine.lastCombatEvent}
          frozen={frozen}
        />
      </div>
    </main>
  );
}

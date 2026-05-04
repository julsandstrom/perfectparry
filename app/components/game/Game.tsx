import VictoryScreen from "../gameOver/VictoryScreen";
import { DefeatScreen } from "../gameOver/DefeatScreen";

import { BattleScene } from "../battleScene/battleScene";

import ActionButton from "../ui/ActionButton";
import Logo from "../ui/Logo";
import { useCombat } from "@/app/hooks/useCombat";
import { TimingBar } from "../ui/TimingBar";
import Lightning from "../ui/Lightning";
import { CONFUSED_SKELETON } from "@/app/lib/combatConfig";
import { useEffect } from "react";

import { HpBar } from "../ui/HpBar";
import { useSoundEnabled } from "@/app/context/SoundContext";

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
  const { soundEnabled } = useSoundEnabled();
  useEffect(() => {
    if (soundEnabled) {
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
    }
  }, [showEndScreen, audioRef, endAudioRef, soundEnabled]);

  return (
    <main
      className="relative flex flex-col h-dvh text-white
  bg-[url('/background/bg-mobile.png')] sm:bg-[url('/background/bg-ipad-744.png')] md:bg-[url('/background/bg-desktop-1280.png')] xl:bg-[url('/background/bg-desktop-1728.png')]  bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
      data-status={engine.playerStatus}
    >
      {" "}
      <div className="absolute w-full top-[70vw] sm:top-[50vw] md:top-[30vw] lg:top-[20vw] xl:top-[20vw]">
        <BattleScene
          anim={anim}
          lastCombatEvent={engine.lastCombatEvent}
          onHitFrame={actions.onHitFrame}
          transition={transition}
          phase={phase}
          playerStatus={engine.playerStatus}
        />{" "}
      </div>
      <div className="absolute w-full top-[calc(30vw+5rem)] sm:top-[calc(25vw+5rem)]   md:top-[calc(20vw+5rem)] lg:top-[calc(5vw+5rem)] xl:top-[calc(8vw+5rem)] z-50 flex justify-between items-end px-10 sm:px-20 xl:px-60 2xl:px-80">
        <div className="flex flex-col w-full">
          <span className="text-sm font-girassol w-full xl:text-xl">You</span>
          <HpBar hp={engine.playerHp} max={25} colorClass="bg-[#FF2020]" />
          <span className="text-base xl:text-xl">{engine.playerHp}hp</span>
        </div>

        <div className="flex flex-col items-end  w-full">
          <span className="text-sm font-girassol xl:text-xl ">Skeleton</span>
          <HpBar hp={engine.enemyHp} max={30} colorClass="bg-[#FF2020]" />
          <span className="text-base xl:text-xl">{engine.enemyHp}hp</span>
        </div>
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
      {/* Bottom */}
      <div className="flex-1" />
      <div className="relative z-50 ">
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

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

import { useSoundEnabled } from "@/app/context/SoundContext";
import { ChevronLeft, LogOut } from "lucide-react";

interface GameProps {
  onRestart: () => void;
  lightning: boolean;
  onMiss: () => void;
  onExit: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  endAudioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function Game({
  onRestart,
  lightning,
  onMiss,
  onExit,
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
      className="relative overflow-hidden flex justify-center h-dvh text-white 
  bg-[url('/background/bg-mobile.png')] sm:bg-[url('/background/bg-ipad-744.png')] md:bg-[url('/background/bg-desktop-1280.png')] xl:bg-[url('/background/bg-desktop-1728.png')]  bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
      data-status={engine.playerStatus}
    >
      {" "}
      {showEndScreen && phase === "victory" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90 w-full">
          <VictoryScreen onRestart={onRestart} stats={engine.combatStats} />
        </div>
      )}
      {showEndScreen && phase === "defeat" && (
        <div className="absolute inset-0 z-70 flex items-center justify-center bg-black/90 w-full">
          <DefeatScreen onRestart={onRestart} />
        </div>
      )}{" "}
      <div className="relative flex flex-col h-dvh w-full max-w-110 sm:max-w-500">
        <div className="absolute max-w-500 w-full top-[70vw] sm:top-[50vw] md:top-[30vw] lg:top-[20vw] xl:top-[20vw] 2xl:top-[25vw]">
          <BattleScene
            anim={anim}
            lastCombatEvent={engine.lastCombatEvent}
            onHitFrame={actions.onHitFrame}
            transition={transition}
            phase={phase}
            playerStatus={engine.playerStatus}
            playerHp={engine.playerHp}
            enemyHp={engine.enemyHp}
          />
        </div>
        {lightning && <Lightning />}
        {/* Top */}
        <div className="flex justify-between items-center shrink-0 px-4 sm:px-6">
          <button
            onClick={onExit}
            className="w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center text-black bg-[#D9D9D9] rounded-sm self-center mt-4 hover:bg-[#bababa]"
          >
            <ChevronLeft
              className="w-5 h-5 sm:w-9 sm:h-9 md:w-9 md:h-9"
              strokeWidth={1}
            />
          </button>
          <Logo />
          <div className="w-20"></div>
        </div>{" "}
        {/* Bottom */}
        <div className="flex-1" />
        {!showEndScreen && (
          <>
            <div className="relative z-50">
              <ActionButton
                phase={phase}
                frozen={
                  frozen ||
                  (phase === "player_attack" && actions.actionDisabled)
                }
                onPointerDown={actions.handlePointerDown}
                onPointerUp={actions.handlePointerUp}
                onTap={actions.handleTap}
              />
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
          </>
        )}
      </div>
    </main>
  );
}

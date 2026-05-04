"use client";
import { useCombatAnimations } from "@/app/hooks/useCombatAnimations";
import { SpriteWalk } from "../Sprites/player/SpriteWalk";
import Logo from "../ui/Logo";
import { BowArrow, Fish, Sword, Swords } from "lucide-react";
import { useSoundEnabled } from "@/app/context/SoundContext";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const anim = useCombatAnimations();
  const { soundEnabled, setSoundEnabled } = useSoundEnabled();

  const handleStart = () => {
    anim.triggerWalkIn();
    onStart();
  };

  return (
    <main
      className="relative flex flex-col items-center h-dvh text-white
      bg-[url('/bg-01.png')] bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
    >
      <Logo />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-7">
        <div className="flex flex-col items-start bg-[#969E90] py-4 rounded-sm min-w-80 px-4 text-black gap-2">
          <div>
            {" "}
            <h1 className="text-xl font-girassol text-center self-center mb-2">
              How to play
            </h1>
            <p className="text-base">
              <span className="font-bold">While attacking:</span> Hold, then
              release at the right time
            </p>
            <p className="text-base">
              <span className="font-bold">While defending:</span> Tap at the
              right time
            </p>
          </div>
          <div>
            {" "}
            <p className="text-base text-center self-center mt-5 font-bold">
              Stop the marker on the icons to perform actions
            </p>
            <div className="flex gap-10 pb-2 justify-center w-full">
              <div className="flex flex-col items-center">
                Heal
                <Fish />
              </div>
              <div className="flex flex-col items-center">
                Bow
                <BowArrow />
              </div>
              <div className="flex flex-col items-center">
                Sword
                <Sword />
              </div>
              <div className="flex flex-col items-center">
                Parry
                <Swords />
              </div>
            </div>{" "}
          </div>
          <label className="flex items-center gap-1 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-[#325298]"
            />
            Sound
          </label>
        </div>
        <div className="relative w-full min-h-10">
          <div className="absolute -bottom-3 -right-18">
            {anim.playerAnim === "walk_in" && (
              <SpriteWalk
                trigger={anim.walkInTrigger}
                onComplete={() => anim.triggerWalkIn()}
                scale={2}
              />
            )}
          </div>
        </div>
        <button
          onClick={handleStart}
          className="bg-[#325298] text-[#F1F1F1] px-10 py-3 rounded-xs font-girassol border-white/20 border-[0.2px]"
        >
          Fight Boss
        </button>
      </div>
    </main>
  );
}

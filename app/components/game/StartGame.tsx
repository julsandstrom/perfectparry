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
      bg-[url('/background/bg-mobile.png')] sm:bg-[url('/background/bg-ipad-744.png')] md:bg-[url('/background/bg-desktop-1280.png')] xl:bg-[url('/background/bg-desktop-1728.png')] bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
    >
      <Logo />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-7">
        <div className="flex flex-col items-start bg-[#969E90] py-4 rounded-sm min-w-80 lg:min-w-96 px-4 lg:px-10 text-black gap-2">
          <div>
            {" "}
            <h1 className="text-xl font-girassol text-center self-center mb-2 lg:text-2xl">
              How to play
            </h1>
            <p className="text-base lg:text-2xl">
              <span className="font-bold">While attacking:</span> Hold, then
              release at the right time
            </p>
            <p className="text-base lg:text-2xl">
              <span className="font-bold">While defending:</span> Tap at the
              right time
            </p>
          </div>
          <div className="mx-auto">
            {" "}
            <p className="text-base lg:text-2xl text-center self-center mt-5 font-bold">
              Stop the marker on the icons to perform actions
            </p>
            <div className="flex gap-10 lg:gap-16 pb-2 justify-center lg:text-xl w-full lg:mt-3 items-center">
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
          <label className="flex items-center gap-1 lg:gap-2 text-sm lg:text-xl cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="accent-[#325298]"
            />
            Sound
          </label>
        </div>
        {/* <div className="relative w-full min-h-10">
          <div className="absolute -bottom-3 -right-18">
            {anim.playerAnim === "walk_in" && (
              <SpriteWalk
                trigger={anim.walkInTrigger}
                onComplete={() => anim.triggerWalkIn()}
                scale={2}
              />
            )}
          </div>
        </div> */}
        <button
          onClick={handleStart}
          className="bg-[#325298] text-[#F1F1F1] px-10 py-3 rounded-xs font-girassol border-white/20 border-[0.2px] lg:w-60 lg:py-4 lg:text-xl"
        >
          Fight Boss
        </button>
      </div>
    </main>
  );
}

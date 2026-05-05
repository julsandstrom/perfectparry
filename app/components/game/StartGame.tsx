"use client";
import { useCombatAnimations } from "@/app/hooks/useCombatAnimations";

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

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-6 ">
        {/* Modal */}
        <div className="flex flex-col items-start bg-[#969E90] py-4 rounded-sm min-w-80 lg:min-w-96 px-4 lg:px-10 text-black gap-4 lg:gap-8">
          <h1 className="text-xl font-girassol text-center self-center lg:text-2xl mb-2">
            How to play
          </h1>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-xl lg:text-3xl leading-0">
              While attacking:
            </span>
            <p className="text-base lg:text-2xl">
              Hold, then release at the right time
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-bold text-xl leading-0 lg:text-3xl">
              While defending:
            </span>
            <p className="text-base lg:text-2xl">Tap at the right time</p>
          </div>

          {/* Icon explanation */}
          <div className="w-full flex flex-col items-center gap-0">
            <p className="text-base lg:text-2xl text-center font-bold">
              Stop the marker on the icons to perform actions
            </p>
            <div className="flex gap-10 lg:gap-16 justify-center lg:text-xl w-full items-center">
              <div className="flex flex-col items-center">
                Heal <Fish />
              </div>
              <div className="flex flex-col items-center">
                Bow <BowArrow />
              </div>
              <div className="flex flex-col items-center">
                Sword <Sword />
              </div>
              <div className="flex flex-col items-center">
                Parry <Swords />
              </div>
            </div>
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

        <button
          onClick={handleStart}
          className="bg-[#325298] text-[#F1F1F1] px-10 py-3 rounded-sm font-girassol border-white/20 border-[0.2px] lg:w-60 lg:py-4 lg:text-xl"
        >
          Fight Boss
        </button>
      </div>
    </main>
  );
}

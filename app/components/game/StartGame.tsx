"use client";
import { useCombatAnimations } from "@/app/hooks/useCombatAnimations";
import { SpriteWalk } from "../Sprites/player/SpriteWalk";

export default function StartScreen({ onStart }: { onStart: () => void }) {
  const anim = useCombatAnimations();

  const handleStart = () => {
    anim.triggerWalkIn();
    setTimeout(onStart, 1500);
  };

  return (
    <main
      className="relative flex flex-col items-center h-dvh text-white
      bg-[url('/bg-01.png')] bg-top bg-no-repeat bg-size-[100%_auto] bg-[#120C0C]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[30px]">
        <div className="flex flex-col items-start bg-[#969E90] py-2 rounded-sm min-w-80 px-4 text-black gap-2">
          <h1 className="text-xl font-girassol text-center self-center mb-2">
            How to play
          </h1>
          <p className="text-base">
            <span className="font-bold">While attacking:</span> Hold, then
            release at the right time
          </p>
          <p className="text-base">
            <span className="font-bold">While defending:</span> Tap at the right
            time
          </p>
          <p className="text-base text-center self-center">
            Stop the marker on the icons to perform actions
          </p>
        </div>
        <div className="relative w-full min-h-10">
          <div className="absolute" style={{ bottom: 13, left: 30 }}>
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
          className="bg-[#FF4E4E] text-black px-10 py-3 rounded-xs font-girassol border-white/60 border-[0.2px]"
        >
          Fight Boss
        </button>
      </div>
    </main>
  );
}

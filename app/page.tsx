"use client";
import { useCombatPhase } from "./hooks/useCombatPhase";
import { useCombatEngine } from "./hooks/useCombatEngine";
import { useCombatAnimations } from "./hooks/useCombatAnimations";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatController } from "./hooks/useCombatController";
import { TimingBar } from "./components/TimingBar";
import { HpBar } from "./components/HpBar";
import { ATTACK_WINDOW, PARRY_WINDOW } from "./lib/combatConfig";
import { RESULT_LABELS } from "./lib/resultOutput";
import { SpriteIdle } from "./components/SpriteIdle";
import { SpriteAttack } from "./components/SpriteAttack";
import { SpriteHurt } from "./components/SpriteHurt";
import { SpriteParry } from "./components/SpriteParry";
import { SpriteCounterAttack } from "./components/SpriteCounterAttack";
import VictoryScreen from "./components/VictoryScreen";
import { DefeatScreen } from "./components/DefeatScreen";
import { useCallback } from "react";
import { SpriteEnemyIdle } from "./components/SpriteEnemyIdle";
import { SpriteWalk } from "./components/SpriteWalk";

export default function Home() {
  const { phase, result, setResult, transition, resolve } = useCombatPhase();
  const engine = useCombatEngine(transition, resolve);
  const anim = useCombatAnimations();

  const {
    progress,
    start,
    stop,
    reset,
    releaseAt,
    setReleaseAt,
    onHitFrame,
    handlePointerDown,
    handlePointerUp,
    handleTap,
  } = useCombatActions({
    phase,
    engine,
    anim,
    setResult,
    onParryTimeout: (p) => {
      const { event, result } = engine.onParry(p);
      setResult(result);
      if (event.type === "HURT") anim.triggerHurt();
      else if (event.type === "PARRY") anim.triggerParry();
    },
  });

  const resetUI = useCallback(() => setReleaseAt(null), [setReleaseAt]);
  useCombatController({ phase, start, stop, reset, resetUI });

  const isParry = phase === "enemy_attack";
  const timingWindow = isParry ? PARRY_WINDOW : ATTACK_WINDOW;

  const label = result
    ? isParry
      ? RESULT_LABELS.parry[result]
      : RESULT_LABELS.attack[result]
    : null;

  const playerLeft =
    anim.animState === "walk_in" || anim.animState === "attack"
      ? "-left-8"
      : "-left-35";

  if (phase === "victory") return <VictoryScreen />;
  if (phase === "defeat") return <DefeatScreen />;

  return (
    <main className="flex  min-h-screen bg-zinc-950 text-white ">
      <div className="w-full max-w-105 space-y-8">
        <HpBar hp={engine.enemyHp} max={100} colorClass="bg-red-500" />{" "}
        <HpBar hp={engine.playerHp} max={100} colorClass="bg-emerald-500" />
        {label && (
          <p className="text-center text-2xl font-bold text-yellow-400">
            {label}
          </p>
        )}
        <div className="relative w-full h-[200px] overflow-hidden">
          {/* Player - anchored bottom-left */}
          <div
            className={`absolute bottom-0 transition-left duration-300 ${playerLeft}`}
          >
            {anim.animState === "walk_in" ? (
              <SpriteWalk
                trigger={anim.walkInTrigger}
                onComplete={() => anim.triggerAttack()}
              />
            ) : anim.animState === "attack" ? (
              <SpriteAttack
                trigger={anim.attackTrigger}
                onHitFrame={onHitFrame}
                onComplete={() => anim.triggerWalkOut()}
              />
            ) : anim.animState === "walk_out" ? (
              <SpriteWalk
                trigger={anim.walkOutTrigger}
                flipped={true}
                onComplete={() => anim.dispatchAnim({ type: "RESET" })}
              />
            ) : anim.animState === "hurt" ? (
              <SpriteHurt
                trigger={anim.hurtTrigger}
                onComplete={() => anim.dispatchAnim({ type: "RESET" })}
              />
            ) : anim.animState === "parry" ? (
              <SpriteParry
                trigger={anim.parryTrigger}
                onComplete={() => anim.dispatchAnim({ type: "RESET" })}
              />
            ) : anim.animState === "counter" ? (
              <SpriteCounterAttack
                trigger={anim.counterTrigger}
                onHitFrame={onHitFrame}
                onComplete={() => anim.dispatchAnim({ type: "RESET" })}
              />
            ) : (
              <SpriteIdle />
            )}
          </div>
          <div className="absolute bottom-0 right-0">
            <SpriteEnemyIdle />
          </div>
        </div>
        <TimingBar
          progress={progress}
          perfect={timingWindow.perfect}
          good={timingWindow.good}
          releaseAt={releaseAt}
          result={result}
        />
        <div className="flex-1">
          {" "}
          <button
            className="w-full py-6 text-xl font-semibold bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl transition-all active:scale-[0.985] select-none"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={handleTap}
          >
            {phase === "player_attack"
              ? "Hold to Charge Attack"
              : "Tap to Parry!"}
          </button>
        </div>
      </div>
    </main>
  );
}

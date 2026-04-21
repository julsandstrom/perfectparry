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

export default function Home() {
  const { phase, result, setResult, transition } = useCombatPhase();
  const engine = useCombatEngine(transition);
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

  if (phase === "victory") return <VictoryScreen />;
  if (phase === "defeat") return <DefeatScreen />;

  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
      <div className="w-full max-w-105 space-y-8">
        <HpBar hp={engine.enemyHp} max={100} colorClass="bg-red-500" />
        <HpBar hp={engine.playerHp} max={100} colorClass="bg-emerald-500" />

        {label && (
          <p className="text-center text-2xl font-bold text-yellow-400">
            {label}
          </p>
        )}

        {anim.animState === "hurt" ? (
          <SpriteHurt
            trigger={anim.hurtTrigger}
            onComplete={() => anim.dispatchAnim({ type: "RESET" })}
          />
        ) : anim.animState === "attack" ? (
          <SpriteAttack
            trigger={anim.attackTrigger}
            onHitFrame={onHitFrame}
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

        <TimingBar
          progress={progress}
          perfect={timingWindow.perfect}
          good={timingWindow.good}
          releaseAt={releaseAt}
          result={result}
        />

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

        <p className="text-center text-zinc-400 text-sm px-4">
          {phase === "player_attack"
            ? "Hold button. Release in the marked area"
            : "Tap exactly when the bar is in the white zone"}
        </p>
      </div>
    </main>
  );
}

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
import { SpriteEnemyAttack } from "./components/SpriteEnemyAttack";
import { SpriteEnemyWalk } from "./components/SpriteEnemyWalk";
import { SpriteEnemyHurt } from "./components/SpriteEnemyHurt";
import { SpriteEnemyDie } from "./components/SpriteEnemyDie";
import { SpriteDie } from "./components/SpriteDie";

export default function Home() {
  const { phase, result, setResult, transition, resolve } = useCombatPhase();
  const anim = useCombatAnimations();

  const engine = useCombatEngine(
    transition,
    resolve,
    () => anim.triggerEnemyDie(),
    () => anim.triggerDie(),
  );

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
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
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
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "-left-8"
      : "-left-35";

  const enemyRight =
    anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack"
      ? "right-16"
      : "right-0";

  return (
    <main className="relative flex flex-col min-h-screen bg-[#151515] text-white">
      {phase === "victory" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <VictoryScreen />
        </div>
      )}

      {phase === "defeat" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60">
          <DefeatScreen />
        </div>
      )}
      <div className="flex flex-col flex-1 max-w-105 w-full mx-auto">
        <div className="flex flex-col w-full max-w-105 flex-1">
          {label && (
            <p className="text-center text-2xl font-bold text-yellow-400">
              {label}
            </p>
          )}
          <div className="relative w-full h-50 overflow-hidden">
            {/* Player - anchored bottom-left */}
            <div
              className={`absolute bottom-0 transition-left duration-300 ${playerLeft}`}
            >
              {anim.playerAnim === "walk_in" ? (
                <SpriteWalk
                  trigger={anim.walkInTrigger}
                  onComplete={() => anim.triggerAttack()}
                />
              ) : anim.playerAnim === "attack" ? (
                <SpriteAttack
                  trigger={anim.attackTrigger}
                  onHitFrame={onHitFrame}
                  onComplete={() => anim.triggerWalkOut()}
                />
              ) : anim.playerAnim === "walk_out" ? (
                <SpriteWalk
                  trigger={anim.walkOutTrigger}
                  flipped={true}
                  onComplete={() => anim.resetPlayer()}
                />
              ) : anim.playerAnim === "hurt" ? (
                <SpriteHurt
                  trigger={anim.hurtTrigger}
                  onComplete={() => anim.resetPlayer()}
                />
              ) : anim.playerAnim === "parry" ? (
                <SpriteParry
                  trigger={anim.parryTrigger}
                  onComplete={() => anim.resetPlayer()}
                />
              ) : anim.playerAnim === "counter" ? (
                <SpriteCounterAttack
                  trigger={anim.counterTrigger}
                  onHitFrame={onHitFrame}
                  onComplete={() => anim.resetPlayer()}
                />
              ) : anim.playerAnim === "die" ? (
                <SpriteDie
                  trigger={anim.playerDieTrigger}
                  onComplete={() => transition("defeat")}
                />
              ) : (
                <SpriteIdle />
              )}
            </div>

            <div
              className={`absolute z-50 bottom-0 transition-all duration-300 ${enemyRight}`}
            >
              {anim.enemyAnim === "walk_in" ? (
                <SpriteEnemyWalk
                  trigger={anim.enemyWalkInTrigger}
                  onComplete={() => anim.triggerEnemyAttackAnim()}
                />
              ) : anim.enemyAnim === "attack" ? (
                <SpriteEnemyAttack
                  trigger={anim.enemyAttackTrigger}
                  onComplete={() => anim.triggerEnemyWalkOut()}
                />
              ) : anim.enemyAnim === "walk_out" ? (
                <SpriteEnemyWalk
                  trigger={anim.enemyWalkOutTrigger}
                  flipped={true}
                  onComplete={() => {
                    if (
                      anim.pendingEnemyResult.current === "hurt" &&
                      anim.playerAnim !== "die"
                    )
                      anim.triggerHurt();
                    anim.resetEnemy();
                  }}
                />
              ) : anim.enemyAnim === "hurt" ? (
                <SpriteEnemyHurt
                  trigger={anim.enemyHurtTrigger}
                  onComplete={() => anim.resetEnemy()}
                />
              ) : anim.enemyAnim === "die" ? (
                <SpriteEnemyDie
                  trigger={anim.enemyDieTrigger}
                  onComplete={() => transition("victory")}
                />
              ) : (
                <SpriteEnemyIdle />
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-20 mb-32">
            {" "}
            <HpBar hp={engine.playerHp} max={100} colorClass="bg-[#FF1A1A]" />
            <HpBar
              hp={engine.enemyHp}
              max={100}
              colorClass="bg-[#FF1A1A]"
            />{" "}
          </div>
          <TimingBar
            progress={progress}
            perfect={timingWindow.perfect}
            good={timingWindow.good}
            releaseAt={releaseAt}
            result={result}
          />
        </div>
        <div className="flex-1 flex items-end pb-[env(safe-area-inset-bottom)]">
          {" "}
          <button
            className="w-full py-6 text-xl text-black font-semibold bg-[#CFCFCF] hover:bg-zinc-700 active:bg-zinc-600 rounded-xs transition-all active:scale-[0.985] select-none"
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

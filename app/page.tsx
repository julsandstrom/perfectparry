"use client";
import { useCombatPhase } from "./hooks/useCombatPhase";
import { useCombatEngine } from "./hooks/useCombatEngine";
import { useCombatAnimations } from "./hooks/useCombatAnimations";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatController } from "./hooks/useCombatController";
import { TimingBar } from "./components/ui/TimingBar";
import { HpBar } from "./components/ui/HpBar";
import { ATTACK_WINDOW, PARRY_WINDOW } from "./lib/combatConfig";
import { RESULT_LABELS } from "./lib/resultOutput";
import { SpriteIdle } from "./components/Sprites/player/SpriteIdle";
import { SpriteAttack } from "./components/Sprites/player/SpriteAttack";
import { SpriteHurt } from "./components/Sprites/player/SpriteHurt";
import { SpriteParry } from "./components/Sprites/player/SpriteParry";
import { SpriteCounterAttack } from "./components/Sprites/player/SpriteCounterAttack";
import VictoryScreen from "./components/gameOver/VictoryScreen";
import { DefeatScreen } from "./components/gameOver/DefeatScreen";
import { useCallback } from "react";
import { SpriteEnemyIdle } from "./components/Sprites/enemy/SpriteEnemyIdle";
import { SpriteWalk } from "./components/Sprites/player/SpriteWalk";
import { SpriteEnemyAttack } from "./components/Sprites/enemy/SpriteEnemyAttack";
import { SpriteEnemyWalk } from "./components/Sprites/enemy/SpriteEnemyWalk";
import { SpriteEnemyHurt } from "./components/Sprites/enemy/SpriteEnemyHurt";
import { SpriteEnemyDie } from "./components/Sprites/enemy/SpriteEnemyDie";
import { SpriteDie } from "./components/Sprites/player/SpriteDie";

export default function Home() {
  const {
    phase,
    result,
    transition,
    resolve,
    setParryResult,
    setAttackResult,
    resultContext,
    frozen,
  } = useCombatPhase();
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
    setAttackResult,
    setParryResult,
    onParryTimeout: (p) => {
      const { event, result } = engine.onParry(p);
      setParryResult(result);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
    },
  });

  const resetUI = useCallback(() => setReleaseAt(null), [setReleaseAt]);
  useCombatController({ phase, start, stop, reset, resetUI });

  const isAttacking = phase === "player_attack";
  const isParry = phase === "enemy_attack";
  const isCounter = phase === "counter";
  const { lastCombatEvent } = engine;
  const playerLeft =
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "left-5"
      : "-left-28";

  const enemyRight =
    anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack"
      ? "right-32"
      : "right-0";

  return (
    <main className="relative flex flex-col min-h-screen bg-[#151515] text-white">
      {" "}
      {frozen && (
        <div className="absolute inset-0 bg-white/10 pointer-events-none animate-pulse z-40" />
      )}
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
        {" "}
        <h1 className="pt-2  font-girassol text-base text-[#FFEBDA] ">
          Perfect Parry
        </h1>
        <span className="font-extralight text-xs text-white/70">
          Precision beats power
        </span>
        <div className="flex flex-col w-full max-w-105 flex-1  mt-20">
          <div className="flex justify-center pb-2 pt-20 font-girassol text-5xl text-[#FFEBDA]">
            {phase === "player_attack" ? (
              <span>Attack</span>
            ) : phase === "enemy_attack" ? (
              <span>Defend</span>
            ) : phase === "counter" ? (
              <span>Counter attack</span>
            ) : (
              "..."
            )}
          </div>

          <div className="relative w-full h-50 ">
            {lastCombatEvent && (
              <span
                className="absolute z-50 text-3xl font-bold flex flex-col items-center"
                style={{
                  bottom: "100px",
                  right: lastCombatEvent.playerDamage ? undefined : "50px",
                  left: lastCombatEvent.playerDamage ? "50px" : undefined,
                }}
              >
                <p className="text-center text-base font-bold text-yellow-400">
                  {lastCombatEvent.label}
                </p>
                {lastCombatEvent.enemyDamage &&
                  `-${lastCombatEvent.enemyDamage}`}
                {lastCombatEvent.playerDamage &&
                  `-${lastCombatEvent.playerDamage}`}
              </span>
            )}
            <div
              className={`absolute bottom-0 transition-left duration-600 ${playerLeft}`}
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
              ) : anim.playerAnim === "bow_attack" ? (
                <SpriteCounterAttack
                  trigger={anim.bowAttackTrigger}
                  onHitFrame={onHitFrame}
                  onComplete={() => anim.resetPlayer()}
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
              className={`absolute z-50 bottom-0 transition-all duration-600 ${enemyRight}`}
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
            <div className="flex flex-col items-center w-full mt-4">
              <span className="w-full text-center text-sm ">You</span>
              <HpBar hp={engine.playerHp} max={20} colorClass="bg-[#D23B3B]" />
            </div>
            <div className="flex flex-col items-center w-full mt-4">
              {" "}
              <span className="w-full text-center text-sm ">
                Confused Skeleton
              </span>
              <HpBar
                hp={engine.enemyHp}
                max={40}
                colorClass="bg-[#D23B3B]"
              />{" "}
            </div>
          </div>
          <TimingBar
            progress={progress}
            sword={isParry ? PARRY_WINDOW.perfect : ATTACK_WINDOW.sword}
            arrow={isParry ? PARRY_WINDOW.block : ATTACK_WINDOW.arrow}
            releaseAt={releaseAt}
            result={result}
            isAttacking={isAttacking}
            isParry={isParry}
            isCounter={isCounter}
            lastCombatEvent={engine.lastCombatEvent}
            frozen={frozen}
          />
        </div>
        <div className="flex-1 font-girassol flex flex-col items-end pb-[env(safe-area-inset-bottom)] m-2">
          <button
            disabled={frozen || phase === "resolving"}
            className="w-full py-6 text-xl text-black font-semibold bg-[#CDB9A8] hover:bg-zinc-700 active:bg-zinc-600 rounded-xs transition-all active:scale-[0.985] select-none disabled:opacity-50"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onClick={handleTap}
          >
            {phase === "player_attack"
              ? "Hold to Charge Attack"
              : phase === "enemy_attack"
                ? "Tap to parry"
                : phase === "counter"
                  ? "Tap to counter"
                  : "Get ready to defend!"}
          </button>
        </div>
      </div>
    </main>
  );
}

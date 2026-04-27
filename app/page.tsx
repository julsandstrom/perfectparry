"use client";
import { useCombatPhase } from "./hooks/useCombatPhase";
import { useCombatEngine } from "./hooks/useCombatEngine";
import { useCombatAnimations } from "./hooks/useCombatAnimations";
import { useCombatActions } from "./hooks/useCombatActions";
import { useCombatController } from "./hooks/useCombatController";
import { TimingBar } from "./components/ui/TimingBar";
import { HpBar } from "./components/ui/HpBar";
import {
  CONFUSED_SKELETON,
  DEFAULT_ATTACK_BAR,
  DEFAULT_COUNTER_BAR,
  DEFAULT_PARRY_BAR,
  getAttackBar,
  getCounterBar,
  getParryBar,
} from "./lib/combatConfig";
import { SpriteIdle } from "./components/Sprites/player/SpriteIdle";
import { SpriteAttack } from "./components/Sprites/player/SpriteAttack";
import { SpriteHurt } from "./components/Sprites/player/SpriteHurt";
import { SpriteParry } from "./components/Sprites/player/SpriteParry";
import { SpriteCounterAttack } from "./components/Sprites/player/SpriteCounterAttack";
import VictoryScreen from "./components/gameOver/VictoryScreen";
import { DefeatScreen } from "./components/gameOver/DefeatScreen";
import { useCallback, useEffect, useState, useTransition } from "react";
import { SpriteEnemyIdle } from "./components/Sprites/enemy/SpriteEnemyIdle";
import { SpriteWalk } from "./components/Sprites/player/SpriteWalk";
import { SpriteEnemyAttack } from "./components/Sprites/enemy/SpriteEnemyAttack";
import { SpriteEnemyWalk } from "./components/Sprites/enemy/SpriteEnemyWalk";
import { SpriteEnemyHurt } from "./components/Sprites/enemy/SpriteEnemyHurt";
import { SpriteEnemyDie } from "./components/Sprites/enemy/SpriteEnemyDie";
import { SpriteDie } from "./components/Sprites/player/SpriteDie";
import { PhaseBarConfig } from "./types";

export default function Home() {
  const [attackBar, setAttackBar] =
    useState<PhaseBarConfig>(DEFAULT_ATTACK_BAR);
  const [parryBar, setParryBar] = useState<PhaseBarConfig>(DEFAULT_PARRY_BAR);
  const [counterBar, setCounterBar] =
    useState<PhaseBarConfig>(DEFAULT_COUNTER_BAR);
  const [, startTransition] = useTransition();

  const {
    phase,

    transition,
    resolve,
    setParryResult,

    frozen,
  } = useCombatPhase();
  const anim = useCombatAnimations();

  const engine = useCombatEngine(
    transition,
    resolve,
    () => anim.triggerEnemyDie(),
    () => anim.triggerDie(),
    attackBar,
    parryBar,
    counterBar,
    CONFUSED_SKELETON,
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
    attackBar,
    parryBar,
    counterBar,

    onParryTimeout: (p) => {
      const { event, result } = engine.onParry(p);
      setParryResult(result);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") anim.triggerEnemyAttack("parry");
    },
  });

  useEffect(() => {
    startTransition(() => {
      setAttackBar(getAttackBar());
      setParryBar(getParryBar());
      setCounterBar(getCounterBar());
    });
  }, []);

  const resetUI = useCallback(() => setReleaseAt(null), [setReleaseAt]);
  useCombatController({ phase, start, stop, reset, resetUI });

  const barConfig =
    (phase === "enemy_attack"
      ? parryBar
      : phase === "counter"
        ? counterBar
        : attackBar) ?? getAttackBar();

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
      {/* {frozen && (
        <div className="absolute inset-0 bg-white/50 pointer-events-none animate-pulse z-40" />
      )} */}
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
      <div className="flex flex-col  max-w-105 w-full mx-auto">
        {" "}
        <h1 className="pt-2  font-girassol text-base text-[#FFEBDA] ">
          Perfect Parry
        </h1>
        <span className="font-extralight text-xs text-white/70">
          Precision beats power
        </span>
        <div className="flex flex-col w-full max-w-105 mt-10">
          <div className="flex justify-center pb-2  font-girassol text-5xl text-[#FFEBDA]">
            {phase === "player_attack" ? (
              <span>Attack</span>
            ) : phase === "enemy_attack" ? (
              <span>Defend</span>
            ) : phase === "counter" ? (
              <span>Counter attack</span>
            ) : (
              ""
            )}
          </div>

          <div className="relative w-full h-40 ">
            {lastCombatEvent?.playerLabel && (
              <span
                className="absolute z-50 flex flex-col items-center"
                style={{ bottom: "100px", left: "50px" }}
              >
                <p className="text-base font-bold ">
                  {lastCombatEvent.playerLabel}
                </p>
                {lastCombatEvent.playerDamage && (
                  <p className="text-3xl font-bold text-yellow-400">
                    -{lastCombatEvent.playerDamage}
                  </p>
                )}
                {lastCombatEvent.playerHeal && (
                  <p className="text-3xl font-bold text-green-400">
                    +{lastCombatEvent.playerHeal}
                  </p>
                )}
              </span>
            )}
            {lastCombatEvent?.enemyLabel && (
              <span
                className="absolute z-50 flex flex-col items-center"
                style={{ bottom: "100px", right: "80px" }}
              >
                <p className="text-3xl font-bold text-yellow-400">
                  {lastCombatEvent.enemyLabel}
                </p>
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
            config={barConfig}
            releaseAt={releaseAt}
            lastCombatEvent={engine.lastCombatEvent}
            frozen={frozen}
          />
        </div>
        <div className="flex-1 font-girassol flex flex-col items-end pb-[env(safe-area-inset-bottom)] m-2 mt-20">
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
                ? "Tap to defend"
                : phase === "counter"
                  ? "Tap to counter"
                  : "Get ready!"}
          </button>
        </div>
      </div>
    </main>
  );
}

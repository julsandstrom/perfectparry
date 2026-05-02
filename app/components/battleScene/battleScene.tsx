import { useCombatAnimations } from "@/app/hooks/useCombatAnimations";
import {
  CombatDisplayEvent,
  Phase,
  PlayerStatus,
  TransitionFn,
} from "@/app/types";
import { SpriteWalk } from "../Sprites/player/SpriteWalk";
import { SpriteAttack } from "../Sprites/player/SpriteAttack";
import { SpriteCounterAttack } from "../Sprites/player/SpriteCounterAttack";
import { SpriteHurt } from "../Sprites/player/SpriteHurt";
import { SpriteParry } from "../Sprites/player/SpriteParry";
import { SpriteDie } from "../Sprites/player/SpriteDie";
import { SpriteIdle } from "../Sprites/player/SpriteIdle";
import { SpriteEnemyWalk } from "../Sprites/enemy/SpriteEnemyWalk";
import { SpriteEnemyAttack } from "../Sprites/enemy/SpriteEnemyAttack";
import { SpriteEnemyHurt } from "../Sprites/enemy/SpriteEnemyHurt";
import { SpriteEnemyDie } from "../Sprites/enemy/SpriteEnemyDie";
import { SpriteEnemyIdle } from "../Sprites/enemy/SpriteEnemyIdle";

interface BattleSceneProps {
  anim: ReturnType<typeof useCombatAnimations>;
  lastCombatEvent: CombatDisplayEvent | null;
  onHitFrame: () => void;
  transition: TransitionFn;
  playerStatus: PlayerStatus;
  phase: Phase;
}

export function BattleScene({
  anim,
  lastCombatEvent,
  onHitFrame,
  transition,
  playerStatus,
  // phase,
}: BattleSceneProps) {
  const playerLeft =
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "left-[5%]"
      : "-left-[30%]";

  const enemyRight =
    (anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack") &&
    !anim.isMissRetaliation
      ? "right-[40%]"
      : "-right-[0%]";
  return (
    <>
      {" "}
      <div className="relative w-full h-32">
        <div className="absolute inset-0">
          {lastCombatEvent?.playerLabel && (
            <span className="absolute z-60 flex flex-col items-center bottom-[82%] left-8">
              <p className="text-xl font-bold text-white">
                {lastCombatEvent.playerLabel}
              </p>
            </span>
          )}{" "}
          {playerStatus === "low" && (
            <span className="absolute z-60 flex flex-col items-center bottom-[60%] left-10">
              <p className="text-base  text-[#cecece]">That hurts</p>
            </span>
          )}
          {playerStatus === "critical" && (
            <span className="absolute z-60 flex flex-col items-center bottom-[60%] left-10">
              <p className="text-base text-[#cecece] ">I need healing!</p>
            </span>
          )}
          {lastCombatEvent?.enemyLabel && (
            <span className="absolute z-60 flex flex-col items-center bottom-[70%] right-20">
              <p className="text-xl font-bold text-[#FF2020]">
                {lastCombatEvent.enemyLabel}
              </p>
            </span>
          )}{" "}
        </div>
      </div>
      <div
        className={`absolute -top-25 z-50 transition-left duration-600 ${playerLeft}`}
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
        className={`absolute top-0 z-50 transition-all duration-600 ${enemyRight}`}
      >
        {anim.enemyAnim === "walk_in" ? (
          <SpriteEnemyWalk
            trigger={anim.enemyWalkInTrigger}
            onComplete={() => anim.triggerEnemyAttackAnim()}
          />
        ) : anim.enemyAnim === "attack" ? (
          <SpriteEnemyAttack
            trigger={anim.enemyAttackTrigger}
            onComplete={() => {
              if (anim.isMissRetaliation) {
                anim.clearMissRetaliation();
                anim.resetEnemy();
              } else {
                anim.triggerEnemyWalkOut();
              }
            }}
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
    </>
  );
}

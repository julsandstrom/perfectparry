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
import { useResponsiveScale } from "@/app/hooks/useResponsiveSpriteScale";

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
}: BattleSceneProps) {
  const scale = useResponsiveScale({ sm: 4, md: 5, lg: 6 });
  const enemyScale = useResponsiveScale({ sm: 2, md: 3, lg: 4 });
  const playerLeft =
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "left-[5%] sm:left-[40%] lg:left-[40%] xl:left-[50%] 2xl:left-[55%]"
      : "-left-[30%] sm:-left-[5%] lg:-left-[10%] xl:left-[5%] 2xl:left-[10%] ";

  const enemyRight =
    (anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack") &&
    !anim.isMissRetaliation
      ? "right-[40%] sm:left-[16%] 2xl:left-[20%]"
      : "-right-[0%] sm:left-[65%] lg:sm:left-[60%] xl:sm:left-[65%]";
  return (
    <>
      {" "}
      <div className="relative w-full h-32">
        <div className="absolute inset-0">
          {lastCombatEvent?.playerLabel && (
            <span className="absolute z-60 flex flex-col items-center bottom-[52%] md:bottom-[42%] lg:bottom-[20%] left-10 sm:left-32 lg:left-24 xl:left-80">
              <p className="text-xl md:text-4xl font-bold text-white">
                {lastCombatEvent.playerLabel}
              </p>
              {(lastCombatEvent.playerHeal ?? 0) > 0 && (
                <p className="text-xl md:text-4xl font-bold text-[#7DC33A]">
                  +{lastCombatEvent.playerHeal}
                </p>
              )}
              {(lastCombatEvent.playerDamage ?? 0) > 0 && (
                <span className="text-xl md:text-4xl font-bold text-[#FF2020]">
                  -{lastCombatEvent.playerDamage}
                </span>
              )}
            </span>
          )}
          {playerStatus === "critical" && (
            <span className="absolute z-60 flex flex-col items-center -bottom-[20%] md:-bottom-[70%] lg:-bottom-[120%] left-10 sm:left-32 md:left-36 lg:left-36 xl:left-80 2xl:left-112">
              <p className="text-base xl:text-xl text-[#cecece] ">
                I need healing!
              </p>
            </span>
          )}
          {/* {playerStatus === "low" && (
            <span className="absolute z-60 flex flex-col items-center -bottom-[20%] left-10 sm:left-32">
              <p className="text-base text-[#cecece] ">I'm wounded</p>
            </span>
          )} */}
          {lastCombatEvent?.enemyLabel && (
            <span className="absolute z-60 flex flex-col items-center bottom-[70%] sm:bottom-[75%] xl:bottom-[65%] right-20 sm:right-28 md:right-36 lg:right-40 xl:right-60 2xl:right-96">
              <p className="text-xl md:text-4xl font-bold text-[#FF2020]">
                {lastCombatEvent.enemyLabel}
              </p>
            </span>
          )}{" "}
        </div>
      </div>
      <div
        className={`absolute -top-25 z-50 transition-left duration-800 ${playerLeft}`}
      >
        {anim.playerAnim === "walk_in" ? (
          <SpriteWalk
            trigger={anim.walkInTrigger}
            onComplete={() => anim.triggerAttack()}
            scale={scale}
          />
        ) : anim.playerAnim === "attack" ? (
          <SpriteAttack
            trigger={anim.attackTrigger}
            onHitFrame={onHitFrame}
            onComplete={() => anim.triggerWalkOut()}
            scale={scale}
          />
        ) : anim.playerAnim === "bow_attack" ? (
          <SpriteCounterAttack
            trigger={anim.bowAttackTrigger}
            onHitFrame={onHitFrame}
            onComplete={() => anim.resetPlayer()}
            scale={scale}
          />
        ) : anim.playerAnim === "walk_out" ? (
          <SpriteWalk
            trigger={anim.walkOutTrigger}
            flipped={true}
            onComplete={() => anim.resetPlayer()}
            scale={scale}
          />
        ) : anim.playerAnim === "hurt" ? (
          <SpriteHurt
            trigger={anim.hurtTrigger}
            onComplete={() => anim.resetPlayer()}
            scale={scale}
          />
        ) : anim.playerAnim === "parry" ? (
          <SpriteParry
            trigger={anim.parryTrigger}
            onComplete={() => anim.resetPlayer()}
            scale={scale}
          />
        ) : anim.playerAnim === "counter" ? (
          <SpriteCounterAttack
            trigger={anim.counterTrigger}
            onHitFrame={onHitFrame}
            onComplete={() => anim.resetPlayer()}
            scale={scale}
          />
        ) : anim.playerAnim === "die" ? (
          <SpriteDie
            trigger={anim.playerDieTrigger}
            onComplete={() => transition("defeat")}
            scale={scale}
          />
        ) : (
          <SpriteIdle scale={scale} />
        )}
      </div>
      <div
        className={`absolute top-0 z-50 transition-all duration-800 ${enemyRight}`}
      >
        {anim.enemyAnim === "walk_in" ? (
          <SpriteEnemyWalk
            trigger={anim.enemyWalkInTrigger}
            onComplete={() => anim.triggerEnemyAttackAnim()}
            scale={enemyScale}
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
            scale={enemyScale}
          />
        ) : anim.enemyAnim === "walk_out" ? (
          <SpriteEnemyWalk
            trigger={anim.enemyWalkOutTrigger}
            flipped={true}
            onComplete={() => {
              anim.resetEnemy();
            }}
            scale={enemyScale}
          />
        ) : anim.enemyAnim === "hurt" ? (
          <SpriteEnemyHurt
            trigger={anim.enemyHurtTrigger}
            onComplete={() => anim.resetEnemy()}
            scale={enemyScale}
          />
        ) : anim.enemyAnim === "die" ? (
          <SpriteEnemyDie
            trigger={anim.enemyDieTrigger}
            onComplete={() => transition("victory")}
            scale={enemyScale}
          />
        ) : (
          <SpriteEnemyIdle scale={enemyScale} />
        )}
      </div>
    </>
  );
}

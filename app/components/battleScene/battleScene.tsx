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
import HpBars from "../hpBars/HpBars";

interface BattleSceneProps {
  anim: ReturnType<typeof useCombatAnimations>;
  lastCombatEvent: CombatDisplayEvent | null;
  onHitFrame: () => void;
  transition: TransitionFn;
  playerStatus: PlayerStatus;
  phase: Phase;
  playerHp: number;
  enemyHp: number;
}

export function BattleScene({
  anim,
  lastCombatEvent,
  onHitFrame,
  transition,
  playerStatus,
  playerHp,
  enemyHp,
}: BattleSceneProps) {
  const scale = useResponsiveScale({ sm: 4, md: 5, lg: 6 });
  const enemyScale = useResponsiveScale({ sm: 2, md: 3, lg: 4 });
  const playerLeft =
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "left-[5%] sm:left-[40%] lg:left-[40%] xl:left-[45%] 2xl:left-[50%]"
      : "-left-[30%] sm:-left-[5%] lg:-left-[10%] xl:left-[5%] 2xl:left-[10%] ";

  const enemyRight =
    (anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack") &&
    !anim.isMissRetaliation
      ? "right-[40%] sm:left-[16%] xl:left-[23%] 2xl:left-[25%]"
      : "-right-[0%] sm:left-[65%] lg:sm:left-[60%] xl:sm:left-[60%]";
  return (
    <>
      <div className="relative w-full h-40">
        <div className="absolute inset-x-0 -top-10 sm:left-20 sm:right-20 sm:-top-20 md:right-30 md:left-30 md:-top-15 lg:right-40 lg:left-40 lg:-top-20 xl:right-60 xl:left-60 xl:-top-20">
          <HpBars playerHp={playerHp} enemyHp={enemyHp} />
        </div>
      </div>
      <div
        className={`absolute -top-25 z-50 transition-left duration-800 ${playerLeft}`}
      >
        {" "}
        {lastCombatEvent?.playerLabel && (
          <div className="absolute top-25 md:top-30 left-40 md:left-52 lg:top-40 lg:left-64 flex flex-col items-center whitespace-nowrap">
            <p className="text-xl  font-bold text-white">
              {lastCombatEvent.playerLabel}
            </p>
            {(lastCombatEvent.playerHeal ?? 0) > 0 && (
              <p className="text-xl font-bold text-[#7DC33A] md:text-3xl">
                +{lastCombatEvent.playerHeal}
              </p>
            )}
            {(lastCombatEvent.playerDamage ?? 0) > 0 && (
              <p className="text-xl font-bold text-[#FF2020] md:text-3xl">
                -{lastCombatEvent.playerDamage}
              </p>
            )}
          </div>
        )}
        {playerStatus === "critical" && (
          <div className="absolute top-60 left-40 md:top-80 md:left-50 lg:top-90 lg:left-60 whitespace-nowrap">
            <p className="text-base lg:text-xl text-[#cecece]">
              I need healing!
            </p>
          </div>
        )}
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
        {lastCombatEvent?.enemyLabel && (
          <div className="absolute top-0 left-20 md:left-32 lg:left-40 xl:top-5 whitespace-nowrap">
            <p className="text-xl md:text-4xl font-bold text-[#FF2020]">
              {lastCombatEvent.enemyLabel}
            </p>
          </div>
        )}
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

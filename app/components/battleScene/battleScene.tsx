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
  phase,
}: BattleSceneProps) {
  const playerLeft =
    anim.playerAnim === "walk_in" || anim.playerAnim === "attack"
      ? "left-0"
      : "-left-32";

  const enemyRight =
    anim.enemyAnim === "walk_in" || anim.enemyAnim === "attack"
      ? "right-32"
      : "-right-5";

  return (
    <>
      <div className="relative w-full h-32">
        {lastCombatEvent?.playerLabel && (
          <span
            className="absolute z-60 flex flex-col items-center"
            style={{ bottom: "105px", left: "35px" }}
          >
            <p className="text-xl font-bold text-white">
              {lastCombatEvent.playerLabel}
            </p>
            {lastCombatEvent.playerHeal != null &&
              lastCombatEvent.playerHeal > 0 && (
                <p className="text-xl font-bold text-[#32c732]">Healed!</p>
              )}
          </span>
        )}
        {playerStatus === "critical" && (
          <span
            className="absolute z-60 flex flex-col items-center"
            style={{ bottom: "80px", left: "30px" }}
          >
            <p className="text-base text-[#FF7373]">Critically wounded!</p>
          </span>
        )}
        {playerStatus === "low" && (
          <span
            className="absolute z-60 flex flex-col items-center"
            style={{ bottom: "70px", left: "50px" }}
          >
            <p className="text-base  text-[#FF7373]">need healing</p>
          </span>
        )}
        {lastCombatEvent?.enemyLabel && (
          <span
            className="absolute z-50 flex flex-col items-center"
            style={{ bottom: "90px", right: "80px" }}
          >
            <p className="text-xl font-bold text-[#fa7474]">
              {lastCombatEvent.enemyLabel}
            </p>
          </span>
        )}{" "}
      </div>
      <div
        className={`absolute bottom-0 z-50 transition-left duration-600 ${playerLeft}`}
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
    </>
  );
}

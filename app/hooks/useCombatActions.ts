import { useCallback, useEffect, useRef, useState } from "react";
import { useTimingBar } from "./useTimingBar";

import { CombatActionsOptions } from "../types";
import { evaluateZones } from "../lib/combatMath";
import { useSoundEnabled } from "../context/SoundContext";

export function useCombatActions({
  phase,
  engine,
  anim,
  onParryTimeout,
  attackBar,
  parryBar,
  counterBar,
  onMiss,
}: CombatActionsOptions) {
  const pendingAttack = useRef<number | null>(null);
  const pendingCounter = useRef<number | null>(null);
  const [releaseAt, setReleaseAt] = useState<number | null>(null);
  const { soundEnabled } = useSoundEnabled();

  const playSound = useCallback(
    (ref: React.RefObject<HTMLAudioElement | null>) => {
      if (!soundEnabled || !ref.current) return;
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    },
    [soundEnabled],
  );

  const strikeAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    strikeAudioRef.current = new Audio("/sfx/strike-skeleton.mp3");
    strikeAudioRef.current.volume = 0.6;
  }, []);

  const healAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    healAudioRef.current = new Audio("/sfx/heal.mp3");
    healAudioRef.current.volume = 0.6;
  }, []);

  const missAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    missAudioRef.current = new Audio("/sfx/miss.mp3");
    missAudioRef.current.volume = 0.6;
  }, []);

  const counterAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    counterAudioRef.current = new Audio("/sfx/counter.mp3");
    counterAudioRef.current.volume = 0.6;
  }, []);

  const playerHitAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    playerHitAudioRef.current = new Audio("/sfx/strike-player.mp3");
    playerHitAudioRef.current.volume = 0.6;
  }, []);
  const onEnemyHitFrame = useCallback(() => {
    playSound(playerHitAudioRef);
  }, [playSound]);

  const isParry = phase === "enemy_attack";
  const durationMs = isParry
    ? parryBar.durationMs
    : phase === "counter"
      ? counterBar.durationMs
      : attackBar.durationMs;

  const { progress, start, release, reset, stop } = useTimingBar({
    durationMs,
    onComplete: () => {
      if (phase === "player_attack") engine.onAttack(1.0);
      if (phase === "enemy_attack") onParryTimeout(1.0);
      if (phase === "counter") engine.onCounter(1.0);
    },
  });

  const onHitFrame = useCallback(() => {
    if (phase === "victory" || phase === "defeat") return;

    if (pendingAttack.current !== null) {
      const result = engine.onAttack(pendingAttack.current);
      pendingAttack.current = null;
      if (result === "miss") {
        if (missAudioRef.current) {
          missAudioRef.current.currentTime = 0;
          playSound(missAudioRef);
        }
        anim.triggerEnemyAttack("miss");
      } else {
        if (strikeAudioRef.current) {
          strikeAudioRef.current.currentTime = 0;
          playSound(strikeAudioRef);
        }
        anim.triggerEnemyHurt();
      }
    }

    if (pendingCounter.current !== null) {
      const result = engine.onCounter(pendingCounter.current);
      pendingCounter.current = null;
      if (strikeAudioRef.current) {
        strikeAudioRef.current.currentTime = 0;
        playSound(strikeAudioRef);
      }
      if (result !== "secondary") anim.triggerEnemyHurt();
    }
  }, [phase, engine, anim, playSound]);

  const handlePointerDown = useCallback(() => {
    if (phase === "player_attack") start();
  }, [phase, start]);

  const handlePointerUp = useCallback(() => {
    if (phase === "player_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { zone } = evaluateZones(snapshot, attackBar.zones);
      if (zone?.outcome === "arrow") {
        setTimeout(() => {
          pendingAttack.current = snapshot;
          anim.triggerBowAttack();
        }, 100);
      } else if (zone?.outcome === "heal") {
        if (healAudioRef.current) {
          healAudioRef.current.currentTime = 0;
          playSound(healAudioRef);
        }
        engine.onAttack(snapshot);
      } else {
        pendingAttack.current = snapshot;
        const isMiss = !zone || zone.outcome === "miss";
        if (isMiss) onMiss?.();
        anim.triggerWalkIn();
      }
    }
  }, [
    phase,
    release,
    anim,
    setReleaseAt,
    attackBar,
    engine,
    onMiss,
    playSound,
  ]);

  const handleTap = useCallback(() => {
    if (phase === "resolving") return;
    if (phase === "enemy_attack") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { event } = engine.onParry(snapshot);
      if (event.type === "HURT") anim.triggerEnemyAttack("hurt");
      else if (event.type === "PARRY") {
        if (counterAudioRef.current) {
          setTimeout(() => {
            if (counterAudioRef.current) {
              counterAudioRef.current.currentTime = 0;
              setTimeout(() => playSound(counterAudioRef), 0);
            }
          }, 800);
        }
        anim.triggerEnemyAttack("parry");
      } else if (event.type === "NONE") anim.triggerEnemyAttack("hurt");
    }
    if (phase === "counter") {
      const snapshot = release();
      setReleaseAt(snapshot);
      const { hitResult, zone } = evaluateZones(snapshot, counterBar.zones);
      if (hitResult === "secondary") {
        if (zone?.outcome === "heal") {
          if (healAudioRef.current) {
            healAudioRef.current.currentTime = 0;
            playSound(healAudioRef);
          }
        }
        engine.onCounter(snapshot);
      } else {
        pendingCounter.current = snapshot;

        anim.triggerCounter();
      }
    }
  }, [phase, release, engine, anim, counterBar, playSound]);

  return {
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
    onEnemyHitFrame,
  };
}

import { useEffect, useRef } from "react";

type Props = {
  children: string;
  holdMs?: number; // 3000
  rampSeconds?: number; // 10
  hissSrc?: string; // "/media/audio/hiss.mp3"
  bodyClass?: string; // "site-dimmed"
};

export function UnstableDimmingWord({
  children,
  holdMs = 3000,
  rampSeconds = 10,
  hissSrc = "/media/audio/hiss.mp3",
  bodyClass = "site-dimmed",
}: Props) {
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rampStartRef = useRef<number>(0);

  useEffect(() => {
    const a = new Audio(hissSrc);
    a.loop = true;
    a.preload = "auto";
    a.volume = 0;
    audioRef.current = a;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove(bodyClass);
      a.pause();
      a.src = "";
      audioRef.current = null;
    };
  }, [hissSrc, bodyClass]);

  const stopAll = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    document.body.classList.remove(bodyClass);

    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
      a.volume = 0;
    }
  };

  const startRamp = () => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = 0;

    // hover = user gesture → обычно play разрешён
    a.play().catch(() => {
      // если браузер заблокировал (редко) — будет эффект без звука
    });

    rampStartRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const t = Math.max(
        0,
        Math.min(1, (now - rampStartRef.current) / (rampSeconds * 1000)),
      );

      // smoothstep
      const eased = t * t * (3 - 2 * t);

      if (audioRef.current) audioRef.current.volume = eased;

      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const onEnter = () => {
    stopAll();

    timerRef.current = window.setTimeout(() => {
      document.body.classList.add(bodyClass);
      startRamp();
    }, holdMs);
  };

  const onLeave = () => stopAll();

  return (
    <span
      className="unstable-word"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
    >
      {children}
    </span>
  );
}

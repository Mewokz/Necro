import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  radiusPx?: number;
  hissSrc?: string;
  enabled?: boolean;

  /**
   * Real amplification with WebAudio.
   * 1.0 = normal, 2.0 = loud, 4.0 = very loud, 6.0+ = brutal (may distort).
   */
  gainBoost?: number; // default 4.0

  /** additional volume curve (0..1) -> applied before gainBoost */
  maxVolume?: number; // default 1.0
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function ProximityDimHiss({
  children,
  radiusPx = 280,
  hissSrc = "/media/audio/hiss.mp3",
  enabled = true,
  gainBoost = 4.0,
  maxVolume = 1.0,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);

  const raf = useRef<number | null>(null);
  const current = useRef(0);

  // WebAudio nodes
  const ctxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const srcNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const compRef = useRef<DynamicsCompressorNode | null>(null);

  const armedRef = useRef(false);
  const playingRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      document.body.style.setProperty("--prox", "0");
      stopAll();
      return;
    }

    const onMove = (e: PointerEvent) => {
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    // We must unlock AudioContext on a user gesture
    const onArm = () => {
      armAudio().catch(() => {
        // ignore; some browsers may still block until a different gesture
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onArm, { passive: true });
    window.addEventListener("keydown", onArm);

    const tick = () => {
      raf.current = requestAnimationFrame(tick);

      // if unstable global dim active — do not fight it
      if (document.body.classList.contains("site-dimmed")) {
        document.body.style.setProperty("--prox", "1");
        setGain(0); // keep hiss off during unstable mode unless you want both
        return;
      }

      const el = wrapRef.current;
      const x = lastX.current;
      const y = lastY.current;

      if (!el || x == null || y == null) {
        setStrength(0);
        setGain(0);
        return;
      }

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);

      // 0..1 (1 = near center)
      let strength = clamp01(1 - d / radiusPx);

      // Make it aggressive near center
      strength = Math.pow(strength, 0.35);

      // Smooth to avoid jitter
      const smooth = 0.12;
      current.current = current.current + (strength - current.current) * smooth;

      setStrength(current.current);

      // Loudness “heartbeat jitter”
      const pulse = 0.82 + 0.18 * Math.abs(Math.sin(performance.now() / 105));

      const loud = clamp01(current.current * maxVolume) * pulse;

      if (loud > 0.01) {
        // auto-arm if user already interacted
        if (armedRef.current) startIfNeeded();
        setGain(loud);
      } else {
        setGain(0);
      }
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onArm);
      window.removeEventListener("keydown", onArm);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;

      setStrength(0);
      stopAll();
    };

    function setStrength(v: number) {
      document.body.style.setProperty("--prox", String(clamp01(v)));
    }

    async function armAudio() {
      if (armedRef.current) return;
      armedRef.current = true;

      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      ctxRef.current = ctx;

      const audioEl = new Audio(hissSrc);
      audioEl.loop = true;
      audioEl.preload = "auto";
      audioEl.crossOrigin = "anonymous";
      audioElRef.current = audioEl;

      const srcNode = ctx.createMediaElementSource(audioEl);
      srcNodeRef.current = srcNode;

      // Compressor to prevent harsh clipping
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -20;
      comp.knee.value = 18;
      comp.ratio.value = 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.18;
      compRef.current = comp;

      const gain = ctx.createGain();
      gain.gain.value = 0;
      gainRef.current = gain;

      // graph: source -> gain -> compressor -> destination
      srcNode.connect(gain);
      gain.connect(comp);
      comp.connect(ctx.destination);

      // Ensure resumed
      if (ctx.state === "suspended") await ctx.resume();
    }

    function startIfNeeded() {
      const ctx = ctxRef.current;
      const audioEl = audioElRef.current;
      if (!ctx || !audioEl) return;

      if (!playingRef.current) {
        playingRef.current = true;
        // start play; if blocked, we’ll silently fail
        audioEl.play().catch(() => {
          playingRef.current = false;
        });
      }
    }

    function setGain(level01: number) {
      const gain = gainRef.current;
      const ctx = ctxRef.current;

      if (!gain || !ctx) return;

      // REAL amplification: level * gainBoost
      const target = clamp01(level01) * gainBoost;

      // Fast, click-free smoothing
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(target, t, 0.03);
    }

    function stopAll() {
      // mute gain fast
      const gain = gainRef.current;
      const ctx = ctxRef.current;
      if (gain && ctx) {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.setTargetAtTime(0, t, 0.02);
      }

      // stop element
      const audioEl = audioElRef.current;
      if (audioEl) {
        audioEl.pause();
        playingRef.current = false;
      }

      // close context
      const ctx2 = ctxRef.current;
      if (ctx2) {
        ctx2.close().catch(() => {});
      }

      ctxRef.current = null;
      audioElRef.current = null;
      srcNodeRef.current = null;
      gainRef.current = null;
      compRef.current = null;
      armedRef.current = false;
      playingRef.current = false;
    }
  }, [enabled, hissSrc, radiusPx, gainBoost, maxVolume]);

  return (
    <div ref={wrapRef} className="inline-flex">
      {children}
    </div>
  );
}

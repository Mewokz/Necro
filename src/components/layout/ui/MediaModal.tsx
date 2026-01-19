import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaItem } from "./types";

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function AudioModule({
  src,
  title,
  subtitle,
}: {
  src: string;
  title?: string;
  subtitle?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [t, setT] = useState(0);
  const [vol, setVol] = useState(0.75);

  const pct = useMemo(() => (dur > 0 ? clamp01(t / dur) : 0), [t, dur]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = vol;

    const onLoaded = () => {
      setDur(a.duration || 0);
      setReady(true);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, [vol]);

  // smooth time updates (feels premium)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const tick = () => {
      setT(a.currentTime || 0);
      if (!a.paused) rafRef.current = requestAnimationFrame(tick);
    };

    if (playing) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || dur <= 0) return;
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = clamp01((e.clientX - r.left) / r.width);
    a.currentTime = x * dur;
    setT(a.currentTime);
  };

  const setVolume = (v: number) => {
    const a = audioRef.current;
    const nv = clamp01(v);
    setVol(nv);
    if (a) a.volume = nv;
  };

  const stop = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setT(0);
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-[11px] tracking-[0.22em] uppercase"
          style={{ color: "rgb(var(--ui-muted-2))" }}
        >
          AUDIO MODULE
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
            style={{
              borderColor: "rgb(var(--ui-border-2))",
              backgroundColor: "rgba(7,10,8,0.55)",
              color: "rgb(var(--ui-text))",
            }}
          >
            {playing ? "PAUSE" : ready ? "PLAY" : "LOAD"}
          </button>

          <button
            type="button"
            onClick={stop}
            className="rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
            style={{
              borderColor: "rgb(var(--ui-border-2))",
              backgroundColor: "rgba(7,10,8,0.35)",
              color: "rgb(var(--ui-text))",
            }}
          >
            STOP
          </button>
        </div>
      </div>

      <div
        className="mt-3 rounded-xl border p-3"
        style={{
          borderColor: "rgb(var(--ui-border-2))",
          backgroundColor: "rgba(7,10,8,0.35)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="text-sm font-medium"
              style={{ color: "rgb(var(--ui-text))" }}
            >
              {title ?? "Track"}
            </p>
            {subtitle ? (
              <p
                className="mt-1 text-xs"
                style={{ color: "rgb(var(--ui-muted))" }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>

          <div
            className="text-[11px] tabular-nums"
            style={{ color: "rgb(var(--ui-muted-2))" }}
          >
            {fmt(t)} / {fmt(dur)}
          </div>
        </div>

        {/* progress bar */}
        <div className="mt-3">
          <div
            className="h-2 w-full cursor-pointer overflow-hidden rounded-full border"
            style={{
              borderColor: "rgb(var(--ui-border-2))",
              backgroundColor: "rgba(9,14,11,0.55)",
            }}
            onClick={seek}
            role="slider"
            aria-label="Seek"
          >
            <div
              className="h-full"
              style={{
                width: `${pct * 100}%`,
                backgroundColor: "rgb(var(--ui-warn))",
                opacity: 0.8,
              }}
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span
              className="text-[11px] tracking-[0.22em] uppercase"
              style={{ color: "rgb(var(--ui-muted-2))" }}
            >
              VOL
            </span>

            <input
              className="w-full accent-[rgb(var(--ui-warn))]"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vol}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
            />

            <span
              className="w-10 text-right text-[11px] tabular-nums"
              style={{ color: "rgb(var(--ui-muted-2))" }}
            >
              {Math.round(vol * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* hidden native element */}
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export function MediaModal({
  openItem,
  onClose,
}: {
  openItem: MediaItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (openItem) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openItem, onClose]);

  if (!openItem) return null;

  const isTrack = openItem.kind === "track";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      />

      <div
        className="relative w-full max-w-2xl rounded-2xl border p-5"
        style={{
          borderColor: "rgb(var(--ui-border))",
          backgroundColor: "rgba(11,18,14,0.80)",
          color: "rgb(var(--ui-text))",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.28em] uppercase text-[rgb(var(--ui-muted-2))]">
              {openItem.kind.toUpperCase()}
              {openItem.status === "pinned" ? " • PINNED" : ""}
            </p>

            <h2 className="mt-2 text-lg font-medium">{openItem.title}</h2>

            {openItem.subtitle ? (
              <p className="mt-1 text-sm text-[rgb(var(--ui-muted))]">
                {openItem.subtitle}
              </p>
            ) : null}
          </div>

          <button
            className="rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
            style={{
              borderColor: "rgb(var(--ui-border-2))",
              backgroundColor: "rgba(9,14,11,0.55)",
              color: "rgb(var(--ui-text))",
            }}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div
          className="mt-4 rounded-xl border p-4"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(9,14,11,0.55)",
          }}
        >
          <div className="flex items-start gap-4">
            {/* cover */}
            <div
              className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border"
              style={{
                borderColor: "rgb(var(--ui-border-2))",
                backgroundColor: "rgba(7,10,8,0.55)",
              }}
            >
              {openItem.coverSrc ? (
                <img
                  src={openItem.coverSrc}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm leading-relaxed text-[rgb(var(--ui-muted))]">
                {openItem.description
                  ? openItem.description
                  : "No description yet. Add `description` to this item."}
              </p>

              {/* ✅ Custom Track player */}
              {isTrack && openItem.audioSrc ? (
                <AudioModule
                  src={openItem.audioSrc}
                  title={openItem.title}
                  subtitle={openItem.subtitle}
                />
              ) : null}

              {/* link */}
              {openItem.href ? (
                <div className="mt-4">
                  <a
                    href={openItem.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
                    style={{
                      borderColor: "rgba(199,168,91,0.45)",
                      backgroundColor: "rgba(199,168,91,0.10)",
                      color: "rgb(var(--ui-warn))",
                    }}
                  >
                    Open link ▸
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <p
          className="mt-3 text-[11px]"
          style={{ color: "rgb(var(--ui-muted))" }}
        >
          Tip: press <span style={{ color: "rgb(var(--ui-text))" }}>Esc</span>{" "}
          to close.
        </p>
      </div>
    </div>
  );
}

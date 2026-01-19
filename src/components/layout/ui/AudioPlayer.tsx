import { useEffect, useMemo, useRef, useState } from "react";

function fmt(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  title,
  subtitle,
}: {
  src: string;
  title?: string;
  subtitle?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [t, setT] = useState(0);
  const [vol, setVol] = useState(0.75);

  const pct = useMemo(() => (dur > 0 ? Math.min(1, t / dur) : 0), [t, dur]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => {
      setDur(a.duration || 0);
      setReady(true);
    };
    const onTime = () => setT(a.currentTime || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);

    a.volume = vol;

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
  }, [vol]);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || dur <= 0) return;
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    a.currentTime = Math.max(0, Math.min(dur, x * dur));
  }

  function setVolume(v: number) {
    const a = audioRef.current;
    setVol(v);
    if (a) a.volume = v;
  }

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: "rgb(var(--ui-border-2))",
        backgroundColor: "rgba(9,14,11,0.55)",
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[rgb(var(--ui-muted-2))]">
            AUDIO MODULE
          </p>
          <p className="mt-1 text-sm font-medium text-[rgb(var(--ui-text))] truncate">
            {title ?? "Track"}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-[rgb(var(--ui-muted))] truncate">
              {subtitle}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggle}
          className="shrink-0 rounded-xl border px-3 py-2 text-xs transition hover:opacity-90"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(7,10,8,0.55)",
            color: "rgb(var(--ui-text))",
          }}
        >
          {playing ? "PAUSE" : ready ? "PLAY" : "LOAD"}
        </button>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-[rgb(var(--ui-muted-2))]">
          <span className="tabular-nums">{fmt(t)}</span>
          <span className="tabular-nums">{fmt(dur)}</span>
        </div>

        <div
          className="mt-2 h-2 w-full cursor-pointer overflow-hidden rounded-full border"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(7,10,8,0.55)",
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
              opacity: 0.75,
            }}
          />
        </div>
      </div>

      {/* volume */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[11px] tracking-[0.22em] uppercase text-[rgb(var(--ui-muted-2))]">
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
        <span className="w-10 text-right text-[11px] tabular-nums text-[rgb(var(--ui-muted-2))]">
          {Math.round(vol * 100)}%
        </span>
      </div>

      <p className="mt-3 text-[11px] text-[rgb(var(--ui-muted-2))]">
        Hint: click the bar to seek.
      </p>
    </div>
  );
}

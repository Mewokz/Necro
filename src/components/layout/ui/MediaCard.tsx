import { useRef } from "react";
import type { MediaItem } from "./types";

function badgeForKind(kind: MediaItem["kind"]) {
  if (kind === "game") return "GAME";
  if (kind === "track") return "TRACK";
  return "MODULE";
}

export function MediaCard({
  item,
  onOpen,
}: {
  item: MediaItem;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    const rotY = (px - 0.5) * 10;
    const rotX = (0.5 - py) * 10;

    el.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
    el.style.setProperty("--tz", `10px`);
    el.style.setProperty("--hx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--hy", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--h", `1`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tz", `0px`);
    el.style.setProperty("--h", `0`);
  }

  const isPinned = item.status === "pinned";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--lift", `-2px`);
      }}
      className="group relative rounded-2xl border p-4 text-left transition will-change-transform"
      style={{
        borderColor: isPinned
          ? "rgba(199,168,91,0.45)"
          : "rgb(var(--ui-border-2))",
        backgroundColor: "rgba(9,14,11,0.55)",
        transform:
          "translateZ(0) translateY(var(--lift,0px)) perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(var(--tz,0px))",
      }}
    >
      {/* hover highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition"
        style={{
          background:
            "radial-gradient(240px circle at var(--hx,50%) var(--hy,50%), rgba(215,220,207,0.08), transparent 60%)",
          opacity: "var(--h,0)",
        }}
      />

      <div className="flex items-start gap-3">
        {/* cover */}
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(7,10,8,0.55)",
          }}
        >
          {item.coverSrc ? (
            <img
              src={item.coverSrc}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            // ✅ fallback ТОЛЬКО если НЕТ картинки
            <div
              className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.22em]"
              style={{ color: "rgb(var(--ui-muted-2))" }}
            >
              {badgeForKind(item.kind)}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[rgb(var(--ui-muted-2))]">
            {badgeForKind(item.kind)}
            {isPinned ? " • PINNED" : ""}
          </p>

          <p className="mt-1 text-sm font-medium text-[rgb(var(--ui-text))] truncate">
            {item.title}
          </p>

          {item.subtitle ? (
            <p className="mt-1 text-xs text-[rgb(var(--ui-muted))] truncate">
              {item.subtitle}
            </p>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2 py-[2px] text-[10px] tracking-[0.18em] uppercase"
                  style={{
                    borderColor: "rgb(var(--ui-border-2))",
                    color: "rgb(var(--ui-muted))",
                    backgroundColor: "rgba(7,10,8,0.35)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className="mt-1 h-2 w-2 rounded-sm"
          style={{
            backgroundColor: isPinned
              ? "rgb(var(--ui-warn))"
              : "rgb(var(--ui-border))",
          }}
        />
      </div>

      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full border"
        style={{
          borderColor: "rgb(var(--ui-border-2))",
          backgroundColor: "rgba(7,10,8,0.55)",
        }}
      >
        <div
          className="h-full transition"
          style={{
            width: isPinned ? "78%" : "60%",
            backgroundColor: isPinned
              ? "rgb(var(--ui-warn))"
              : "rgb(var(--ui-ok))",
            opacity: 0.7,
          }}
        />
      </div>

      <p className="mt-3 text-[11px] text-[rgb(var(--ui-muted-2))]">Open ▸</p>
    </button>
  );
}

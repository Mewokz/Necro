import { useEffect } from "react";
import type { MediaItem } from "./types";

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

              {/* Track player */}
              {isTrack && openItem.audioSrc ? (
                <div className="mt-4">
                  <p
                    className="text-[11px] tracking-[0.22em] uppercase"
                    style={{ color: "rgb(var(--ui-muted-2))" }}
                  >
                    Playback
                  </p>
                  <audio
                    className="mt-2 w-full"
                    controls
                    preload="none"
                    src={openItem.audioSrc}
                  />
                </div>
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

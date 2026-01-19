import { useEffect, useMemo, useState } from "react";
import type { MediaItem } from "./types";
import { MediaCard } from "./MediaCard";

export function LibraryModal({
  open,
  title,
  items,
  onClose,
  onOpenItem,
}: {
  open: boolean;
  title: string;
  items: MediaItem[];
  onClose: () => void;
  onOpenItem: (item: MediaItem) => void;
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((it) => {
      const hay = [
        it.title,
        it.subtitle ?? "",
        it.description ?? "",
        (it.tags ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [items, q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-6 py-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      />

      <div
        className="relative w-full max-w-6xl rounded-2xl border p-5"
        style={{
          borderColor: "rgb(var(--ui-border))",
          backgroundColor: "rgba(11,18,14,0.80)",
          color: "rgb(var(--ui-text))",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "rgb(var(--ui-muted-2))" }}
            >
              LIBRARY
            </p>
            <h2 className="mt-1 text-lg font-medium">{title}</h2>
            <p
              className="mt-1 text-xs"
              style={{ color: "rgb(var(--ui-muted))" }}
            >
              Total: {items.length} • Showing: {filtered.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-64 max-w-full rounded-lg border px-3 py-2 text-xs outline-none"
              style={{
                borderColor: "rgb(var(--ui-border-2))",
                backgroundColor: "rgba(9,14,11,0.55)",
                color: "rgb(var(--ui-text))",
              }}
            />
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
              style={{
                borderColor: "rgb(var(--ui-border-2))",
                backgroundColor: "rgba(9,14,11,0.55)",
                color: "rgb(var(--ui-text))",
              }}
            >
              Close
            </button>
          </div>
        </div>

        <div
          className="mt-4 h-px"
          style={{ backgroundColor: "rgb(var(--ui-border-2))" }}
        />

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <MediaCard key={it.id} item={it} onOpen={() => onOpenItem(it)} />
          ))}
        </div>

        <p
          className="mt-4 text-[11px]"
          style={{ color: "rgb(var(--ui-muted))" }}
        >
          Tip: press <span style={{ color: "rgb(var(--ui-text))" }}>Esc</span>{" "}
          to close.
        </p>
      </div>
    </div>
  );
}

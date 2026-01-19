import { useMemo, useState } from "react";
import type { MediaItem } from "./types";
import { MediaCard } from "./MediaCard";
import { MediaModal } from "./MediaModal";
import { LibraryModal } from "./LibraryModal";

export function MediaGrid({
  title,
  items,
  previewCount = 4,
  libraryLabel,
}: {
  title: string;
  items: MediaItem[];
  previewCount?: number;
  libraryLabel?: string; // например "OPEN GAMES"
}) {
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);
  const [openLibrary, setOpenLibrary] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const ap = a.status === "pinned" ? 1 : 0;
      const bp = b.status === "pinned" ? 1 : 0;
      return bp - ap;
    });
    return copy;
  }, [items]);

  const preview = useMemo(
    () => sorted.slice(0, previewCount),
    [sorted, previewCount],
  );

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {preview.map((it) => (
          <MediaCard key={it.id} item={it} onOpen={() => setOpenItem(it)} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[rgb(var(--ui-muted-2))]">
          Showing {Math.min(previewCount, items.length)} / {items.length}
        </p>

        <button
          type="button"
          onClick={() => setOpenLibrary(true)}
          className="rounded-lg border px-3 py-2 text-xs transition hover:opacity-90"
          style={{
            borderColor: "rgba(199,168,91,0.45)",
            backgroundColor: "rgba(199,168,91,0.10)",
            color: "rgb(var(--ui-warn))",
          }}
        >
          {libraryLabel ?? "OPEN LIBRARY"} ▸
        </button>
      </div>

      <MediaModal openItem={openItem} onClose={() => setOpenItem(null)} />

      <LibraryModal
        open={openLibrary}
        title={title}
        items={sorted}
        onClose={() => setOpenLibrary(false)}
        onOpenItem={(it) => setOpenItem(it)}
      />
    </>
  );
}

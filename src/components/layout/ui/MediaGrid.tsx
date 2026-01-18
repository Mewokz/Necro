import { useMemo, useState } from "react";
import type { MediaItem } from "./types";
import { MediaCard } from "./MediaCard";
import { MediaModal } from "./MediaModal";

export function MediaGrid({
  title,
  items,
}: {
  title: string;
  items: MediaItem[];
}) {
  const [open, setOpen] = useState<MediaItem | null>(null);

  const sorted = useMemo(() => {
    // pinned всегда сверху
    const copy = [...items];
    copy.sort((a, b) => {
      const ap = a.status === "pinned" ? 1 : 0;
      const bp = b.status === "pinned" ? 1 : 0;
      return bp - ap;
    });
    return copy;
  }, [items]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((it) => (
          <MediaCard key={it.id} item={it} onOpen={() => setOpen(it)} />
        ))}
      </div>

      <MediaModal openItem={open} onClose={() => setOpen(null)} />
    </>
  );
}

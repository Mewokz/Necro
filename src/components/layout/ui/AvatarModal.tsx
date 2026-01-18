import { useEffect } from "react";

export function AvatarModal({
  open,
  onClose,
  src,
}: {
  open: boolean;
  onClose: () => void;
  src: string;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-400">
            OPERATOR IMAGE
          </p>
          <button
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-900 transition"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30">
          <img
            src={src}
            alt="Avatar"
            className="w-full h-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).alt =
                "Avatar not found. Put it in /public/assets/avatar.png";
            }}
          />
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          Tip: press <span className="text-zinc-300">Esc</span> to close.
        </p>
      </div>
    </div>
  );
}

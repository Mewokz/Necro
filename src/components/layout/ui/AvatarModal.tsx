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
      {/* backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      />

      {/* modal */}
      <div
        className="relative w-full max-w-xl rounded-2xl border p-4"
        style={{
          borderColor: "rgb(var(--ui-border))",
          backgroundColor: "rgba(11,18,14,0.75)",
          color: "rgb(var(--ui-text))",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "rgb(var(--ui-muted-2))" }}
          >
            OPERATOR IMAGE
          </p>
          <button
            className="rounded-lg border px-3 py-1 text-xs transition hover:opacity-90"
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

        {/* image */}
        <div
          className="mt-4 overflow-hidden rounded-xl border"
          style={{
            borderColor: "rgb(var(--ui-border-2))",
            backgroundColor: "rgba(9,14,11,0.55)",
          }}
        >
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

        {/* footer hint */}
        <p className="mt-3 text-xs" style={{ color: "rgb(var(--ui-muted))" }}>
          Tip: press <span style={{ color: "rgb(var(--ui-text))" }}>Esc</span>{" "}
          to close.
        </p>
      </div>
    </div>
  );
}

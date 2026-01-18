import { useRef } from "react";

export function TiltCard({ title, meta }: { title: string; meta: string }) {
  const ref = useRef<HTMLButtonElement | null>(null);

  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1

    // rotate range (subtle)
    const rotY = (px - 0.5) * 10; // -5..+5 deg
    const rotX = (0.5 - py) * 10; // -5..+5 deg

    el.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
    el.style.setProperty("--tz", `8px`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--tz", `0px`);
  }

  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={[
        "group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 text-left",
        "transition will-change-transform",
        "hover:bg-zinc-900/40",
      ].join(" ")}
      style={{
        transform:
          "translateZ(0) translateY(var(--lift,0px)) perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(var(--tz,0px))",
      }}
      onPointerEnter={() => {
        const el = ref.current;
        if (!el) return;
        el.style.setProperty("--lift", `-2px`);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100">{title}</p>
          <p className="mt-1 text-xs text-zinc-400">{meta}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-zinc-700 group-hover:bg-zinc-200 transition" />
      </div>

      <div className="mt-4 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div className="h-full w-2/3 bg-zinc-700 group-hover:bg-zinc-200 transition" />
      </div>
    </button>
  );
}

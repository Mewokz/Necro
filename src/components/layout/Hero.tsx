export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] text-zinc-400 uppercase">
            Necrosys Interface
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight">
            Controlled. Silent. Absolute.
          </h1>

          <p className="mt-6 text-zinc-300 leading-relaxed max-w-xl">
            A static system interface designed for dominance, restraint, and
            clarity. No noise. No chaos. Only structure.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="rounded-xl bg-zinc-100 px-6 py-3 text-zinc-950 font-medium hover:opacity-90 transition">
              Initialize
            </button>

            <button className="rounded-xl border border-zinc-700 px-6 py-3 text-zinc-100 hover:bg-zinc-900 transition">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

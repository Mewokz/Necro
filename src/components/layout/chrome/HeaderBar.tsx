import { useEffect, useState } from "react";
import { StatPill } from "../ui/StatPill";
import { AvatarModal } from "../ui/AvatarModal";

function formatTime(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function HeaderBar() {
  const [now, setNow] = useState(() => new Date());
  const [openAvatar, setOpenAvatar] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <header
        className="rounded-2xl border"
        style={{
          borderColor: "rgb(var(--ui-border))",
          backgroundColor: "rgba(11,18,14,0.55)",
        }}
      >
        {/* top row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            {/* dead military status dot */}
            <div
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: "rgb(var(--ui-ok))" }}
            />
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "rgb(var(--ui-text))" }}
            >
              COMMAND INTERFACE
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatPill tone="neutral">TZ: LOCAL</StatPill>
            <StatPill tone="neutral">TIME: {formatTime(now)}</StatPill>
            <StatPill tone="ok">LINK: STABLE</StatPill>
          </div>
        </div>

        <div
          className="h-px"
          style={{ backgroundColor: "rgb(var(--ui-border-2))" }}
        />

        {/* operator row */}
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenAvatar(true)}
              className="group relative h-10 w-10 overflow-hidden rounded-xl border"
              style={{
                borderColor: "rgb(var(--ui-border-2))",
                backgroundColor: "rgba(9,14,11,0.55)",
              }}
              aria-label="Open avatar"
            >
              <img
                src="/assets/avatar.png"
                alt="Avatar"
                className="h-full w-full object-cover scale-[1.02] group-hover:scale-[1.07] transition duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition"
                style={{
                  background:
                    "radial-gradient(70px circle at 30% 20%, rgba(215,220,207,0.12), transparent 60%)",
                }}
              />
            </button>

            <div>
              <p
                className="text-[11px] tracking-[0.3em] uppercase"
                style={{ color: "rgb(var(--ui-muted-2))" }}
              >
                OPERATOR
              </p>
              <h1
                className="text-lg font-medium tracking-tight"
                style={{ color: "rgb(var(--ui-text))" }}
              >
                Mewokz
              </h1>
            </div>
          </div>

          <p className="text-xs" style={{ color: "rgb(var(--ui-muted))" }}>
            SYS: profile loaded • modules online • awaiting tasks
          </p>
        </div>
      </header>

      <AvatarModal
        open={openAvatar}
        onClose={() => setOpenAvatar(false)}
        src="/assets/avatar.png"
      />
    </>
  );
}

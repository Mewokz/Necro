const tones = {
  ok: {
    border: "rgba(124,196,160,0.35)",
    bg: "rgba(124,196,160,0.10)",
    text: "rgb(var(--ui-ok))",
  },
  warn: {
    border: "rgba(199,168,91,0.35)",
    bg: "rgba(199,168,91,0.10)",
    text: "rgb(var(--ui-warn))",
  },
  danger: {
    border: "rgba(196,106,90,0.35)",
    bg: "rgba(196,106,90,0.10)",
    text: "rgb(var(--ui-danger))",
  },
  neutral: {
    border: "rgb(var(--ui-border))",
    bg: "rgba(9,14,11,0.45)",
    text: "rgb(var(--ui-text))",
  },
} as const;

export function StatPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] tracking-[0.18em] uppercase"
      style={{
        borderColor: t.border,
        backgroundColor: t.bg,
        color: t.text,
      }}
    >
      {children}
    </span>
  );
}

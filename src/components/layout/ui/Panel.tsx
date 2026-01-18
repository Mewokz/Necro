export function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-2xl border"
      style={{
        borderColor: "rgb(var(--ui-border))",
        backgroundColor: "rgba(11,18,14,0.55)",
      }}
    >
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs tracking-[0.3em] uppercase text-[rgb(var(--ui-text))]">
            {title}
          </p>
          {subtitle ? (
            <p className="text-xs text-[rgb(var(--ui-muted-2))]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div
        className="h-px"
        style={{ backgroundColor: "rgb(var(--ui-border-2))" }}
      />

      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

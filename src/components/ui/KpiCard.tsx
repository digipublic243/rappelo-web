interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[var(--outline-soft)]">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-[var(--primary-soft)] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
          KPI
        </div>
        <span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--muted-foreground)]">Live</span>
      </div>
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[var(--muted-foreground)]">{hint}</p> : null}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--secondary)]">
        <div className="h-full w-3/4 bg-[var(--primary)]" />
      </div>
    </article>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[var(--secondary-1)]">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-[var(--primary-3)] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">
          KPI
        </div>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-secondary-2">Live</span>
      </div>
      <p className="text-sm font-medium text-secondary-2">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-2 text-xs text-secondary-2">{hint}</p> : null}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-3/4 bg-[var(--primary)]" />
      </div>
    </article>
  );
}

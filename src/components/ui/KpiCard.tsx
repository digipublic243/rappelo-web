interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function KpiCard({ label, value, hint }: KpiCardProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#d9e4ea]">
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-[#d8e3fb] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#545f73]">
          KPI
        </div>
        <span className="rounded-full bg-[#e8eff3] px-2 py-0.5 text-[10px] font-bold uppercase text-[#566166]">Live</span>
      </div>
      <p className="text-sm font-medium text-[#566166]">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#2a3439]">{value}</p>
      {hint ? <p className="mt-2 text-xs text-[#566166]">{hint}</p> : null}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#e8eff3]">
        <div className="h-full w-3/4 bg-[#545f73]" />
      </div>
    </article>
  );
}

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import type { Unit } from "@/types/domain";

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[var(--outline-soft)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-[var(--foreground)]">{unit.label}</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{unit.type}</p>
        </div>
        <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--primary)]">{formatMoney(unit.price)}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--subtle-foreground)]">{formatCadence(unit.pricingCadence)}</p>
      <div className="mt-3 rounded-lg bg-[var(--surface-low)] px-3 py-2 text-xs text-[var(--muted-foreground)]">
        Deposit {unit.depositEnabled ? "enabled" : "disabled"}
      </div>
    </article>
  );
}

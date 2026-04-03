import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import type { Unit } from "@/types/domain";

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <article className="rounded-xl bg-background p-4 shadow-sm ring-1 ring-secondary-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">{unit.label}</h3>
          <p className="text-sm text-secondary-2">{unit.type}</p>
        </div>
        <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-primary">{formatMoney(unit.price)}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary-3)]">{formatCadence(unit.pricingCadence)}</p>
      <div className="mt-3 rounded-lg bg-[var(--secondary-4)] px-3 py-2 text-xs text-secondary-2">
        Deposit {unit.depositEnabled ? "enabled" : "disabled"}
      </div>
    </article>
  );
}

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import type { Unit } from "@/types/domain";

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[#d9e4ea]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-[#2a3439]">{unit.label}</h3>
          <p className="text-sm text-[#566166]">{unit.type}</p>
        </div>
        <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
      </div>
      <p className="mt-4 text-2xl font-extrabold tracking-tight text-[#545f73]">{formatMoney(unit.price)}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#717c82]">{formatCadence(unit.pricingCadence)}</p>
      <div className="mt-3 rounded-lg bg-[#f0f4f7] px-3 py-2 text-xs text-[#566166]">
        Deposit {unit.depositEnabled ? "enabled" : "disabled"}
      </div>
    </article>
  );
}

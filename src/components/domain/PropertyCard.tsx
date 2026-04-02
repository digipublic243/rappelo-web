import type { Property } from "@/types/domain";
import { formatMoney } from "@/lib/format";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100);

  return (
    <article className="rounded-xl bg-white shadow-sm ring-1 ring-[var(--outline-soft)]">
      <div className="grid gap-5 p-5 lg:grid-cols-4 lg:items-center">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-[var(--foreground)]">{property.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Loc</span>
            {property.address}, {property.city}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--subtle-foreground)]">Inventory</p>
          <p className="text-lg font-bold text-[var(--foreground)]">{property.totalUnits} Units</p>
          <p className="text-xs font-semibold text-[var(--success)]">{property.occupiedUnits} occupied</p>
        </div>

        <div className="space-y-1 lg:text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--subtle-foreground)]">Monthly revenue</p>
          <p className="text-xl font-extrabold text-[var(--primary)]">{formatMoney(property.monthlyRevenue)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Occupancy {occupancyRate}%</p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-[var(--secondary)]">
        <div className="h-full bg-[var(--success-strong)]" style={{ width: `${occupancyRate}%` }} />
      </div>
    </article>
  );
}

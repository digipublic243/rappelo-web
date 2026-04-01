import type { Property } from "@/types/domain";
import { formatMoney } from "@/lib/format";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100);

  return (
    <article className="rounded-xl bg-white shadow-sm ring-1 ring-[#d9e4ea]">
      <div className="grid gap-5 p-5 lg:grid-cols-4 lg:items-center">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-[#2a3439]">{property.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#566166]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Loc</span>
            {property.address}, {property.city}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#717c82]">Inventory</p>
          <p className="text-lg font-bold text-[#2a3439]">{property.totalUnits} Units</p>
          <p className="text-xs font-semibold text-[#22614d]">{property.occupiedUnits} occupied</p>
        </div>

        <div className="space-y-1 lg:text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#717c82]">Monthly revenue</p>
          <p className="text-xl font-extrabold text-[#545f73]">{formatMoney(property.monthlyRevenue)}</p>
          <p className="text-xs text-[#566166]">Occupancy {occupancyRate}%</p>
        </div>
      </div>
      <div className="h-1.5 w-full bg-[#e8eff3]">
        <div className="h-full bg-[#2c6a55]" style={{ width: `${occupancyRate}%` }} />
      </div>
    </article>
  );
}

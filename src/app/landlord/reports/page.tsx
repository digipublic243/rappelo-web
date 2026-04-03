import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { formatMoney } from "@/lib/format";
import { getLandlordReportsData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function ReportsPage() {
  const { properties, leases, payments, meta } = await getLandlordReportsData();
  const monthlyRevenue = payments.filter((payment) => payment.status === "paid").reduce((total, payment) => total + payment.amount, 0);
  const activeLeases = leases.filter((lease) => lease.status === "active").length;
  const occupancyRate =
    properties.length > 0
      ? Math.round(
          (properties.reduce((sum, property) => sum + property.occupiedUnits, 0) /
            properties.reduce((sum, property) => sum + property.totalUnits, 0)) *
            100,
        )
      : 0;

  return (
    <LandlordPageFrame currentPath="/landlord/reports">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Portfolio Intelligence"
        description="Live reporting summary composed from portfolio, lease and payment data."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Monthly Revenue", formatMoney(monthlyRevenue)],
          ["Occupancy Rate", `${occupancyRate}%`],
          ["Lease Stability", activeLeases > 0 ? "Stable" : "Watchlist"],
          ["Open Risk Items", String(payments.filter((payment) => payment.status === "pending").length)],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-secondary-2">{label}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <SurfaceCard className="p-6 lg:col-span-8">
          <h2 className="text-xl font-bold text-foreground">Revenue by Property</h2>
          <div className="mt-5 space-y-3">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center justify-between rounded-xl bg-[var(--secondary-4)] px-4 py-4">
                <span className="font-semibold text-foreground">{property.name}</span>
                <span className="text-sm font-bold text-primary">{formatMoney(property.monthlyRevenue)}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[28px] bg-[linear-gradient(145deg,var(--primary),var(--primary-2))] p-8 text-white lg:col-span-4">
          <h2 className="text-xl font-bold">Quarterly Report</h2>
          <p className="mt-3 text-sm text-white/80">Narrative insight card preserved as a distinct reporting block instead of collapsing everything into generic KPI tiles.</p>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}

import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { formatDate, formatMoney } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getLandlordDashboardVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function LandlordDashboardPage() {
  const dashboard = await getLandlordDashboardVm();
  const overduePayment = dashboard.payments.find((payment) => payment.status === "pending");
  const totalRevenue = dashboard.payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalUnits = dashboard.properties.reduce((sum, property) => sum + property.totalUnits, 0);
  const occupiedUnits = dashboard.properties.reduce((sum, property) => sum + property.occupiedUnits, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const renewalCount = dashboard.leases.filter((lease) => lease.status === "expired").length;
  const featuredProperty =
    [...dashboard.properties].sort((left, right) => right.monthlyRevenue - left.monthlyRevenue)[0] ?? null;
  const dashboardCards = [
    {
      label: "Total Revenue",
      value: formatMoney(totalRevenue),
      hint: `${dashboard.payments.filter((payment) => payment.status === "paid").length} paid invoices`,
      icon: "payments",
      tone: "bg-primary-3 text-primary",
    },
    {
      label: "Occupancy Rate",
      value: `${occupancyRate}%`,
      hint: `${occupiedUnits}/${totalUnits || 0} Units Occupied`,
      icon: "hotel_class",
      tone: "bg-primary-3 text-[var(--primary-2)]",
    },
    {
      label: "Active Leases",
      value: String(dashboard.kpis.activeLeases),
      hint: `${renewalCount} pending renewal`,
      icon: "description",
      tone: "bg-success/20 text-success",
    },
    {
      label: "Pending Bookings",
      value: String(dashboard.kpis.pendingBookings),
      hint: dashboard.kpis.pendingBookings > 0 ? "Requires review" : "Inbox clear",
      icon: "event_repeat",
      tone: "bg-secondary text-secondary-2",
    },
  ];

  return (
    <LandlordPageFrame currentPath="/landlord/dashboard">
      <DataStateNotice meta={dashboard.meta} />
      <PageIntro
        eyebrow="Portfolio Insights"
        title="Executive Dashboard"
        description="Portfolio health, payment exposure, lease momentum, and booking activity aligned to the Stitch dashboard structure."
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <SurfaceCard key={card.label} className="border-l-4 border-l-[var(--primary)] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className={`rounded-lg p-2 ${card.tone}`}>
                <MaterialIcon name={card.icon} className="text-[22px]" />
              </div>
              <span className="rounded-full bg-success/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                {card.hint.includes("%") ? card.hint.split(" ")[0] : "Live"}
              </span>
            </div>
            <p className="text-sm font-medium text-secondary-2">{card.label}</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">{card.value}</h2>
            <p className="mt-2 text-xs text-secondary-2">{card.hint}</p>
          </SurfaceCard>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <SurfaceCard className="overflow-hidden">
            <div className="flex items-end justify-between p-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">Needs Attention</h3>
                <p className="mt-1 text-sm text-secondary-2">Operational tasks that require the next landlord action.</p>
              </div>
              <button className="text-sm font-semibold text-primary underline" type="button">
                Manage All Tasks
              </button>
            </div>
            <div className="divide-y divide-[var(--secondary)]">
              {dashboard.bookings.map((booking, index) => (
                <div key={booking.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-3 text-primary">
                    <MaterialIcon
                      name={index === 0 ? "pending_actions" : index === 1 ? "history_edu" : "add_home"}
                      className="text-[22px]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-bold text-foreground">
                        {index === 0 ? "Overdue Payment Review" : index === 1 ? "Lease Expiry Window" : "New Booking Request"}
                      </p>
                      <StatusBadge status={booking.status} label={booking.status.replace("_", " ")} />
                    </div>
                    <p className="mt-1 text-xs text-secondary-2">
                      {index === 0 && overduePayment
                        ? `Amount ${formatMoney(overduePayment.amount)} due ${formatDate(overduePayment.dueDate)} for ${booking.unitId}.`
                        : index === 1
                          ? "Lease expires in 15 days. Renewal options prepared."
                          : `Booking requested from ${formatDate(booking.requestedFrom)} to ${formatDate(booking.requestedTo)}.`}
                    </p>
                  </div>
                  <ActionButton variant={index === 0 ? "primary" : "ghost"} className="px-4 py-2 text-xs">
                    {index === 0 ? "Send Notice" : index === 1 ? "View Lease" : "Review"}
                  </ActionButton>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Portfolio Snapshot</h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-2">
                Live Overview
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[var(--secondary-4)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Properties</p>
                <p className="mt-2 text-3xl font-black text-foreground">{dashboard.kpis.properties}</p>
              </div>
              <div className="rounded-xl bg-[var(--secondary-4)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Tenants</p>
                <p className="mt-2 text-3xl font-black text-foreground">{dashboard.kpis.tenants}</p>
              </div>
              <div className="rounded-xl bg-[var(--secondary-4)] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Pending Payments</p>
                <p className="mt-2 text-3xl font-black text-foreground">{dashboard.kpis.pendingPayments}</p>
              </div>
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <SurfaceCard className="overflow-hidden">
            <div className="relative h-60 bg-[linear-gradient(160deg,var(--primary),var(--primary-2))] p-6 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_44%)]" />
              <div className="relative">
                <span className="rounded-full bg-background/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Featured Property</span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight">{featuredProperty?.name ?? "Portfolio overview"}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {featuredProperty
                    ? `${featuredProperty.address}, ${featuredProperty.city}`
                    : "Live portfolio highlights will appear here once landlord data is available."}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Occupancy</p>
                    <p className="mt-1 font-bold">
                      {featuredProperty && featuredProperty.totalUnits > 0
                        ? `${Math.round((featuredProperty.occupiedUnits / featuredProperty.totalUnits) * 100)}%`
                        : "0%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60">Revenue</p>
                    <p className="mt-1 font-bold">{featuredProperty ? formatMoney(featuredProperty.monthlyRevenue) : "$0.00"}</p>
                  </div>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-bold text-foreground">Shortcuts</h3>
            <div className="mt-4 space-y-3">
              {[
                ["description", "Lease Templates"],
                ["payments", "Generate Payment Link"],
                ["group", "Review Tenant Profiles"],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-[var(--secondary-4)] px-4 py-3">
                  <div className="rounded-lg bg-background p-2 text-primary">
                    <MaterialIcon name={icon} className="text-[20px]" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}

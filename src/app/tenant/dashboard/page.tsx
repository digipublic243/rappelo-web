import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { formatDate, formatMoney, paymentStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getTenantDashboardVm } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantDashboardPage() {
  const dashboard = await getTenantDashboardVm();
  const nextPayment = dashboard.nextDuePayment ?? dashboard.payments.find((payment) => payment.status === "pending");
  const currentLeaseLabel =
    dashboard.currentLease ? `${formatDate(dashboard.currentLease.startDate)} - ${formatDate(dashboard.currentLease.endDate)}` : "No active lease";
  const dashboardFacts = [
    {
      icon: "description",
      title: "Lease Status",
      text: dashboard.currentLease ? `${dashboard.currentLease.status} until ${formatDate(dashboard.currentLease.endDate)}.` : "No active lease linked to this account.",
    },
    {
      icon: "payments",
      title: "Payment Health",
      text: nextPayment ? `${paymentStatusLabel(nextPayment.status)} payment due ${formatDate(nextPayment.dueDate)}.` : "No pending payment cycle at the moment.",
    },
    {
      icon: "home",
      title: "Residence",
      text: dashboard.currentProperty ? `${dashboard.currentProperty.name}, ${dashboard.currentProperty.city}.` : "No property currently attached to the active stay.",
    },
  ];
  const accountSummary = [
    ["Leases", String(dashboard.quickStats?.leases ?? dashboard.leases.length)],
    ["Payments", String(dashboard.quickStats?.payments ?? dashboard.payments.length)],
    ["Pending", String(dashboard.quickStats?.pending_payments ?? dashboard.payments.filter((payment) => payment.status === "pending").length)],
  ];

  return (
    <TenantPageFrame currentPath="/tenant/dashboard">
      <DataStateNotice meta={dashboard.meta} />
      <PageIntro
        eyebrow="Overview"
        title={`Welcome back, ${dashboard.profileName.split(" ")[0]}`}
        description={`Here is what is happening with your residency at ${dashboard.currentProperty?.name ?? "your current residence"}.`}
        action={
          <ActionButton>
            <MaterialIcon name="add" className="text-[18px]" />
            Book another stay
          </ActionButton>
        }
      />

      <section className="grid gap-6 md:grid-cols-12">
        <SurfaceCard className="overflow-hidden md:col-span-8">
          <div className="relative h-72">
            <img
              alt="Current stay"
              className="h-full w-full object-cover"
              src={
                dashboard.residenceImage ??
                dashboard.heroBanner ??
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-8 text-white">
              <span className="mb-3 inline-block rounded-full bg-[#2c6a55] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Current stay</span>
              <h2 className="text-2xl font-bold">
                {dashboard.currentUnit?.label ?? "Unit unavailable"}, {dashboard.currentProperty?.name ?? "Property unavailable"}
              </h2>
              <p className="text-sm text-white/80">
                {dashboard.currentProperty ? `${dashboard.currentProperty.address}, ${dashboard.currentProperty.city}` : "Address unavailable"}
              </p>
            </div>
          </div>
          <div className="grid gap-6 p-8 md:grid-cols-4">
            {[
              ["Lease Term", currentLeaseLabel],
              ["Expiry Date", dashboard.currentLease ? formatDate(dashboard.currentLease.endDate) : "Not available"],
              ["Rate", dashboard.currentLease ? formatMoney(dashboard.currentLease.rentAmount) : "$0.00"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#717c82]">{label}</p>
                <p className="mt-1 text-sm font-semibold text-[#2a3439]">{value}</p>
              </div>
            ))}
            <div className="flex items-center justify-end">
              <button className="text-sm font-bold text-[#545f73]" type="button">
                Details
              </button>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="bg-[#d8e3fb] p-8 md:col-span-4">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-white/50 p-3">
              <MaterialIcon name="account_balance_wallet" className="text-[22px] text-[#545f73]" />
            </div>
            <span className="rounded-full bg-[#545f73]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#485367]">
              Next Cycle
            </span>
          </div>
          <h3 className="mt-10 text-lg font-bold text-[#2a3439]">Rent Payment</h3>
          <p className="mt-1 text-4xl font-black tracking-tight text-[#2a3439]">{nextPayment ? formatMoney(nextPayment.amount) : "$0.00"}</p>
          <p className="mt-4 text-sm font-medium text-[#475266]">
            {nextPayment ? `Due by ${formatDate(nextPayment.dueDate)}` : "No pending payment cycle"}
          </p>
          <ActionButton className="mt-8 w-full">Pay Now</ActionButton>
          <p className="mt-3 text-center text-[11px] text-[#475266]">
            {dashboard.automaticPaymentsEnabled ? "Automatic payments are enabled for this unit." : "Automatic payments are not enabled yet."}
          </p>
        </SurfaceCard>

        <SurfaceCard className="bg-[#f0f4f7] p-8 md:col-span-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2a3439]">Residency Snapshot</h3>
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#566166]">
              {dashboard.leases.length} Active Context
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {dashboardFacts.map(({ icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-lg bg-white/70 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d3e4fe] text-[#435368]">
                  <MaterialIcon name={icon} className="text-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2a3439]">{title}</p>
                  <p className="mt-1 text-xs text-[#566166]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8 md:col-span-6">
          <h3 className="text-lg font-bold text-[#2a3439]">Account Overview</h3>
          <p className="mt-2 text-sm text-[#566166]">Live summary derived from the current tenant profile, lease list and payment ledger.</p>
          <div className="mt-6 rounded-2xl bg-[linear-gradient(145deg,#2a3439,#556170)] p-6 text-white">
            <p className="text-sm font-semibold">{dashboard.profileName}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {accountSummary.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-white/8 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{label}</p>
                  <p className="mt-2 text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8 md:col-span-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#2a3439]">Unread Notifications</h3>
            <span className="rounded-full bg-[#f0f4f7] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#566166]">
              {dashboard.notifications.length} pending
            </span>
          </div>
          {dashboard.notifications.length === 0 ? (
            <p className="mt-4 text-sm text-[#566166]">No unread tenant notifications from the backend right now.</p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {dashboard.notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-[#f0f4f7] p-4">
                  <p className="text-sm font-bold text-[#2a3439]">{notification.title}</p>
                  <p className="mt-2 text-sm text-[#566166]">{notification.message}</p>
                  {notification.createdAt ? (
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#717c82]">
                      {formatDate(notification.createdAt)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </section>
    </TenantPageFrame>
  );
}

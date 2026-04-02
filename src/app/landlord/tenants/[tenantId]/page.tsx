import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPhone, leaseStatusLabel, paymentStatusLabel } from "@/lib/format";
import { getLandlordTenantDetailVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

interface PageProps {
  params: Promise<{ tenantId: string }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { tenantId } = await params;
  const detail = await getLandlordTenantDetailVm(tenantId);

  if (!detail) {
    notFound();
  }
  const { tenant, lease, payments, meta } = detail;

  return (
    <LandlordPageFrame currentPath="/landlord/tenants">
      <DataStateNotice meta={meta} />
      <PageIntro
        title={tenant.fullName}
        description={`Primary Tenant • ${tenant.unitId}`}
        action={
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="secondary">Message Tenant</ActionButton>
            <ActionButton variant="ghost">Send Reminder</ActionButton>
            <ActionButton>End Lease</ActionButton>
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Current Lease</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Email</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{tenant.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Phone</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{formatPhone(tenant.phone)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Lease Status</p>
                <div className="mt-2">
                  <StatusBadge status={lease?.status ?? tenant.leaseStatus} label={leaseStatusLabel(lease?.status ?? tenant.leaseStatus)} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Payment Health</p>
                <div className="mt-2">
                  <StatusBadge status={tenant.paymentStatus} label={paymentStatusLabel(tenant.paymentStatus)} />
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[var(--secondary)] px-6 py-5">
              <h2 className="text-xl font-bold text-foreground">Stay & Payment History</h2>
            </div>
            <table className="w-full min-w-[720px]">
              <thead className="bg-[var(--secondary-4)]">
                <tr>
                  {["Property / Unit", "Lease", "Payment", "Context"].map((label) => (
                    <th key={label} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary-2">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-[var(--secondary)]">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">Azure Heights • {tenant.unitId}</td>
                  <td className="px-6 py-4 text-sm text-secondary-2">{leaseStatusLabel(lease?.status ?? tenant.leaseStatus)}</td>
                  <td className="px-6 py-4 text-sm text-secondary-2">{payments[0] ? paymentStatusLabel(payments[0].status) : paymentStatusLabel(tenant.paymentStatus)}</td>
                  <td className="px-6 py-4 text-sm text-secondary-2">Latest ledger and tenant communication snapshot.</td>
                </tr>
              </tbody>
            </table>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Activity Feed</h2>
            <div className="mt-5 space-y-4">
              {[
                "Tenant reported noise from AC unit. Maintenance scheduled for Thursday.",
                "Rent payment confirmed and receipt archived to ledger.",
                "Lease renewal inquiry sent for upcoming term.",
              ].map((item) => (
                <div key={item} className="rounded-xl bg-[var(--secondary-4)] p-4 text-sm text-secondary-2">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}

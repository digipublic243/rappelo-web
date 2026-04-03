import { notFound } from "next/navigation";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getCurrentAccountProfileVm } from "@/features/account/api";
import { formatDate, formatMoney, formatPhone } from "@/lib/format";

export default async function TenantProfilePage() {
  const profile = await getCurrentAccountProfileVm("tenant");

  if (!profile.user || !profile.details) {
    notFound();
  }

  const summary = [
    ["Leases", String(profile.details.leasesCount)],
    ["Payments", String(profile.details.paymentsCount)],
    ["Current Rent", profile.details.currentLease ? formatMoney(profile.details.currentLease.rentAmount) : "N/A"],
  ];

  return (
    <TenantPageFrame currentPath="/tenant/profile">
      <DataStateNotice meta={profile.meta} />
      <PageIntro
        backHref="/tenant/dashboard"
        backLabel="Retour au tableau de bord"
        eyebrow="Account"
        title={profile.user.full_name || "Tenant Profile"}
        description="Verify the active tenant account, linked residency details, and current billing context."
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <SurfaceCard className="p-6 lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Identity</p>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-secondary-2">Role</p>
              <p className="text-lg font-bold text-foreground">{profile.user.role}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-2">Phone</p>
              <p className="text-lg font-bold text-foreground">{formatPhone(profile.user.phone_number)}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-2">Email</p>
              <p className="text-lg font-bold text-foreground">{profile.user.email || "No email on file"}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-2">Joined</p>
              <p className="text-lg font-bold text-foreground">{formatDate(profile.user.date_joined)}</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Residency</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {summary.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[var(--secondary-4)] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">{label}</p>
                <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[var(--secondary-4)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">Current Property</p>
              <p className="mt-2 text-lg font-bold text-foreground">{profile.details.currentProperty?.name || "Not linked"}</p>
              <p className="mt-1 text-sm text-secondary-2">
                {profile.details.currentProperty
                  ? `${profile.details.currentProperty.address}, ${profile.details.currentProperty.city}`
                  : "No property attached to the current tenant profile."}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--secondary-4)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">Current Unit</p>
              <p className="mt-2 text-lg font-bold text-foreground">{profile.details.currentUnit?.label || "Not linked"}</p>
              <p className="mt-1 text-sm text-secondary-2">
                {profile.details.currentLease
                  ? `${formatDate(profile.details.currentLease.startDate)} - ${formatDate(profile.details.currentLease.endDate)}`
                  : "No active lease attached to this account."}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </section>
    </TenantPageFrame>
  );
}

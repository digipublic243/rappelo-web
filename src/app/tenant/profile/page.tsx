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
        eyebrow="Account"
        title={profile.user.full_name || "Tenant Profile"}
        description="Verify the active tenant account, linked residency details, and current billing context."
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <SurfaceCard className="p-6 lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#717c82]">Identity</p>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-[#566166]">Role</p>
              <p className="text-lg font-bold text-[#2a3439]">{profile.user.role}</p>
            </div>
            <div>
              <p className="text-sm text-[#566166]">Phone</p>
              <p className="text-lg font-bold text-[#2a3439]">{formatPhone(profile.user.phone_number)}</p>
            </div>
            <div>
              <p className="text-sm text-[#566166]">Email</p>
              <p className="text-lg font-bold text-[#2a3439]">{profile.user.email || "No email on file"}</p>
            </div>
            <div>
              <p className="text-sm text-[#566166]">Joined</p>
              <p className="text-lg font-bold text-[#2a3439]">{formatDate(profile.user.date_joined)}</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 lg:col-span-7">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#717c82]">Residency</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {summary.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#2a3439]">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#f0f4f7] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Current Property</p>
              <p className="mt-2 text-lg font-bold text-[#2a3439]">{profile.details.currentProperty?.name || "Not linked"}</p>
              <p className="mt-1 text-sm text-[#566166]">
                {profile.details.currentProperty
                  ? `${profile.details.currentProperty.address}, ${profile.details.currentProperty.city}`
                  : "No property attached to the current tenant profile."}
              </p>
            </div>
            <div className="rounded-xl bg-[#f0f4f7] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Current Unit</p>
              <p className="mt-2 text-lg font-bold text-[#2a3439]">{profile.details.currentUnit?.label || "Not linked"}</p>
              <p className="mt-1 text-sm text-[#566166]">
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

import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getCurrentAccountProfileVm } from "@/features/account/api";
import { formatDate, formatPhone } from "@/lib/format";

export default async function LandlordProfilePage() {
  const profile = await getCurrentAccountProfileVm("landlord");

  if (!profile.user || !profile.details) {
    notFound();
  }

  const stats = [
    ["Properties", String(profile.details.propertiesCount)],
    ["Units", String(profile.details.unitsCount)],
    ["Tenants", String(profile.details.tenantsCount)],
    ["Bookings", String(profile.details.bookingsCount)],
    ["Leases", String(profile.details.leasesCount)],
    ["Payments", String(profile.details.paymentsCount)],
  ];

  return (
    <LandlordPageFrame currentPath="/landlord/profile">
      <DataStateNotice meta={profile.meta} />
      <PageIntro
        eyebrow="Account"
        title={profile.user.full_name || "Landlord Profile"}
        description="Verify the active landlord account, contact information, and current workspace scope."
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
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Workspace Scope</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {stats.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-[var(--secondary-4)] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">{label}</p>
                <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}

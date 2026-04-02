import Link from "next/link";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, actionButtonClassName } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { bookingStatusLabel, formatDate, formatMoney } from "@/lib/format";
import { getTenantBookingsData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default async function TenantBookingsPage() {
  const { bookings, meta } = await getTenantBookingsData();

  return (
    <TenantPageFrame currentPath="/tenant/bookings">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Mes réservations"
        description="Les réservations restent séparées des baux et restent suivies par statut."
        action={
          <Link className={actionButtonClassName({})} href="/tenant/book-stay">
            <MaterialIcon name="add" className="text-[18px]" />
            Nouvelle réservation
          </Link>
        }
      />

      <div className="flex gap-3 overflow-auto pb-2">
        {["All Bookings", "Upcoming", "In Review", "Archived"].map((label, index) => (
          <button
            key={label}
            className={`rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap ${index === 0 ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-white text-[var(--muted-foreground)]"}`}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {bookings?.length === 0 ? (
        <EmptyState
          title="Aucune réservation"
          description="Vos demandes de réservation apparaîtront ici dès qu’elles seront créées via le flow connecté au backend."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings?.map?.((booking) => (
            <SurfaceCard key={booking.id} className="overflow-hidden">
              <div className="h-56 bg-[var(--outline-soft)]" />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">{booking.unitId || "Unit pending"}</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">{booking.propertyId || "Property pending"}</p>
                  </div>
                  <StatusBadge status={booking.status} label={bookingStatusLabel(booking.status)} />
                </div>
                <div className="mt-5 space-y-2 text-sm text-[var(--muted-foreground)]">
                  <p>{formatDate(booking.requestedFrom)} - {formatDate(booking.requestedTo)}</p>
                  <p>Deposit {formatMoney(booking.depositAmount)}</p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </TenantPageFrame>
  );
}

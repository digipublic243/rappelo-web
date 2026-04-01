import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordBookingsData } from "@/features/landlord/api";
import { bookingStatusLabel, formatDate, formatMoney } from "@/lib/format";

export default async function BookingRequestsPage() {
  const { bookings, meta } = await getLandlordBookingsData();

  return (
    <LandlordPageFrame currentPath="/landlord/bookings">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Pre-Lease Workflow"
        title="Booking Requests"
        description="Bookings remain distinct from leases and need explicit review before agreement creation."
      />

      {bookings.length === 0 ? (
        <EmptyState
          title="No booking requests yet"
          description="Live booking requests will appear here as soon as tenants submit them through the API-backed flow."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {bookings.map((booking) => (
            <SurfaceCard key={booking.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-bold text-[#2a3439]">{booking.id}</p>
                  <p className="mt-1 text-sm text-[#566166]">{booking.unitId || "Unit pending"}</p>
                </div>
                <StatusBadge status={booking.status} label={bookingStatusLabel(booking.status)} />
              </div>
              <div className="mt-5 grid gap-3 text-sm text-[#566166]">
                <p>Stay window: {formatDate(booking.requestedFrom)} - {formatDate(booking.requestedTo)}</p>
                <p>Deposit: {formatMoney(booking.depositAmount)}</p>
                <p>Property: {booking.propertyId || "Property pending"}</p>
              </div>
              <Link className="mt-6 inline-flex text-sm font-semibold text-[#545f73]" href={`/landlord/bookings/${booking.id}`}>
                Open review drawer
              </Link>
            </SurfaceCard>
          ))}
        </div>
      )}
    </LandlordPageFrame>
  );
}

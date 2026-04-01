import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { bookingStatusLabel, formatDate, formatMoney } from "@/lib/format";
import { getTenantBookingsData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantBookingsPage() {
  const { bookings, meta } = await getTenantBookingsData();

  return (
    <TenantPageFrame currentPath="/tenant/bookings">
      <DataStateNotice meta={meta} />
      <PageIntro title="My Stays" description="Booking requests stay separated from leases and remain filterable by status." />

      <div className="flex gap-3 overflow-auto pb-2">
        {["All Bookings", "Upcoming", "In Review", "Archived"].map((label, index) => (
          <button
            key={label}
            className={`rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap ${index === 0 ? "bg-[#545f73] text-[#f6f7ff]" : "bg-white text-[#566166]"}`}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No stays found"
          description="Your booking requests will appear here once they are created in the live booking API."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => (
            <SurfaceCard key={booking.id} className="overflow-hidden">
              <div className="h-56 bg-[#d9e4ea]" />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#2a3439]">{booking.unitId || "Unit pending"}</h2>
                    <p className="text-sm text-[#566166]">{booking.propertyId || "Property pending"}</p>
                  </div>
                  <StatusBadge status={booking.status} label={bookingStatusLabel(booking.status)} />
                </div>
                <div className="mt-5 space-y-2 text-sm text-[#566166]">
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

import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { confirmBookingAction, rejectBookingAction } from "@/features/landlord/actions";
import { getLandlordBookingDetail } from "@/features/landlord/api";
import { bookingStatusLabel, formatDate, formatMoney } from "@/lib/format";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function BookingReviewPage({ params }: PageProps) {
  const { bookingId } = await params;
  const detail = await getLandlordBookingDetail(bookingId);

  if (!detail) {
    notFound();
  }
  const { booking, tenant, property, unit, meta } = detail;

  return (
    <LandlordPageFrame currentPath="/landlord/bookings">
      <DataStateNotice meta={meta} />
      <PageIntro title="Review Request" description="Drawer-like booking review with tenant context, terms, and decision actions." />

      <section className="grid gap-8 lg:grid-cols-12">
        <SurfaceCard className="p-6 lg:col-span-5">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#545f73]">Tenant Profile</p>
          <div className="mt-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#d8e3fb] text-xl font-bold text-[#545f73]">
              {(tenant?.fullName || "Tenant")
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#2a3439]">{tenant?.fullName || "Tenant unavailable"}</h2>
            <p className="text-sm text-[#566166]">{tenant?.email || "No email available"}</p>
            <div className="mt-4 space-y-2 text-sm text-[#566166]">
              <p>Phone: {tenant?.phone || "No phone available"}</p>
              <p>Lease Status: {tenant?.leaseStatus || "Unknown"}</p>
              <p>Payment Status: {tenant?.paymentStatus || "Unknown"}</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Booking Terms</h2>
            <StatusBadge status={booking.status} label={bookingStatusLabel(booking.status)} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#f0f4f7] p-4">
              <p className="text-sm font-medium text-[#566166]">Requested Property</p>
              <p className="mt-2 text-sm font-bold text-[#2a3439]">
                {property?.name || booking.propertyId || "Property pending"} • {unit?.label || booking.unitId || "Unit pending"}
              </p>
            </div>
            <div className="rounded-xl bg-[#f0f4f7] p-4">
              <p className="text-sm font-medium text-[#566166]">Deposit</p>
              <p className="mt-2 text-sm font-bold text-[#2a3439]">{formatMoney(booking.depositAmount)}</p>
            </div>
            <div className="rounded-xl bg-[#f0f4f7] p-4 md:col-span-2">
              <p className="text-sm font-medium text-[#566166]">Requested Stay Window</p>
              <p className="mt-2 text-sm font-bold text-[#2a3439]">
                {formatDate(booking.requestedFrom)} - {formatDate(booking.requestedTo)}
              </p>
              <p className="mt-2 text-xs text-[#566166]">
                {unit?.type ? `${unit.type} • ` : ""}
                {property ? `${property.address}, ${property.city}` : "Property address unavailable from the current booking payload."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionButton variant="ghost">Request more info</ActionButton>
            <form action={rejectBookingAction}>
              <input name="bookingId" type="hidden" value={booking.id} />
              <input name="reason" type="hidden" value="Rejected from landlord review screen." />
              <button className="inline-flex items-center justify-center rounded-lg bg-[#d8e3fb] px-5 py-3 text-sm font-semibold text-[#475266]" type="submit">
                Reject Booking
              </button>
            </form>
            <form action={confirmBookingAction}>
              <input name="bookingId" type="hidden" value={booking.id} />
              <button className="inline-flex items-center justify-center rounded-lg bg-[#545f73] px-5 py-3 text-sm font-semibold text-[#f6f7ff]" type="submit">
                Approve Booking
              </button>
            </form>
          </div>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}

import { StatusBadge } from "@/components/ui/StatusBadge";
import { bookingStatusLabel, formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/types/domain";

interface BookingStatusPanelProps {
  booking: Booking;
}

export function BookingStatusPanel({ booking }: BookingStatusPanelProps) {
  const canApprove = booking.status === "new" || booking.status === "in_review";

  return (
    <article className="rounded-2xl border border-zinc-200 bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900">Request {booking.id}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {formatDate(booking.requestedFrom)} to {formatDate(booking.requestedTo)}
          </p>
        </div>
        <StatusBadge status={booking.status} label={bookingStatusLabel(booking.status)} />
      </div>
      <p className="mt-3 text-sm text-zinc-700">Booking deposit: {formatMoney(booking.depositAmount)}</p>
      <div className="mt-4 flex gap-2">
        <button
          className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canApprove}
        >
          Request info
        </button>
        <button
          className="rounded-lg bg-zinc-900 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canApprove}
        >
          Approve
        </button>
      </div>
    </article>
  );
}

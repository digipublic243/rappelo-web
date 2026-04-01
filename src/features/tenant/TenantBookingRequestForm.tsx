"use client";

import { useActionState } from "react";
import { ActionButton, SurfaceCard } from "@/components/shared/StitchPrimitives";
import { submitTenantBookingAction } from "@/features/tenant/actions";
import { initialBookingRequestActionState } from "@/features/tenant/booking-state";
import { formatCadence, formatMoney } from "@/lib/format";
import type { Unit } from "@/types/domain";

interface TenantBookingRequestFormProps {
  units: Unit[];
}

export function TenantBookingRequestForm({ units }: TenantBookingRequestFormProps) {
  const [state, formAction, pending] = useActionState(submitTenantBookingAction, initialBookingRequestActionState);
  const selectedUnit = units[0];

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        {units.map((unit, index) => (
          <SurfaceCard key={unit.id} className={`p-6 ${index === 0 ? "ring-2 ring-[#545f73]" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#2a3439]">{unit.label}</h2>
                <p className="mt-1 text-sm text-[#566166]">{unit.type}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-[#2a3439]">{formatMoney(unit.price)}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#717c82]">
                  {formatCadence(unit.pricingCadence)}
                </p>
              </div>
            </div>
          </SurfaceCard>
        ))}

        <SurfaceCard className="p-6">
          <h2 className="text-xl font-bold text-[#2a3439]">Booking Terms</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-[#566166]">
              Unit
              <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue={selectedUnit?.id} name="unitId">
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.label} — {unit.type}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Preferred Move In Time
              <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="morning" name="preferred_move_in_time">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Check In
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="check_in" required type="date" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Check Out
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="check_out" required type="date" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Adults
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="1" min="1" name="adults_count" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Children
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="0" min="0" name="children_count" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Monthly Income Estimate
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="monthly_income_estimate" type="text" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Employment Status
              <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="employed" name="employment_status_snapshot">
                <option value="employed">Employed</option>
                <option value="self_employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Emergency Contact Name
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="emergency_contact_name" type="text" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Emergency Contact Phone
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="emergency_contact_phone" type="text" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Booking Deposit
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="0" min="0" name="booking_deposit" type="number" />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#d9e4ea] px-4 py-3 text-sm font-medium text-[#566166]">
              <input name="has_pets" type="checkbox" value="true" />
              I have pets
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Pet Details
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="pet_details" type="text" />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Stay Purpose
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="stay_purpose" type="text" />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Special Requests
              <textarea className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="special_requests" rows={4} />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Internal Notes
              <textarea className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="notes" rows={3} />
            </label>
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="p-6 lg:col-span-4">
        <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Booking Summary</h2>
        <p className="mt-1 text-xs text-[#566166]">
          {selectedUnit?.type ?? "Available unit"} • {selectedUnit?.label ?? "Selection pending"}
        </p>
        <div className="mt-6 space-y-4">
          {[
            ["Base Rate", selectedUnit ? formatMoney(selectedUnit.price) : "$0.00"],
            ["Deposit", selectedUnit?.depositEnabled ? "Required" : "Optional"],
            ["Cadence", selectedUnit ? formatCadence(selectedUnit.pricingCadence) : "Not available"],
            ["Method", selectedUnit?.allowedPaymentMethods?.join(" + ").toUpperCase() || "Cash / EasyPay"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-[#f0f4f7] px-4 py-3 text-sm">
              <span className="text-[#566166]">{label}</span>
              <span className="font-semibold text-[#2a3439]">{value}</span>
            </div>
          ))}
        </div>
        {state.error ? <p className="mt-4 rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{state.error}</p> : null}
        <ActionButton className="mt-6 w-full" disabled={pending} type="submit">
          {pending ? "Submitting..." : "Submit booking request"}
        </ActionButton>
      </SurfaceCard>
    </form>
  );
}

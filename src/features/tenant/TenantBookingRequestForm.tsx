"use client";

import { useActionState } from "react";
import { AppForm, FormInlineError, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { actionButtonClassName, SurfaceCard } from "@/components/shared/StitchPrimitives";
import { submitTenantBookingAction } from "@/features/tenant/actions";
import { initialBookingRequestActionState } from "@/features/tenant/booking-state";
import { formatCadence, formatMoney } from "@/lib/format";
import type { Unit } from "@/types/domain";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface TenantBookingRequestFormProps {
  units: Unit[];
}

export function TenantBookingRequestForm({ units }: TenantBookingRequestFormProps) {
  const [state, formAction, pending] = useActionState(submitTenantBookingAction, initialBookingRequestActionState);
  useSyncGlobalApiError(state.error, { title: "Booking Request Error", scope: "bookings" });
  const selectedUnit = units[0];

  return (
    <AppForm action={formAction} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        {units.map((unit, index) => (
          <SurfaceCard key={unit.id} className={`p-6 ${index === 0 ? "ring-2 ring-[var(--primary)]" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{unit.label}</h2>
                <p className="mt-1 text-sm text-secondary-2">{unit.type}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-foreground">{formatMoney(unit.price, unit.currency ?? "CDF")}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  {formatCadence(unit.pricingCadence)}
                </p>
              </div>
            </div>
          </SurfaceCard>
        ))}

        <SurfaceCard className="p-6">
          <h2 className="text-xl font-bold text-foreground">Booking Terms</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FormField
              defaultValue={selectedUnit?.id}
              label="Unit"
              name="unitId"
              options={units.map((unit) => ({
                label: `${unit.label} — ${unit.type}`,
                value: unit.id,
              }))}
              type="select"
            />
            <FormField
              defaultValue="morning"
              label="Preferred Move In Time"
              name="preferred_move_in_time"
              options={[
                { label: "Morning", value: "morning" },
                { label: "Afternoon", value: "afternoon" },
                { label: "Evening", value: "evening" },
              ]}
              type="select"
            />
            <FormField label="Check In" name="check_in" required type="date" />
            <FormField label="Check Out" name="check_out" required type="date" />
            <FormField defaultValue="1" label="Adults" min={1} name="adults_count" type="number" />
            <FormField defaultValue="0" label="Children" min={0} name="children_count" type="number" />
            <FormField label="Monthly Income Estimate" name="monthly_income_estimate" type="text" />
            <FormField
              defaultValue="employed"
              label="Employment Status"
              name="employment_status_snapshot"
              options={[
                { label: "Employed", value: "employed" },
                { label: "Self-employed", value: "self_employed" },
                { label: "Student", value: "student" },
                { label: "Unemployed", value: "unemployed" },
              ]}
              type="select"
            />
            <FormField label="Emergency Contact Name" name="emergency_contact_name" type="text" />
            <FormField label="Emergency Contact Phone" name="emergency_contact_phone" type="text" />
            <FormField defaultValue="0" label="Booking Deposit" min={0} name="booking_deposit" type="number" />
            <FormField className="self-end" label="I have pets" name="has_pets" type="checkbox" value="true" />
            <FormField className="md:col-span-2" label="Pet Details" name="pet_details" type="text" />
            <FormField className="md:col-span-2" label="Stay Purpose" name="stay_purpose" type="text" />
            <FormField className="md:col-span-2" label="Special Requests" name="special_requests" rows={4} type="textarea" />
            <FormField className="md:col-span-2" label="Internal Notes" name="notes" rows={3} type="textarea" />
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="p-6 lg:col-span-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Booking Summary</h2>
        <p className="mt-1 text-xs text-secondary-2">
          {selectedUnit?.type ?? "Available unit"} • {selectedUnit?.label ?? "Selection pending"}
        </p>
        <div className="mt-6 space-y-4">
          {[
            ["Base Rate", selectedUnit ? formatMoney(selectedUnit.price, selectedUnit.currency ?? "CDF") : formatMoney(0, "CDF")],
            ["Deposit", selectedUnit?.depositEnabled ? "Required" : "Optional"],
            ["Cadence", selectedUnit ? formatCadence(selectedUnit.pricingCadence) : "Not available"],
            ["Method", selectedUnit?.allowedPaymentMethods?.join(" + ").toUpperCase() || "Cash / EasyPay"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-[var(--secondary-4)] px-4 py-3 text-sm">
              <span className="text-secondary-2">{label}</span>
              <span className="font-semibold text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <FormInlineError className="mt-4" message={state.error} />
        {state.errorDetails?.length ? (
          <div className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-background px-4 py-4">
            <p className="text-sm font-bold text-[var(--danger)]">Détails de l’erreur :</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color-mix(in_srgb,var(--danger) 72%,var(--background))]">
              {state.errorDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <FormSubmitButton className={actionButtonClassName({ className: "mt-6 w-full" })} disabled={pending}>
          {pending ? "Submitting..." : "Submit booking request"}
        </FormSubmitButton>
      </SurfaceCard>
    </AppForm>
  );
}

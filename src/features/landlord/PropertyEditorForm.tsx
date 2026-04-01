"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { ApiPropertyStatus } from "@/types/api";
import type { PropertyEditorActionState } from "@/features/landlord/property-editor-state";

interface PropertyEditorDefaults {
  propertyId?: string;
  name: string;
  propertyType: string;
  status: ApiPropertyStatus;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
  yearBuilt: string;
  totalUnits: string;
  squareFootage: string;
  purchasePrice: string;
  currentValue: string;
  isActive: boolean;
}

interface PropertyEditorFormProps {
  mode: "create" | "edit";
  action: (state: PropertyEditorActionState, formData: FormData) => Promise<PropertyEditorActionState>;
  defaults: PropertyEditorDefaults;
  initialState: PropertyEditorActionState;
  propertyStats?: {
    occupiedUnits?: number;
    occupancyRate?: number | null;
    monthlyRevenue?: number;
  };
}

const statusOptions: ApiPropertyStatus[] = ["active", "inactive", "maintenance", "sold"];

const propertyTypeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

export function PropertyEditorForm({
  mode,
  action,
  defaults,
  initialState,
  propertyStats,
}: PropertyEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedStatus, setSelectedStatus] = useState<ApiPropertyStatus>(defaults.status);
  const title = mode === "create" ? "Create Property" : "Update Property";

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-12">
      {defaults.propertyId ? <input name="propertyId" type="hidden" value={defaults.propertyId} /> : null}

      <div className="space-y-8 lg:col-span-8">
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e8eff3] p-3 text-[#545f73]">
              <MaterialIcon name="domain" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">{title}</h2>
              <p className="text-sm text-[#566166]">Capture the core property identity, address, and inventory profile.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-[#566166]">
              Property Name
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.name} name="name" required />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Property Type
              <select
                className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]"
                defaultValue={defaults.propertyType}
                name="property_type"
                required
              >
                {propertyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Address Line 1
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.addressLine1} name="address_line_1" required />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Address Line 2
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.addressLine2} name="address_line_2" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              City
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.city} name="city" required />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              State
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.state} name="state" required />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Postal Code
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.postalCode} name="postal_code" required />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Country
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.country} name="country" required />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Description
              <textarea
                className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]"
                defaultValue={defaults.description}
                name="description"
                rows={5}
              />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#e8eff3] p-3 text-[#545f73]">
              <MaterialIcon name="payments" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Portfolio Details</h2>
              <p className="text-sm text-[#566166]">Track inventory, valuation, and construction-related metadata for the asset.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-[#566166]">
              Total Units
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.totalUnits} min={1} name="total_units" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Year Built
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.yearBuilt} name="year_built" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Square Footage
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.squareFootage} name="square_footage" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166]">
              Purchase Price
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.purchasePrice} name="purchase_price" step="0.01" type="number" />
            </label>
            <label className="text-sm font-medium text-[#566166] md:col-span-2">
              Current Value
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-[#f0f4f7] px-4 py-3 text-[#2a3439]" defaultValue={defaults.currentValue} name="current_value" step="0.01" type="number" />
            </label>
          </div>
        </section>
      </div>

      <div className="space-y-8 lg:col-span-4">
        <section className="rounded-[28px] bg-[#5d6980] p-8 text-white shadow-[0_24px_60px_rgba(84,95,115,0.22)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Property Status</h2>
            <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              API Backed
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {statusOptions.map((status) => (
              <label
                key={status}
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${
                  selectedStatus === status ? "border-white/50 bg-white/12" : "border-transparent bg-white/8"
                }`}
              >
                <div>
                  <p className="text-lg font-semibold capitalize">{status}</p>
                  <p className="text-sm text-white/70">
                    {status === "active"
                      ? "Visible and operational."
                      : status === "inactive"
                        ? "Kept in portfolio without active use."
                        : status === "maintenance"
                          ? "Temporarily unavailable for normal activity."
                          : "Archived from active portfolio use."}
                  </p>
                </div>
                <input
                  className="h-5 w-5 accent-[#b8f9de]"
                  checked={selectedStatus === status}
                  name="status"
                  onChange={() => setSelectedStatus(status)}
                  type="radio"
                  value={status}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#717c82]">Media Preview</p>
          <div className="mt-6 overflow-hidden rounded-2xl bg-[#d9e4ea]">
            <img
              alt="Property preview"
              className="h-56 w-full object-cover"
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            />
          </div>
          <p className="mt-4 text-sm text-[#566166]">
            The current backend spec does not expose property media upload yet, so this block stays as a visual preview only.
          </p>
        </section>

        <section className="rounded-[28px] bg-[#e8eff3] p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#717c82]">Performance Snapshot</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#566166]">Occupied Units</span>
              <span className="font-bold text-[#2a3439]">{propertyStats?.occupiedUnits ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#566166]">Occupancy Rate</span>
              <span className="font-bold text-[#2a3439]">
                {propertyStats?.occupancyRate != null ? `${Math.round(propertyStats.occupancyRate)}%` : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#566166]">Monthly Revenue</span>
              <span className="font-bold text-[#2a3439]">
                {propertyStats?.monthlyRevenue != null
                  ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(propertyStats.monthlyRevenue)
                  : "N/A"}
              </span>
            </div>
          </div>
        </section>

        {state.error ? <p className="rounded-2xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{state.error}</p> : null}
      </div>

      <div className="lg:col-span-12">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-[#566166]" href="/landlord/properties">
            Discard
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-lg bg-[#545f73] px-6 py-3 text-sm font-semibold text-[#f6f7ff] shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending}
            type="submit"
          >
            {pending ? "Saving..." : mode === "create" ? "Save Property" : "Save Configuration"}
          </button>
        </div>
      </div>
    </form>
  );
}

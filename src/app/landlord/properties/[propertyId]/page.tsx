import Link from "next/link";
import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton, actionButtonClassName } from "@/components/shared/StitchPrimitives";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, unitStatusLabel } from "@/lib/format";
import { getLandlordPaymentsVm, getLandlordPropertyDetailVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

interface PageProps {
  params: Promise<{ propertyId: string }>;
}
export default async function PropertyDetailPage({ params }: PageProps) {
  const { propertyId } = await params;
  const detail = await getLandlordPropertyDetailVm(propertyId);
  const paymentVm = await getLandlordPaymentsVm();

  if (!detail) {
    notFound();
  }
  const { property, units, details, meta } = detail;
  const facts = [
    ["Property Type", details.propertyType],
    ["Location", [property.city, details.state, details.country].filter(Boolean).join(", ")],
    ["Status", details.status],
    ["Postal Code", details.postalCode],
    ["Year Built", details.yearBuilt ? String(details.yearBuilt) : "Not provided"],
    ["Square Footage", details.squareFootage ? `${details.squareFootage.toLocaleString()} sq ft` : "Not provided"],
  ];
  const financialFacts = [
    ["Current Value", details.currentValue != null ? formatMoney(details.currentValue) : "Not provided"],
    ["Purchase Price", details.purchasePrice != null ? formatMoney(details.purchasePrice) : "Not provided"],
    ["Occupancy Rate", details.occupancyRate != null ? `${Math.round(details.occupancyRate)}%` : "Not provided"],
    ["Vacant Units", details.vacantUnits != null ? String(details.vacantUnits) : "Not provided"],
  ];

  return (
    <LandlordPageFrame currentPath="/landlord/properties">
      <DataStateNotice meta={meta} />
      <PageIntro
        title={property.name}
        description={`${property.address}, ${property.city}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              className={actionButtonClassName({ variant: "secondary" })}
              href={`/landlord/properties/${property.id}/edit`}
            >
              <MaterialIcon name="edit" className="text-[18px]" />
              Edit Property
            </Link>
            <ActionButton>
              <MaterialIcon name="add" className="text-[18px]" />
              Add Unit
            </ActionButton>
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="overflow-hidden">
            <div className="relative h-72">
              <img
                alt={property.name}
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <StatusBadge status={details.status} label={details.status} />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2a3439]">Property Profile</h3>
              <p className="mt-3 text-sm leading-6 text-[#566166]">
                {details.description?.trim() || "No property description is available from the API for this asset yet."}
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#e8eff3] p-3 text-[#545f73]">
                    <MaterialIcon name="map" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#566166]">Address</p>
                    <p className="text-sm font-bold text-[#2a3439]">{property.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#e8eff3] p-3 text-[#545f73]">
                    <MaterialIcon name="apartment" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#566166]">Inventory</p>
                    <p className="text-sm font-bold text-[#2a3439]">{property.totalUnits} Total Units</p>
                  </div>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[#f0f4f7] p-6">
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#717c82]">Property Facts</h3>
            <div className="grid grid-cols-2 gap-4">
              {facts.map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#717c82]">{label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#2a3439]">{value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e8eff3] px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-[#2a3439]">Unit Inventory</h3>
                <p className="text-sm text-[#566166]">{property.occupiedUnits}/{property.totalUnits} occupied across this property.</p>
              </div>
              <Link className="text-sm font-semibold text-[#545f73]" href="/landlord/units">
                Open unit overview
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-[#f0f4f7] text-left">
                  <tr>
                    {["Unit", "Status", "Tenant", "Next Payment", "Action"].map((label) => (
                      <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit) => {
                    const nextPayment = paymentVm.payments.find((payment) => payment.unitId === unit.id && payment.status === "pending");
                    return (
                      <tr key={unit.id} className="border-t border-[#e8eff3]">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#2a3439]">{unit.label}</p>
                          <p className="text-xs text-[#566166]">{unit.type}</p>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
                        </td>
                        <td className="px-6 py-4 text-sm text-[#2a3439]">{unit.tenantName ?? <span className="italic text-[#9a9d9f]">No Active Lease</span>}</td>
                        <td className="px-6 py-4 text-sm text-[#566166]">{nextPayment ? formatDate(nextPayment.dueDate) : "No due payment"}</td>
                        <td className="px-6 py-4">
                          <Link className="text-sm font-semibold text-[#545f73]" href={`/landlord/units/${unit.id}`}>
                            Configure
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h3 className="text-lg font-bold text-[#2a3439]">Revenue Panel</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Monthly Revenue</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(property.monthlyRevenue)}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Occupied Units</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{property.occupiedUnits}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Average Rate</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(Math.round(property.monthlyRevenue / property.totalUnits))}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Occupancy</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">
                  {details.occupancyRate != null ? `${Math.round(details.occupancyRate)}%` : "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {financialFacts.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#f0f4f7] p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">{label}</p>
                  <p className="mt-2 text-xl font-bold text-[#2a3439]">{value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}

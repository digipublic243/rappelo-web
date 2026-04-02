import Link from "next/link";
import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, actionButtonClassName } from "@/components/shared/StitchPrimitives";
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
  const heroImage =
    details.mediaGallery?.[0] ??
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80";
  const featureTags = [...(details.amenities ?? []), ...(details.facilities ?? [])].slice(0, 6);
  const facts = [
    ["Type de bien", details.propertyType],
    ["Localisation", [property.city, details.country].filter(Boolean).join(", ")],
    ["Statut", details.status],
    ["Adresse", details.addressContent],
    ["Année de construction", details.yearBuilt ? String(details.yearBuilt) : "Non renseignée"],
    ["Superficie", details.squareFootage ? `${details.squareFootage.toLocaleString()} pieds²` : "Non renseignée"],
    ["Niveau de marque", details.brandTier ?? "Non renseigné"],
  ];
  const financialFacts = [
    ["Total des loyers mensuels", details.monthlyRentTotal != null ? formatMoney(details.monthlyRentTotal) : "Non renseigné"],
    ["Valeur actuelle", details.currentValue != null ? formatMoney(details.currentValue) : "Non renseignée"],
    ["Prix d’achat", details.purchasePrice != null ? formatMoney(details.purchasePrice) : "Non renseigné"],
    ["Taux d’occupation", details.occupancyRate != null ? `${Math.round(details.occupancyRate)}%` : "Non renseigné"],
    ["Unités vacantes", details.vacantUnits != null ? String(details.vacantUnits) : "Non renseigné"],
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
              Modifier le bien
            </Link>
            <Link className={actionButtonClassName({ variant: "primary" })} href="/landlord/units/new">
              <MaterialIcon name="add" className="text-[18px]" />
              Ajouter une unité
            </Link>
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
                src={heroImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <StatusBadge status={details.status} label={details.status} />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#2a3439]">Profil du bien</h3>
              <p className="mt-3 text-sm leading-6 text-[#566166]">
                {details.description?.trim() || "Aucune description de ce bien n’est encore disponible via l’API."}
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#e8eff3] p-3 text-[#545f73]">
                    <MaterialIcon name="map" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#566166]">Adresse</p>
                    <p className="text-sm font-bold text-[#2a3439]">{property.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#e8eff3] p-3 text-[#545f73]">
                    <MaterialIcon name="apartment" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#566166]">Inventaire</p>
                    <p className="text-sm font-bold text-[#2a3439]">{property.totalUnits} unités au total</p>
                  </div>
                </div>
              </div>
              {featureTags.length > 0 ? (
                <div className="mt-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#717c82]">Équipements et services</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {featureTags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#f0f4f7] px-3 py-2 text-xs font-semibold text-[#566166]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-[#f0f4f7] p-6">
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-[#717c82]">Informations du bien</h3>
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
                <h3 className="text-lg font-bold text-[#2a3439]">Inventaire des unités</h3>
                <p className="text-sm text-[#566166]">{property.occupiedUnits}/{property.totalUnits} occupées dans ce bien.</p>
              </div>
              <Link className="text-sm font-semibold text-[#545f73]" href="/landlord/units">
                Ouvrir la vue des unités
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-[#f0f4f7] text-left">
                  <tr>
                    {["Unité", "Statut", "Locataire", "Prochain paiement", "Action"].map((label) => (
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
                        <td className="px-6 py-4 text-sm text-[#2a3439]">{unit.tenantName ?? <span className="italic text-[#9a9d9f]">Aucun bail actif</span>}</td>
                        <td className="px-6 py-4 text-sm text-[#566166]">{nextPayment ? formatDate(nextPayment.dueDate) : "Aucun paiement dû"}</td>
                        <td className="px-6 py-4">
                          <Link className="text-sm font-semibold text-[#545f73]" href={`/landlord/units/${unit.id}`}>
                            Configurer
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
            <h3 className="text-lg font-bold text-[#2a3439]">Panneau des revenus</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Revenu mensuel</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(property.monthlyRevenue)}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Unités occupées</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{property.occupiedUnits}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Tarif moyen</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(Math.round(property.monthlyRevenue / property.totalUnits))}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Occupation</p>
                <p className="mt-2 text-3xl font-black text-[#2a3439]">
                  {details.occupancyRate != null ? `${Math.round(details.occupancyRate)}%` : "N/D"}
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

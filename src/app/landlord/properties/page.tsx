import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, FilterChip, actionButtonClassName } from "@/components/shared/StitchPrimitives";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { formatMoney } from "@/lib/format";
import { getLandlordPropertiesData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

const propertyImages = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
];

export default async function LandlordPropertiesPage() {
  const { properties, meta } = await getLandlordPropertiesData();

  return (
    <LandlordPageFrame currentPath="/landlord/properties">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Biens"
        description="Vue d’ensemble de vos actifs immobiliers, de leur occupation et de leur performance financière."
        action={
          <Link className={actionButtonClassName({})} href="/landlord/properties/new">
            <MaterialIcon name="add" className="text-[18px]" />
            Ajouter un bien
          </Link>
        }
      />

      <section className="flex flex-wrap items-center gap-4 rounded-xl bg-[var(--secondary-4)] p-4">
        <FilterChip label="Statut :" value="Tous les biens" />
        <FilterChip label="Ville :" value="Toutes les villes" />
        <FilterChip label="Type :" value="Commercial / Résidentiel" />
        <p className="ml-auto text-sm font-medium text-[var(--secondary-3)]">Affichage de {properties.length} bien(s) sur {properties.length}</p>
      </section>

      <div className="grid gap-6">
        {properties.map((property, index) => {
          const occupancyRate = Math.round((property.occupiedUnits / property.totalUnits) * 100);
          return (
            <Link key={property.id} href={`/landlord/properties/${property.id}`}>
              <SurfaceCard className="group overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="h-56 overflow-hidden md:h-auto md:w-72">
                    <img alt={property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src={propertyImages[index % propertyImages.length]} />
                  </div>
                  <div className="grid flex-1 gap-6 p-6 lg:grid-cols-4 lg:items-center">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{property.name}</h3>
                      <p className="mt-2 flex items-center gap-1 text-sm text-secondary-2">
                        <MaterialIcon name="location_on" className="text-[16px]" />
                        {property.address}, {property.city}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--secondary-3)]">Inventaire</p>
                      <p className="text-2xl font-bold text-foreground">{property.totalUnits} unités</p>
                      <p className="text-xs font-semibold text-success">{property.occupiedUnits} occupées</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[var(--secondary-3)]">
                        <span>Occupation</span>
                        <span className="text-foreground">{occupancyRate}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-success/20" style={{ width: `${occupancyRate}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1 text-left lg:text-right">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--secondary-3)]">Revenu mensuel</p>
                      <p className="text-3xl font-bold tracking-tight text-[var(--primary)]">{formatMoney(property.monthlyRevenue)}</p>
                      <span className="inline-flex rounded-full bg-success/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-success">
                        Payé
                      </span>
                    </div>
                  </div>
                </div>
              </SurfaceCard>
            </Link>
          );
        })}
      </div>

      <SurfaceCard className="rounded-[28px] bg-[linear-gradient(135deg,var(--primary),var(--primary-2))] p-8 text-white">
        <h2 className="text-2xl font-bold tracking-tight">Vous agrandissez votre patrimoine ?</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Conservez la même structure Stitch pour les futurs écrans d’acquisition et d’onboarding tout en gardant la cohérence du portefeuille actuel.
        </p>
      </SurfaceCard>
    </LandlordPageFrame>
  );
}

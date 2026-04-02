import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { actionButtonClassName, SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordUnitsData } from "@/features/landlord/api";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default async function UnitOverviewPage() {
  const { units, meta } = await getLandlordUnitsData();

  return (
    <LandlordPageFrame currentPath="/landlord/units">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Inventaire"
        title="Vue des unités"
        description="Disponibilité, cadence et préparation locative de toutes les unités du patrimoine."
        action={
          <Link className={actionButtonClassName({ variant: "primary" })} href="/landlord/units/new">
            <MaterialIcon name="add" className="text-[18px]" />
            Ajouter une unité
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <SurfaceCard key={unit.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{unit.label}</h2>
                <p className="text-sm text-secondary-2">{unit.type}</p>
              </div>
              <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
            </div>
            <p className="mt-6 text-3xl font-black tracking-tight text-foreground">{formatMoney(unit.price)}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary-3)]">{formatCadence(unit.pricingCadence)}</p>
            <div className="mt-4 rounded-lg bg-[var(--secondary-4)] px-4 py-3 text-sm text-secondary-2">
              Dépôt {unit.depositEnabled ? "activé" : "désactivé"} • {unit.tenantName ?? "Contexte vacant"}
            </div>
            <Link className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)]" href={`/landlord/units/${unit.id}`}>
              Configurer l’unité
            </Link>
          </SurfaceCard>
        ))}
      </div>
    </LandlordPageFrame>
  );
}

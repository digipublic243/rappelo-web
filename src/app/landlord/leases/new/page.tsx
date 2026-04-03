import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { LeaseEditorForm } from "@/features/landlord/LeaseEditorForm";
import { getLandlordLeaseCreationData } from "@/features/landlord/api";
import { createLeaseAction } from "@/features/landlord/actions";
import { initialLeaseEditorActionState } from "@/features/landlord/lease-editor-state";
import { formatMoney } from "@/lib/format";

function todayAsInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function addOneYear(dateValue: string) {
  const date = new Date(dateValue);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export default async function NewLeasePage() {
  const { tenants, units, meta } = await getLandlordLeaseCreationData();
  const startDate = todayAsInputValue();
  const firstUnit = units[0];

  return (
    <LandlordPageFrame currentPath="/landlord/leases">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Baux"
        backHref="/landlord/leases"
        backLabel="Retour aux baux"
        title="Créer un bail"
        description="Préparez un contrat bailleur-locataire à partir des unités et locataires déjà gérés dans le portefeuille."
      />

      <LeaseEditorForm
        action={createLeaseAction}
        defaults={{
          tenantId: tenants[0]?.id ?? "",
          unitId: firstUnit?.id ?? "",
          startDate,
          endDate: addOneYear(startDate),
          moveInDate: startDate,
          paymentFrequency: "monthly",
          monthlyRent:
            firstUnit != null && Number.isFinite(firstUnit.price)
              ? String(firstUnit.price)
              : "",
          securityDeposit: "",
          securityDepositMonthsTaken: "",
          notes: "",
        }}
        initialState={initialLeaseEditorActionState}
        tenants={tenants.map((tenant) => ({
          value: tenant.id,
          label: `${tenant.fullName} • ${tenant.phone}`,
        }))}
        units={units.map((unit) => ({
          value: unit.id,
          label: `${unit.label} • ${formatMoney(unit.price, unit.currency)} • ${unit.status}`,
        }))}
      />
    </LandlordPageFrame>
  );
}

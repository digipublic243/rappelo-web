import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { UnitEditorForm } from "@/features/landlord/UnitEditorForm";
import { createUnitAction } from "@/features/landlord/actions";
import { initialUnitEditorActionState } from "@/features/landlord/unit-editor-state";
import { getLandlordPropertiesData } from "@/features/landlord/api";

export default async function NewUnitPage() {
  const { properties } = await getLandlordPropertiesData();
  const propertyOptions = properties.map((property) => ({
    value: property.id,
    label: `${property.name} — ${property.address}, ${property.city}`,
    currency: property.currency,
  }));

  return (
    <LandlordPageFrame currentPath="/landlord/units">
      <PageIntro
        eyebrow="Inventaire"
        backHref="/landlord/units"
        backLabel="Retour aux unités"
        title="Créer une unité"
        description="Ajoutez une nouvelle unité locative au patrimoine avec le même workflow structuré que le reste de l’espace bailleur."
      />

      <UnitEditorForm
        action={createUnitAction}
        defaults={{
          propertyId: propertyOptions[0]?.value ?? "",
          unitNumber: "",
          unitType: "studio",
          rent: "",
          currency: "USD",
          rentalPeriodicity: "mensuel",
          description: "",
          isFurnished: false,
        }}
        initialState={initialUnitEditorActionState}
        propertyOptions={propertyOptions}
      />
    </LandlordPageFrame>
  );
}

import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { PropertyEditorForm } from "@/features/landlord/PropertyEditorForm";
import { createPropertyAction } from "@/features/landlord/actions";
import { initialPropertyEditorActionState } from "@/features/landlord/property-editor-state";

export default function NewPropertyPage() {
  return (
    <LandlordPageFrame currentPath="/landlord/properties">
      <PageIntro
        eyebrow="Patrimoine"
        title="Créer un bien"
        description="Ajoutez un nouvel actif au patrimoine avec la même expérience structurée que l’écran de configuration."
      />

      <PropertyEditorForm
        action={createPropertyAction}
        defaults={{
          name: "",
          propertyType: "apartment",
          status: "active",
          addressContent: "",
          city: "kinshasa",
          country: "RD CONGO",
          description: "",
          totalUnits: "1",
          isActive: true,
        }}
        initialState={initialPropertyEditorActionState}
        mode="create"
        propertyStats={{ occupiedUnits: 0, occupancyRate: 0, monthlyRevenue: 0 }}
      />
    </LandlordPageFrame>
  );
}

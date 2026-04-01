import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { PropertyEditorForm } from "@/features/landlord/PropertyEditorForm";
import { createPropertyAction } from "@/features/landlord/actions";
import { initialPropertyEditorActionState } from "@/features/landlord/property-editor-state";

export default function NewPropertyPage() {
  return (
    <LandlordPageFrame currentPath="/landlord/properties">
      <PageIntro
        eyebrow="Portfolio"
        title="Create Property"
        description="Add a new asset to the portfolio with the same structured editing experience used for property configuration."
      />

      <PropertyEditorForm
        action={createPropertyAction}
        defaults={{
          name: "",
          propertyType: "apartment",
          status: "active",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          description: "",
          yearBuilt: "",
          totalUnits: "1",
          squareFootage: "",
          purchasePrice: "",
          currentValue: "",
          isActive: true,
        }}
        initialState={initialPropertyEditorActionState}
        mode="create"
        propertyStats={{ occupiedUnits: 0, occupancyRate: 0, monthlyRevenue: 0 }}
      />
    </LandlordPageFrame>
  );
}

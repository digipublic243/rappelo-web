import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { PropertyEditorForm } from "@/features/landlord/PropertyEditorForm";
import { updatePropertyAction } from "@/features/landlord/actions";
import { initialPropertyEditorActionState } from "@/features/landlord/property-editor-state";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordPropertyDetailVm } from "@/features/landlord/api";

interface PageProps {
  params: Promise<{ propertyId: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { propertyId } = await params;
  const detail = await getLandlordPropertyDetailVm(propertyId);

  if (!detail) {
    notFound();
  }

  const { property, details, meta } = detail;

  return (
    <LandlordPageFrame currentPath="/landlord/properties">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Portfolio"
        title={`${property.name} Configuration`}
        description="Review property metadata, valuation, and visibility using the same editorial configuration layout."
      />

      <PropertyEditorForm
        action={updatePropertyAction}
        defaults={{
          propertyId: property.id,
          name: property.name,
          propertyType: details.propertyType,
          status: details.status,
          addressLine1: property.address,
          addressLine2: details.addressLine2 ?? "",
          city: property.city,
          state: details.state,
          postalCode: details.postalCode,
          country: details.country,
          description: details.description ?? "",
          yearBuilt: details.yearBuilt != null ? String(details.yearBuilt) : "",
          totalUnits: String(property.totalUnits),
          squareFootage: details.squareFootage != null ? String(details.squareFootage) : "",
          purchasePrice: details.purchasePrice != null ? String(details.purchasePrice) : "",
          currentValue: details.currentValue != null ? String(details.currentValue) : "",
          isActive: details.status === "active",
        }}
        initialState={initialPropertyEditorActionState}
        mode="edit"
        propertyStats={{
          occupiedUnits: property.occupiedUnits,
          occupancyRate: details.occupancyRate,
          monthlyRevenue: property.monthlyRevenue,
        }}
      />
    </LandlordPageFrame>
  );
}

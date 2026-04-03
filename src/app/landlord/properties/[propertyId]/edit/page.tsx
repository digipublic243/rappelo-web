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
        eyebrow="Patrimoine"
        backHref={`/landlord/properties/${property.id}`}
        backLabel="Retour au bien"
        title={`Configuration de ${property.name}`}
        description="Revoyez les métadonnées, la valorisation et la visibilité du bien dans la même mise en page éditoriale."
      />

      <PropertyEditorForm
        action={updatePropertyAction}
        defaults={{
          propertyId: property.id,
          name: property.name,
          propertyType: details.propertyType,
          status: details.status,
          addressContent: details.addressContent,
          city: property.city,
          country: details.country,
          description: details.description ?? "",
          totalUnits: String(property.totalUnits),
          currency: details.currency ?? property.currency ?? "",
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

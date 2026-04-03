import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { TenantEditorForm } from "@/features/landlord/TenantEditorForm";
import { createTenantAction } from "@/features/landlord/actions";
import { initialTenantEditorActionState } from "@/features/landlord/tenant-editor-state";

export default function NewTenantPage() {
  return (
    <LandlordPageFrame currentPath="/landlord/tenants">
      <PageIntro
        eyebrow="Locataires"
        backHref="/landlord/tenants"
        backLabel="Retour aux locataires"
        title="Ajouter un locataire"
        description="Créez un profil locataire. Le backend génère automatiquement le compte tenant associé."
      />

      <TenantEditorForm
        action={createTenantAction}
        initialState={initialTenantEditorActionState}
      />
    </LandlordPageFrame>
  );
}

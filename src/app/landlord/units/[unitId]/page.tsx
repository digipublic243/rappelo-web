import { notFound } from "next/navigation";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { UnitConfigurationForm } from "@/features/landlord/UnitConfigurationForm";
import { getLandlordUnitDetailVm } from "@/features/landlord/api";
import { initialUnitEditorActionState } from "@/features/landlord/unit-editor-state";
import { updateUnitAction } from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ unitId: string }>;
}

export default async function UnitConfigurationPage({ params }: PageProps) {
  const { unitId } = await params;
  const detail = await getLandlordUnitDetailVm(unitId);

  if (!detail) {
    notFound();
  }

  const boundUpdateAction = updateUnitAction.bind(null, unitId);

  return (
    <LandlordPageFrame currentPath="/landlord/units">
      <DataStateNotice meta={detail.meta} />
      <UnitConfigurationForm
        action={boundUpdateAction}
        detail={detail}
        initialState={initialUnitEditorActionState}
      />
    </LandlordPageFrame>
  );
}

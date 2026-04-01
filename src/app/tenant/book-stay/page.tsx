import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTenantBookStayData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { TenantBookingRequestForm } from "@/features/tenant/TenantBookingRequestForm";

export default async function BookStayPage() {
  const { units, meta } = await getTenantBookStayData();

  return (
    <TenantPageFrame currentPath="/tenant/book-stay">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Property"
        title="Select your luxury unit"
        description="Booking flow fed by live available units, with lease terms and summary kept separate from the post-booking lease stage."
      />

      {units.length === 0 ? (
        <EmptyState
          title="No units available right now"
          description="Available units will appear here as soon as the property API exposes open inventory for booking."
        />
      ) : (
        <TenantBookingRequestForm units={units} />
      )}
    </TenantPageFrame>
  );
}

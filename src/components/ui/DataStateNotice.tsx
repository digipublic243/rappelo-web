import type { DataMeta } from "@/types/view-models";

interface DataStateNoticeProps {
  meta: DataMeta;
}

export function DataStateNotice({ meta }: DataStateNoticeProps) {
  if (meta.source === "api" && !meta.warning) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--primary-3)] bg-[var(--secondary-4)] px-4 py-3 text-sm text-secondary-2">
      {meta.warning ?? "Des données de secours sont utilisées tant que le point d’accès backend requis n’est pas disponible."}
    </div>
  );
}

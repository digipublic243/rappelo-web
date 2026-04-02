import type { DataMeta } from "@/types/view-models";

interface DataStateNoticeProps {
  meta: DataMeta;
}

export function DataStateNotice({ meta }: DataStateNoticeProps) {
  if (meta.source === "api" && !meta.warning) {
    return null;
  }

  return (
    <div className="rounded-xl border border-[var(--primary-soft)] bg-[var(--surface-low)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
      {meta.warning ?? "Des données de secours sont utilisées tant que le point d’accès backend requis n’est pas disponible."}
    </div>
  );
}

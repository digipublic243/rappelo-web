import { STATUS_TONE } from "@/constants/statuses";
import { cn } from "@/lib/cn";

const toneClasses = {
  neutral: "bg-[var(--secondary)] text-[var(--muted-foreground)]",
  success: "bg-[var(--success-bright)] text-[var(--success)]",
  warning: "bg-[var(--info-soft)] text-[var(--info-foreground)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
  info: "bg-[var(--primary-soft)] text-[var(--secondary-foreground)]",
};

interface StatusBadgeProps {
  status: string;
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const tone = STATUS_TONE[status] ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}

import { STATUS_TONE } from "@/constants/statuses";
import { cn } from "@/lib/cn";

const toneClasses = {
  neutral: "bg-secondary text-secondary-2",
  success: "bg-success/20 text-success",
  warning: "bg-[var(--primary-3)] text-[var(--primary-2)]",
  danger: "bg-[color-mix(in_srgb,var(--danger) 14%,var(--background))] text-[var(--danger)]",
  info: "bg-[var(--primary-3)] text-secondary-2",
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

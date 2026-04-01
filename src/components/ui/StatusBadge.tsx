import { STATUS_TONE } from "@/constants/statuses";
import { cn } from "@/lib/cn";

const toneClasses = {
  neutral: "bg-[#e8eff3] text-[#566166]",
  success: "bg-[#b8f9de] text-[#22614d]",
  warning: "bg-[#d3e4fe] text-[#435368]",
  danger: "bg-[#fe8983]/30 text-[#752121]",
  info: "bg-[#d8e3fb] text-[#475266]",
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

import { cn } from "@/lib/cn";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return <section className={cn("rounded-xl bg-white shadow-sm", className)}>{children}</section>;
}

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function actionButtonClassName({
  variant = "primary",
  className,
}: {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all",
    variant === "primary" && "bg-[#545f73] text-[#f6f7ff] shadow-sm hover:brightness-110",
    variant === "secondary" && "bg-[#d8e3fb] text-[#475266] hover:opacity-90",
    variant === "ghost" && "border border-[#a9b4b9]/40 bg-white text-[#545f73] hover:bg-[#f0f4f7]",
    className,
  );
}

export function ActionButton({ children, variant = "primary", className }: ActionButtonProps) {
  return (
    <button
      className={actionButtonClassName({ variant, className })}
      type="button"
    >
      {children}
    </button>
  );
}

interface FilterChipProps {
  label: string;
  value: string;
  className?: string;
}

export function FilterChip({ label, value, className }: FilterChipProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-[#a9b4b9]/10 bg-white px-4 py-2 text-sm", className)}>
      <span className="text-[#717c82]">{label}</span>
      <span className="font-semibold text-[#545f73]">{value}</span>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string;
  accent?: string;
  hint?: string;
}

export function StatTile({ label, value, accent = "#545f73", hint }: StatTileProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-[#566166]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#2a3439]">{value}</p>
      {hint ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

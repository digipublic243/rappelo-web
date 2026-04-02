import { cn } from "@/lib/cn";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function actionButtonClassName({
  variant = "primary",
  className,
}: {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-5)] py-[var(--space-3)] text-sm font-semibold transition-all",
    variant === "primary" &&
      "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-xs)] hover:brightness-110",
    variant === "secondary" &&
      "bg-[var(--primary-soft)] text-[var(--primary-soft-foreground)] hover:opacity-90",
    variant === "ghost" &&
      "border border-[color:color-mix(in_srgb,var(--outline-strong)_40%,transparent)] bg-[var(--surface-card)] text-[var(--primary)] hover:bg-[var(--surface-low)]",
    className,
  );
}

export function ActionButton({ children, variant = "primary", className, type = "button", disabled }: ActionButtonProps) {
  return (
    <button
      className={actionButtonClassName({ variant, className })}
      disabled={disabled}
      type={type}
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
    <div
      className={cn(
        "flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:color-mix(in_srgb,var(--outline-soft)_60%,transparent)] bg-[var(--surface-card)] px-[var(--space-4)] py-[var(--space-2)] text-sm",
        className,
      )}
    >
      <span className="text-[var(--subtle-foreground)]">{label}</span>
      <span className="font-semibold text-[var(--primary)]">{value}</span>
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: string;
  accent?: string;
  hint?: string;
}

export function StatTile({ label, value, accent = "var(--primary)", hint }: StatTileProps) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-card)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">{value}</p>
      {hint ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

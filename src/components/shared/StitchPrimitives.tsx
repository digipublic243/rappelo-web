import { cn } from "@/lib/cn";
import { Button, buttonClassName, type ButtonVariant } from "@/components/ui/Button";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SurfaceCard({ children, className }: SurfaceCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--secondary-4)] shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface ActionButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function actionButtonClassName({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return buttonClassName({ variant, size: "md", className });
}

export function ActionButton({
  children,
  variant = "primary",
  className,
  type = "button",
  disabled,
}: ActionButtonProps) {
  return (
    <Button
      className={className}
      disabled={disabled}
      type={type}
      variant={variant}
    >
      {children}
    </Button>
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
        "flex items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] border border-[color:color-mix(in_srgb,var(--secondary-1)_60%,transparent)] bg-[var(--secondary-4)] px-[var(--space-4)] py-[var(--space-2)] text-sm",
        className,
      )}
    >
      <span className="text-[var(--secondary-3)]">{label}</span>
      <span className="font-semibold text-primary">{value}</span>
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
    <div className="rounded-[var(--radius-md)] bg-[var(--secondary-4)] p-[var(--space-6)] shadow-[var(--shadow-sm)]">
      <p className="text-sm font-medium text-secondary-2">{label}</p>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
      {hint ? (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

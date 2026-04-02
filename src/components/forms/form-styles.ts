import { cn } from "@/lib/cn";

export const formFieldInputClassName = cn(
  "w-full rounded-[var(--radius-lg)] border border-[var(--outline-soft)] bg-[var(--surface-card)] px-[var(--space-4)] py-[var(--space-3)] text-[var(--foreground)] outline-none transition-colors",
  "placeholder:text-[var(--placeholder)] focus:border-[var(--outline-strong)]",
);

export const formFieldMutedInputClassName = cn(
  "w-full rounded-[var(--radius-md)] border border-[var(--outline-soft)] bg-[var(--surface-low)] px-[var(--space-4)] py-[var(--space-3)] text-[var(--foreground)] outline-none transition-colors",
  "placeholder:text-[var(--placeholder)] focus:border-[var(--outline-strong)]",
);

export const formFieldLabelClassName =
  "block text-sm font-medium text-[var(--muted-foreground)]";

export const formHintClassName = "text-[11px] text-[var(--subtle-foreground)]";

export const formInlineErrorClassName =
  "rounded-[var(--radius-md)] border border-[var(--danger-border)] bg-[var(--danger-soft)] px-[var(--space-4)] py-[var(--space-3)] text-sm text-[var(--danger)]";

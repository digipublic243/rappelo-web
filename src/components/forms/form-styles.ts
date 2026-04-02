import { cn } from "@/lib/cn";

export const formFieldInputClassName = cn(
  "w-full rounded-[var(--radius-lg)] border border-[var(--secondary-1)] bg-[var(--secondary-4)] px-[var(--space-4)] py-[var(--space-3)] text-foreground outline-none transition-colors",
  "placeholder:text-[var(--secondary-3)] focus:border-[var(--secondary)]",
);

export const formFieldMutedInputClassName = cn(
  "w-full rounded-[var(--radius-md)] border border-[var(--secondary-1)] bg-[var(--secondary-4)] px-[var(--space-4)] py-[var(--space-3)] text-foreground outline-none transition-colors",
  "placeholder:text-[var(--secondary-3)] focus:border-[var(--secondary)]",
);

export const formFieldLabelClassName =
  "block text-sm font-medium text-secondary-2";

export const formHintClassName = "text-[11px] text-[var(--secondary-3)]";

export const formInlineErrorClassName =
  "rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-[color-mix(in_srgb,var(--danger) 14%,var(--background))] px-[var(--space-4)] py-[var(--space-3)] text-sm text-[var(--danger)]";

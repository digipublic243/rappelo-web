import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "subtle"
  | "unstyled";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-sm)] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-70",
    size === "sm" && "px-3 py-2 text-xs",
    size === "md" && "px-5 py-3 text-sm",
    size === "lg" && "px-6 py-4 text-base",
    size === "icon" && "h-10 w-10 rounded-full p-2",
    variant === "primary" &&
      "bg-[var(--primary)] text-[var(--primary-4)] shadow-[var(--shadow-xs)] hover:brightness-110",
    variant === "secondary" &&
      "bg-[var(--primary-3)] text-[var(--primary-2)] hover:opacity-90",
    variant === "ghost" &&
      "border border-[color:color-mix(in_srgb,var(--secondary)_40%,transparent)] bg-[var(--secondary-4)] text-[var(--primary)] hover:bg-[var(--secondary-4)]",
    variant === "subtle" &&
      "bg-[var(--secondary-4)] text-foreground shadow-none hover:bg-[var(--background)]",
    variant === "unstyled" && "rounded-none bg-transparent p-0 shadow-none",
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName({ variant, size, className })}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

import Link from "next/link";
import { cn } from "@/lib/cn";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { buttonClassName } from "@/components/ui/Button";

interface PageIntroProps {
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageIntro({
  eyebrow,
  backHref,
  backLabel = "Retour",
  title,
  description,
  action,
  className,
}: PageIntroProps) {
  return (
    <header className={cn("flex flex-col gap-[var(--space-6)] md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {backHref ? (
          <Link
            className={buttonClassName({
              variant: "ghost",
              size: "sm",
              className:
                "mb-[var(--space-3)] w-fit rounded-[var(--radius-lg)]",
            })}
            href={backHref}
          >
            <MaterialIcon name="arrow_back" size={16} />
            {backLabel}
          </Link>
        ) : null}
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary-2">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

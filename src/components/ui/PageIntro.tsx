import { cn } from "@/lib/cn";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageIntro({ eyebrow, title, description, action, className }: PageIntroProps) {
  return (
    <header className={cn("flex flex-col gap-[var(--space-6)] md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {eyebrow ? (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">{eyebrow}</p>
        ) : null}
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

interface ShellSectionProps {
  children: React.ReactNode;
}

export function ShellSection({ children }: ShellSectionProps) {
  return <section className="rounded-xl border border-[var(--secondary-1)] bg-background p-5 shadow-sm">{children}</section>;
}

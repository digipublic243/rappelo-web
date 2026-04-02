interface ShellSectionProps {
  children: React.ReactNode;
}

export function ShellSection({ children }: ShellSectionProps) {
  return <section className="rounded-xl border border-[var(--outline-soft)] bg-white p-5 shadow-sm">{children}</section>;
}

interface LoadingPanelProps {
  label: string;
}

export function LoadingPanel({ label }: LoadingPanelProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-background p-8">
      <p className="animate-pulse text-sm font-medium text-zinc-500">{label}</p>
      <div className="mt-4 h-2 w-1/3 rounded bg-zinc-200" />
      <div className="mt-2 h-2 w-2/3 rounded bg-zinc-200" />
    </div>
  );
}

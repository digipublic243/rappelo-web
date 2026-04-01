interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaLabel }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
      <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{description}</p>
      {ctaLabel ? (
        <button className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
}

interface TableColumn {
  key: string;
  label: string;
}

interface TableHeaderProps {
  columns: TableColumn[];
}

export function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="bg-foreground">
      <tr>
        {columns.map((column) => (
          <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-zinc-600">
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

import { cn } from "@/lib/cn";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
}

interface SvgIconProps {
  filled?: boolean;
  className?: string;
}

function SvgBase({
  children,
  className,
  filled = false,
}: {
  children: React.ReactNode;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("inline-block h-[1em] w-[1em] shrink-0", className)}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

const icons: Record<string, (props: SvgIconProps) => React.ReactNode> = {
  add: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </SvgBase>
  ),
  apartment: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15h.01" />
    </SvgBase>
  ),
  edit: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="M12 6l4 4" />
    </SvgBase>
  ),
  map: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </SvgBase>
  ),
  location_on: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </SvgBase>
  ),
  book_online: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" />
      <path d="m10 13 2 2 4-4" />
    </SvgBase>
  ),
  dashboard: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="5" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="11" width="7" height="9" rx="1.5" />
    </SvgBase>
  ),
  domain: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M3 21h18" />
      <path d="M5 21V9l7-4 7 4v12" />
      <path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" />
    </SvgBase>
  ),
  home: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V20h12V9.5" />
    </SvgBase>
  ),
  query_stats: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-8" />
      <path d="M4 19h16" />
    </SvgBase>
  ),
  account_balance_wallet: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M17 13h.01" />
      <path d="M6 7V5h10v2" />
    </SvgBase>
  ),
  apps: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" />
    </SvgBase>
  ),
  help: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.2-1.6 2.6" />
      <path d="M12 17h.01" />
    </SvgBase>
  ),
  notifications: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5" />
      <path d="M4 16h16" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </SvgBase>
  ),
  search: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </SvgBase>
  ),
  event_repeat: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" />
      <path d="M9 14h6" />
      <path d="m13 12 2 2-2 2" />
    </SvgBase>
  ),
  description: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </SvgBase>
  ),
  payments: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 15h4" />
    </SvgBase>
  ),
  group: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="9" cy="10" r="3" />
      <circle cx="16.5" cy="10.5" r="2.5" />
      <path d="M4.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M14 19a3.5 3.5 0 0 1 7 0" />
    </SvgBase>
  ),
  credit_card: ({ filled }) => (
    <SvgBase filled={filled}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </SvgBase>
  ),
  account_circle: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </SvgBase>
  ),
  hotel_class: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="m12 4 2 4 4.5.6-3.2 3.1.8 4.3-4.1-2.2-4.1 2.2.8-4.3L5.5 8.6 10 8l2-4Z" />
    </SvgBase>
  ),
  pending_actions: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </SvgBase>
  ),
  history_edu: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4 6h11l5 5v7a2 2 0 0 1-2 2H4z" />
      <path d="M15 6v5h5" />
      <path d="M8 15c1.2-1.7 2.7-2.5 4.5-2.5S15.8 13.3 17 15" />
    </SvgBase>
  ),
  add_home: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4 11 12 5l6 4.5" />
      <path d="M6 10.5V19h12v-8.5" />
      <path d="M19 5v6M16 8h6" />
    </SvgBase>
  ),
  wallet: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4 8h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4z" />
      <path d="M4 8V6a2 2 0 0 1 2-2h10" />
      <path d="M16 13h.01" />
    </SvgBase>
  ),
  fitness_center: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M3 10v4M6 9v6M18 9v6M21 10v4" />
      <path d="M6 12h12" />
    </SvgBase>
  ),
  local_parking: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M8 20V4h5a4 4 0 0 1 0 8H8" />
    </SvgBase>
  ),
  wifi: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M4.5 9a11 11 0 0 1 15 0" />
      <path d="M7.5 12a7 7 0 0 1 9 0" />
      <path d="M10.5 15a3 3 0 0 1 3 0" />
      <path d="M12 18h.01" />
    </SvgBase>
  ),
  nest_eco_leaf: ({ filled }) => (
    <SvgBase filled={filled}>
      <path d="M18 5c-6 .5-10 4.2-10 9.4A4.6 4.6 0 0 0 12.7 19C18 19 19 13.7 18 5Z" />
      <path d="M9 15c2-2 4.5-3.6 7.5-4.8" />
    </SvgBase>
  ),
  settings: ({ filled }) => (
    <SvgBase filled={filled}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.5 3h5l.5-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" />
    </SvgBase>
  ),
};

export function MaterialIcon({ name, className, filled = false }: MaterialIconProps) {
  const Icon = icons[name];

  if (Icon) {
    return <>{Icon({ filled, className })}</>;
  }

  return (
    <SvgBase className={className} filled={filled}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </SvgBase>
  );
}

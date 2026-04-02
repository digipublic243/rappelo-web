import { cn } from "@/lib/cn";
import type { IconType } from "react-icons";
import {
  MdAdd,
  MdApartment,
  MdApps,
  MdBookOnline,
  MdCreditCard,
  MdDashboard,
  MdDescription,
  MdDomain,
  MdEdit,
  MdEco,
  MdEventRepeat,
  MdFitnessCenter,
  MdGroup,
  MdHelp,
  MdHistoryEdu,
  MdHome,
  MdHotelClass,
  MdLocationOn,
  MdLogout,
  MdMap,
  MdNotifications,
  MdOutlineAccountBalanceWallet,
  MdOutlineAccountCircle,
  MdOutlineAddHome,
  MdOutlineApartment,
  MdOutlineApps,
  MdOutlineBookOnline,
  MdOutlineCreditCard,
  MdOutlineDashboard,
  MdOutlineDescription,
  MdOutlineDomain,
  MdOutlineEdit,
  MdOutlineEco,
  MdOutlineEventRepeat,
  MdOutlineFitnessCenter,
  MdOutlineGroup,
  MdOutlineHelp,
  MdOutlineHistoryEdu,
  MdOutlineHome,
  MdOutlineHotelClass,
  MdOutlineLocationOn,
  MdOutlineLogout,
  MdOutlineMap,
  MdOutlineNotifications,
  MdOutlinePendingActions,
  MdOutlinePayments,
  MdOutlineQueryStats,
  MdOutlineSearch,
  MdOutlineSettings,
  MdOutlineWallet,
  MdOutlineWifi,
  MdPendingActions,
  MdPayments,
  MdQueryStats,
  MdSearch,
  MdSettings,
  MdWallet,
  MdWifi,
} from "react-icons/md";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number | string;
}

interface IconEntry {
  outline: IconType;
  filled?: IconType;
}

const icons: Record<string, IconEntry> = {
  add: { outline: MdAdd, filled: MdAdd },
  apartment: { outline: MdOutlineApartment, filled: MdApartment },
  edit: { outline: MdOutlineEdit, filled: MdEdit },
  map: { outline: MdOutlineMap, filled: MdMap },
  location_on: { outline: MdOutlineLocationOn, filled: MdLocationOn },
  book_online: { outline: MdOutlineBookOnline, filled: MdBookOnline },
  dashboard: { outline: MdOutlineDashboard, filled: MdDashboard },
  domain: { outline: MdOutlineDomain, filled: MdDomain },
  home: { outline: MdOutlineHome, filled: MdHome },
  query_stats: { outline: MdOutlineQueryStats, filled: MdQueryStats },
  account_balance_wallet: { outline: MdOutlineAccountBalanceWallet, filled: MdOutlineAccountBalanceWallet },
  apps: { outline: MdOutlineApps, filled: MdApps },
  help: { outline: MdOutlineHelp, filled: MdHelp },
  logout: { outline: MdOutlineLogout, filled: MdLogout },
  notifications: { outline: MdOutlineNotifications, filled: MdNotifications },
  search: { outline: MdOutlineSearch, filled: MdSearch },
  event_repeat: { outline: MdOutlineEventRepeat, filled: MdEventRepeat },
  description: { outline: MdOutlineDescription, filled: MdDescription },
  payments: { outline: MdOutlinePayments, filled: MdPayments },
  group: { outline: MdOutlineGroup, filled: MdGroup },
  credit_card: { outline: MdOutlineCreditCard, filled: MdCreditCard },
  account_circle: { outline: MdOutlineAccountCircle, filled: MdOutlineAccountCircle },
  hotel_class: { outline: MdOutlineHotelClass, filled: MdHotelClass },
  pending_actions: { outline: MdOutlinePendingActions, filled: MdPendingActions },
  history_edu: { outline: MdOutlineHistoryEdu, filled: MdHistoryEdu },
  add_home: { outline: MdOutlineAddHome, filled: MdOutlineAddHome },
  wallet: { outline: MdOutlineWallet, filled: MdWallet },
  fitness_center: { outline: MdOutlineFitnessCenter, filled: MdFitnessCenter },
  wifi: { outline: MdOutlineWifi, filled: MdWifi },
  nest_eco_leaf: { outline: MdOutlineEco, filled: MdEco },
  settings: { outline: MdOutlineSettings, filled: MdSettings },
};

const fallbackIcon = MdOutlineApps;

export function MaterialIcon({ name, className, filled = false, size }: MaterialIconProps) {
  const entry = icons[name];
  const Icon = filled ? entry?.filled ?? entry?.outline ?? fallbackIcon : entry?.outline ?? fallbackIcon;

  return <Icon aria-hidden="true" className={cn("inline-block shrink-0", className)} size={size} />;
}

import type { Role } from "@/types/domain";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAVIGATION_BY_ROLE: Record<Role, NavItem[]> = {
  landlord: [
    { href: "/landlord/dashboard", label: "Tableau de bord", icon: "dashboard" },
    { href: "/landlord/properties", label: "Patrimoine", icon: "domain" },
    { href: "/landlord/units", label: "Unités", icon: "apartment" },
    { href: "/landlord/tenants", label: "Locataires", icon: "group" },
    { href: "/landlord/bookings", label: "Réservations", icon: "event_repeat" },
    { href: "/landlord/leases", label: "Baux", icon: "description" },
    { href: "/landlord/payments", label: "Finances", icon: "payments" },
    { href: "/landlord/reports", label: "Rapports", icon: "query_stats" },
  ],
  tenant: [
    { href: "/tenant/dashboard", label: "Tableau de bord", icon: "home" },
    { href: "/tenant/bookings", label: "Mes séjours", icon: "book_online" },
    { href: "/tenant/leases", label: "Baux", icon: "description" },
    { href: "/tenant/payments", label: "Paiements", icon: "credit_card" },
    { href: "/tenant/book-stay", label: "Explorer les biens", icon: "search" },
  ],
};

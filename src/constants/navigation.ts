import type { Role } from "@/types/domain";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAVIGATION_BY_ROLE: Record<Role, NavItem[]> = {
  landlord: [
    { href: "/landlord/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/landlord/properties", label: "Portfolio", icon: "domain" },
    { href: "/landlord/units", label: "Units", icon: "apartment" },
    { href: "/landlord/tenants", label: "Management", icon: "group" },
    { href: "/landlord/bookings", label: "Bookings", icon: "event_repeat" },
    { href: "/landlord/leases", label: "Leases", icon: "description" },
    { href: "/landlord/payments", label: "Finance", icon: "payments" },
    { href: "/landlord/reports", label: "Reports", icon: "query_stats" },
  ],
  tenant: [
    { href: "/tenant/dashboard", label: "Dashboard", icon: "home" },
    { href: "/tenant/bookings", label: "My Stays", icon: "book_online" },
    { href: "/tenant/leases", label: "Leases", icon: "description" },
    { href: "/tenant/payments", label: "Payments", icon: "credit_card" },
    { href: "/tenant/book-stay", label: "Browse Properties", icon: "search" },
  ],
};

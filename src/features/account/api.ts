import { getCurrentUser, getShellProfile } from "@/lib/api/accounts";
import { getSessionTokens } from "@/lib/api/session";
import { listTenantProfiles } from "@/lib/api/tenants";
import { getLandlordDashboardVm } from "@/features/landlord/api";
import { getTenantDashboardVm } from "@/features/tenant/api";
import type { AuthenticatedUser } from "@/types/api";
import type { Role } from "@/types/domain";

function errorMeta(warning: string) {
  return { source: "error" as const, warning };
}

export async function getCurrentAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const tokens = await getSessionTokens();
  if (!tokens?.accessToken) {
    return null;
  }

  const [user, shellProfile] = await Promise.all([
    getCurrentUser(tokens.accessToken).catch(() => null),
    getShellProfile(tokens.accessToken).catch(() => null),
  ]);

  if (!user) {
    return null;
  }

  return {
    id: String(shellProfile?.id ?? shellProfile?.user_id ?? user.id),
    role: shellProfile?.role ?? user.role,
    fullName: shellProfile?.full_name || user.full_name || [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "Utilisateur",
    phoneNumber: shellProfile?.phone_number || user.phone_number,
    email: shellProfile?.email ?? user.email,
    unreadNotifications:
      typeof shellProfile?.unread_notifications === "number" ? shellProfile.unread_notifications : undefined,
  };
}

export async function getCurrentAccountProfileVm(role: Role) {
  const tokens = await getSessionTokens();
  if (!tokens?.accessToken) {
    return {
      user: null,
      role,
      details: null,
      meta: errorMeta("Aucune session authentifiée trouvée."),
    };
  }

  const user = await getCurrentUser(tokens.accessToken).catch(() => null);
  if (!user) {
    return {
      user: null,
      role,
      details: null,
      meta: errorMeta("Impossible de charger le profil utilisateur courant."),
    };
  }

  if (role === "tenant") {
    const [dashboard, profiles] = await Promise.all([
      getTenantDashboardVm(),
      listTenantProfiles(tokens.accessToken).catch(() => null),
    ]);
    const tenantProfile =
      profiles?.find?.((profile) => profile.user?.id === user.id) ?? null;

    return {
      user,
      role,
      details: {
        tenantProfile,
        currentLease: dashboard.currentLease,
        currentUnit: dashboard.currentUnit,
        currentProperty: dashboard.currentProperty,
        paymentsCount: dashboard.payments.length,
        leasesCount: dashboard.leases.length,
      },
      meta: dashboard.meta,
    };
  }

  const dashboard = await getLandlordDashboardVm();

  return {
    user,
    role,
    details: {
      propertiesCount: dashboard.properties.length,
      unitsCount: dashboard.units.length,
      leasesCount: dashboard.leases.length,
      bookingsCount: dashboard.bookings.length,
      paymentsCount: dashboard.payments.length,
      tenantsCount: dashboard.kpis.tenants,
    },
    meta: dashboard.meta,
  };
}

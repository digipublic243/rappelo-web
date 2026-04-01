import Link from "next/link";
import { NAVIGATION_BY_ROLE } from "@/constants/navigation";
import { APP_TITLE, ROUTE_GROUP_LABELS } from "@/config/app";
import type { Role } from "@/types/domain";
import { cn } from "@/lib/cn";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getCurrentAuthenticatedUser } from "@/features/account/api";
import { logoutAction } from "@/features/auth/actions";

interface AppShellProps {
  role: Role;
  currentPath: string;
  children: React.ReactNode;
  searchPlaceholder?: string;
}

const topLinksByRole = {
  landlord: [],
  tenant: [
    { href: "/tenant/dashboard", label: "Dashboard" },
    { href: "/tenant/bookings", label: "My Stays" },
    { href: "/tenant/payments", label: "Payments" },
    { href: "/tenant/book-stay", label: "Browse Properties" },
  ],
} as const;

export function AppShell({
  role,
  currentPath,
  children,
  searchPlaceholder = "Search properties, tenants...",
}: AppShellProps) {
  const sessionUserPromise = getCurrentAuthenticatedUser();
  return <AsyncAppShell role={role} currentPath={currentPath} searchPlaceholder={searchPlaceholder} sessionUserPromise={sessionUserPromise}>{children}</AsyncAppShell>;
}

async function AsyncAppShell({
  role,
  currentPath,
  children,
  searchPlaceholder,
  sessionUserPromise,
}: AppShellProps & { sessionUserPromise: ReturnType<typeof getCurrentAuthenticatedUser> }) {
  const navItems = NAVIGATION_BY_ROLE[role];
  const topLinks = topLinksByRole[role];
  const isTenant = role === "tenant";
  const sessionUser = await sessionUserPromise;
  const profileName = sessionUser?.fullName || ROUTE_GROUP_LABELS[role];
  const profileCaption = isTenant ? "Resident Account" : "Workspace Account";
  const unreadNotifications = sessionUser?.unreadNotifications ?? 0;
  const profileInitials = profileName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "EM";
  const profileHref = isTenant ? "/tenant/profile" : "/landlord/profile";

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#2a3439]">
      {isTenant ? (
        <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-white/80 px-6 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-8">
            <p className="text-xl font-black tracking-tight text-slate-900">{APP_TITLE}</p>
            <nav className="hidden items-center gap-6 text-sm text-slate-500 lg:flex">
              {topLinks.map((item) => {
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "font-medium transition-colors hover:text-slate-700",
                      active && "font-semibold text-slate-900",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100" type="button">
              <MaterialIcon name="notifications" className="text-[20px]" />
              {unreadNotifications > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9f403d] px-1 text-[10px] font-bold text-white">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              ) : null}
            </button>
            <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100" type="button">
              <MaterialIcon name="apps" className="text-[20px]" />
            </button>
            <Link href={profileHref} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9e4ea] text-xs font-bold text-[#545f73]">
              {profileInitials}
            </Link>
          </div>
        </header>
      ) : null}

      <aside
        className={cn(
          "fixed left-0 z-30 hidden w-64 flex-col bg-slate-50 p-4 md:flex",
          isTenant ? "top-16 h-[calc(100vh-4rem)]" : "top-0 h-screen",
        )}
      >
        <div className={cn("px-2", isTenant ? "mb-6" : "mb-8 pt-2")}>
          <p className="text-lg font-black tracking-tight text-slate-900">{isTenant ? ROUTE_GROUP_LABELS[role] : APP_TITLE}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
            {isTenant ? "Resident Services" : ROUTE_GROUP_LABELS[role]}
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = currentPath === item.href || (currentPath.startsWith(`${item.href}/`) && item.href !== "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-white font-bold text-slate-900 shadow-sm"
                    : "font-medium text-slate-500 hover:bg-slate-200/50 hover:text-slate-700",
                )}
              >
                <MaterialIcon name={item.icon} className="text-[20px]" filled={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 border-t border-slate-200/50 pt-4">
          <Link href={profileHref} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-700">
            <MaterialIcon name={isTenant ? "account_circle" : "settings"} className="text-[20px]" />
            {isTenant ? "Account" : "Profile"}
          </Link>
          <form action={logoutAction}>
            <input name="role" type="hidden" value={role} />
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-700" type="submit">
              <MaterialIcon name="logout" className="text-[20px]" />
              Log out
            </button>
          </form>
          {!isTenant ? (
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-all hover:bg-slate-200/50 hover:text-slate-700" type="button">
              <MaterialIcon name="help" className="text-[20px]" />
              Support
            </button>
          ) : null}
          {!isTenant ? (
            <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#f0f4f7] px-3 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8e3fb] text-xs font-bold text-[#545f73]">
                {profileInitials}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900">{profileName}</p>
                <p className="truncate text-xs text-slate-500">{profileCaption}</p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <main className={cn("min-h-screen", "md:ml-64", isTenant ? "pt-24 pb-12" : "pb-12")}>
        {!isTenant ? (
          <header className="fixed left-64 right-0 top-0 z-40 flex h-16 items-center justify-between bg-white/80 px-8 shadow-sm backdrop-blur-md">
            <div className="hidden items-center gap-2 rounded-full bg-[#f0f4f7] px-4 py-2 md:flex">
              <MaterialIcon name="search" className="text-[18px] text-slate-400" />
              <input
                className="w-64 border-none bg-transparent p-0 text-sm text-slate-700 focus:ring-0"
                placeholder={searchPlaceholder}
              />
            </div>
            <div className="ml-auto flex items-center gap-4 text-slate-500">
              <button className="relative rounded-full p-2 hover:bg-slate-100" type="button">
                <MaterialIcon name="notifications" className="text-[20px]" />
                {unreadNotifications > 0 ? (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#9f403d] px-1 text-[10px] font-bold text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </button>
              <button className="rounded-full p-2 hover:bg-slate-100" type="button">
                <MaterialIcon name="apps" className="text-[20px]" />
              </button>
            </div>
          </header>
        ) : null}

        <div className={cn("mx-auto max-w-7xl", isTenant ? "px-6 lg:pr-12" : "px-8 pt-24")}>
          {!isTenant ? null : (
            <div className="hidden items-center gap-2 rounded-lg bg-[#e8eff3] px-3 py-1.5 md:flex lg:hidden">
              <MaterialIcon name="search" className="text-[18px] text-slate-400" />
              <input className="w-full border-none bg-transparent p-0 text-sm text-slate-700 focus:ring-0" placeholder={searchPlaceholder} />
            </div>
          )}
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

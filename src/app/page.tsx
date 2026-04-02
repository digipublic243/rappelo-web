import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#d8e3fb,transparent_32%),linear-gradient(180deg,#f7f9fb,#eef3f6)] px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-12">
          <SurfaceCard className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)] backdrop-blur-xl lg:col-span-7 lg:p-10">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(216,227,251,0.9),transparent_68%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f0f4f7] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#545f73]">
                <MaterialIcon name="apartment" className="text-[16px]" />
                RAPPELO
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold tracking-tight text-[#2a3439] md:text-5xl">
                Property operations with one visual language for landlord and tenant flows.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#566166] md:text-base">
                The workspace now follows the same polished shell as the main product: role-based entry points, API-backed views,
                and Stitch-aligned layouts ready for the next implementation steps.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#545f73] px-5 py-3 text-sm font-semibold text-[#f6f7ff] shadow-sm transition-all hover:brightness-110"
                  href="/landlord/sign-in"
                >
                  <MaterialIcon name="dashboard" className="text-[18px]" />
                  Enter landlord flow
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#a9b4b9]/40 bg-white px-5 py-3 text-sm font-semibold text-[#545f73] transition-all hover:bg-[#f0f4f7]"
                  href="/tenant/login"
                >
                  <MaterialIcon name="home" className="text-[18px]" />
                  Enter tenant flow
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  ["Live APIs", "Auth, properties, units, tenants, leases, payments"],
                  ["Shared Shell", "Sidebar, topbar, cards and dashboards stay visually aligned"],
                  ["Clean Base", "Typed services, mappers, loading states and measured fallback"],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-2xl bg-[#f0f4f7] p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#717c82]">{label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-[#2a3439]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </SurfaceCard>

          <div className="space-y-6 lg:col-span-5">
            <SurfaceCard className="rounded-[28px] bg-[linear-gradient(155deg,#545f73,#7e8898)] p-8 text-white shadow-[0_24px_60px_rgba(84,95,115,0.24)]">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-white/12 p-3">
                  <MaterialIcon name="query_stats" className="text-[24px]" />
                </div>
                <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                  Portfolio View
                </span>
              </div>
              <h2 className="mt-10 text-2xl font-bold tracking-tight">Operational visibility from the first screen.</h2>
              <p className="mt-3 text-sm leading-6 text-white/78">
                The landing experience now uses the same editorial cards, spacing, colors and hierarchy as the landlord and tenant surfaces.
              </p>
            </SurfaceCard>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <SurfaceCard className="rounded-[28px] p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-[#d8e3fb] p-3 text-[#545f73]">
                    <MaterialIcon name="domain" className="text-[22px]" />
                  </div>
                  <span className="rounded-full bg-[#f0f4f7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#566166]">
                    Landlord
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#2a3439]">Run the portfolio</h2>
                <p className="mt-2 text-sm leading-6 text-[#566166]">
                  Dashboard, properties, units, tenants, bookings, leases, payments and reports from one management lane.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-[#545f73] px-5 py-3 text-sm font-semibold text-[#f6f7ff]"
                    href="/landlord/dashboard"
                  >
                    Open dashboard
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-lg border border-[#a9b4b9]/40 bg-white px-5 py-3 text-sm font-semibold text-[#545f73]"
                    href="/landlord/sign-in"
                  >
                    Sign in
                  </Link>
                </div>
              </SurfaceCard>

              <SurfaceCard className="rounded-[28px] p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-[#d3e4fe] p-3 text-[#545f73]">
                    <MaterialIcon name="book_online" className="text-[22px]" />
                  </div>
                  <span className="rounded-full bg-[#f0f4f7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#566166]">
                    Tenant
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#2a3439]">Track the residency</h2>
                <p className="mt-2 text-sm leading-6 text-[#566166]">
                  Resident dashboard, stays, leases, payments and booking discovery on the same product system.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-[#545f73] px-5 py-3 text-sm font-semibold text-[#f6f7ff]"
                    href="/tenant/dashboard"
                  >
                    Open dashboard
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-lg border border-[#a9b4b9]/40 bg-white px-5 py-3 text-sm font-semibold text-[#545f73]"
                    href="/tenant/login"
                  >
                    Tenant login
                  </Link>
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,var(--primary-3),transparent_32%),linear-gradient(180deg,var(--background),var(--secondary-1))] px-6 py-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center">
        <div className="grid gap-8 lg:grid-cols-12">
          <SurfaceCard className="relative overflow-hidden rounded-[32px] border border-white/60 bg-background/90 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)] backdrop-blur-xl lg:col-span-7 lg:p-10">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(216,227,251,0.9),transparent_68%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary-4)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                <MaterialIcon name="apartment" className="text-[16px]" />
                RAPPELO
              </div>
              <h1 className="mt-6 max-w-2xl text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                Les opérations immobilières dans un langage visuel unique pour les parcours bailleur et locataire.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary-2 md:text-base">
                L’espace suit désormais la même structure soignée que le produit principal : points d’entrée selon le rôle, vues alimentées par l’API
                et layouts alignés sur Stitch, prêts pour les prochaines étapes d’implémentation.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-4 shadow-sm transition-all hover:brightness-110"
                  href="/landlord/sign-in"
                >
                  <MaterialIcon name="dashboard" className="text-[18px]" />
                  Entrer dans le parcours bailleur
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--secondary)_40%,transparent)] bg-[var(--secondary-4)] px-5 py-3 text-sm font-semibold text-primary transition-all hover:bg-secondary-4"
                  href="/tenant/login"
                >
                  <MaterialIcon name="home" className="text-[18px]" />
                  Entrer dans le parcours locataire
                </Link>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  ["APIs live", "Auth, biens, unités, locataires, baux et paiements"],
                  ["Shell partagé", "Sidebar, topbar, cartes et dashboards restent visuellement alignés"],
                  ["Base propre", "Services typés, mappers, états de chargement et fallback mesuré"],
                ].map(([label, text]) => (
                  <div key={label} className="rounded-2xl bg-[var(--secondary-4)] p-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">{label}</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </SurfaceCard>

          <div className="space-y-6 lg:col-span-5">
            <SurfaceCard className="rounded-[28px] bg-[linear-gradient(155deg,var(--primary),var(--primary-2))] p-8 text-white shadow-[var(--shadow-lg)]">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-background/12 p-3">
                  <MaterialIcon name="query_stats" className="text-[24px]" />
                </div>
                <span className="rounded-full bg-background/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                  Vue portefeuille
                </span>
              </div>
              <h2 className="mt-10 text-2xl font-bold tracking-tight">Une visibilité opérationnelle dès le premier écran.</h2>
              <p className="mt-3 text-sm leading-6 text-white/78">
                L’expérience d’accueil reprend maintenant les mêmes cartes éditoriales, espacements, couleurs et hiérarchie que les surfaces bailleur et locataire.
              </p>
            </SurfaceCard>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              <SurfaceCard className="rounded-[28px] p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-primary-3 p-3 text-primary">
                    <MaterialIcon name="domain" className="text-[22px]" />
                  </div>
                  <span className="rounded-full bg-[var(--secondary-4)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-2">
                    Landlord
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Piloter le portefeuille</h2>
                <p className="mt-2 text-sm leading-6 text-secondary-2">
                  Dashboard, biens, unités, locataires, réservations, baux, paiements et rapports dans un seul espace de gestion.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-[var(--primary-4)]"
                    href="/landlord/dashboard"
                  >
                    Ouvrir le dashboard
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-lg border border-[color:color-mix(in_srgb,var(--secondary)_40%,transparent)] bg-[var(--secondary-4)] px-5 py-3 text-sm font-semibold text-primary"
                    href="/landlord/sign-in"
                  >
                    Se connecter
                  </Link>
                </div>
              </SurfaceCard>

              <SurfaceCard className="rounded-[28px] p-7">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-primary-3 p-3 text-primary">
                    <MaterialIcon name="book_online" className="text-[22px]" />
                  </div>
                  <span className="rounded-full bg-[var(--secondary-4)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-2">
                    Tenant
                  </span>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Suivre le séjour</h2>
                <p className="mt-2 text-sm leading-6 text-secondary-2">
                  Dashboard résident, séjours, baux, paiements et découverte de réservation dans le même système produit.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-[var(--primary-4)]"
                    href="/tenant/dashboard"
                  >
                    Ouvrir le dashboard
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-lg border border-[color:color-mix(in_srgb,var(--secondary)_40%,transparent)] bg-[var(--secondary-4)] px-5 py-3 text-sm font-semibold text-primary"
                    href="/tenant/login"
                  >
                    Connexion locataire
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

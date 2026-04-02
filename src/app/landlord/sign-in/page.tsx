import Link from "next/link";
import { AuthForm } from "@/features/auth/AuthForm";
import { loginAction } from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";

export default function LandlordSignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,var(--primary-3),transparent_38%),linear-gradient(180deg,var(--background),var(--secondary-1))] p-6">
      <section className="relative w-full max-w-160 rounded-[28px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)] backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">RAPPELO</h1>
        <div className="mt-6 grid grid-cols-2 rounded-full bg-[var(--secondary-4)] p-1 text-sm font-semibold">
          <div className="rounded-full bg-white px-4 py-2 text-center text-foreground shadow-sm">Connexion</div>
          <Link className="px-4 py-2 text-center text-secondary-2" href="/landlord/sign-up">
            Inscription
          </Link>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-foreground">Bon retour</h2>
        <p className="mt-1 text-sm text-secondary-2">Connectez-vous pour accéder à votre espace bailleur et à la gestion de votre patrimoine.</p>
        <AuthForm
          action={loginAction}
          fields={[
            { name: "phone_number", placeholder: "Numéro de téléphone" },
            { name: "password", type: "password", placeholder: "Mot de passe" },
          ]}
          helperText="Ce formulaire utilise le véritable point d’accès JWT défini par le backend."
          initialState={initialAuthActionState}
          submitLabel="Se connecter"
        />
      </section>
    </main>
  );
}

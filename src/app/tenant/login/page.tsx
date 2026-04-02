import { TenantOtpForm } from "@/features/auth/TenantOtpForm";

export default function TenantLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#d3e4fe,transparent_38%),linear-gradient(180deg,#f7f9fb,#eef3f6)] p-6">
      <section className="w-full max-w-lg rounded-[28px] border border-white/60 bg-white/95 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#545f73]">Portail locataire</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2a3439]">Bienvenue chez vous</h1>
        <p className="mt-2 text-sm text-[#566166]">
          Le frontend suit désormais le guide backend : l’OTP est le flux principal de connexion locataire, avec le mot de passe conservé comme solution temporaire.
        </p>

        <TenantOtpForm />
      </section>
    </main>
  );
}

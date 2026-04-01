import { AuthForm } from "@/features/auth/AuthForm";
import { loginAction } from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";

export default function TenantLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#d3e4fe,transparent_38%),linear-gradient(180deg,#f7f9fb,#eef3f6)] p-6">
      <section className="w-full max-w-md rounded-[28px] border border-white/60 bg-white/95 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#545f73]">Tenant Portal</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#2a3439]">Welcome Home</h1>
        <p className="mt-2 text-sm text-[#566166]">Temporary password login wired to JWT while the OTP flow is not available in the current OpenAPI spec.</p>

        <AuthForm
          action={loginAction}
          fields={[
            { name: "phone_number", placeholder: "Phone number" },
            { name: "password", type: "password", placeholder: "Password" },
          ]}
          helperText="The visual shell stays close to the OTP screen, but authentication currently uses the backend password endpoint."
          initialState={initialAuthActionState}
          submitLabel="Continue"
        />

        <p className="mt-4 text-center text-xs text-[#717c82]">
          Visual OTP placeholders were removed from the action path because the backend spec currently exposes password login, not OTP.
        </p>
      </section>
    </main>
  );
}

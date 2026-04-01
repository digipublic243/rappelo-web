import Link from "next/link";
import { AuthForm } from "@/features/auth/AuthForm";
import { landlordSignUpAction } from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";

export default function LandlordSignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#d8e3fb,transparent_38%),linear-gradient(180deg,#f7f9fb,#eef3f6)] p-6">
      <section className="relative w-full max-w-[480px] rounded-[28px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(84,95,115,0.18)] backdrop-blur-xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#2a3439]">Estate Metric</h1>
        <div className="mt-6 grid grid-cols-2 rounded-full bg-[#f0f4f7] p-1 text-sm font-semibold">
          <Link className="px-4 py-2 text-center text-[#566166]" href="/landlord/sign-in">
            Sign In
          </Link>
          <div className="rounded-full bg-white px-4 py-2 text-center text-[#2a3439] shadow-sm">Sign Up</div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-[#2a3439]">Create account</h2>
        <p className="mt-1 text-sm text-[#566166]">Set up your workspace for multi-property operations.</p>
        <AuthForm
          action={landlordSignUpAction}
          fields={[
            { name: "company_name", placeholder: "Company name" },
            { name: "phone_number", placeholder: "Phone number" },
            { name: "email", type: "email", placeholder: "Work email" },
            { name: "password", type: "password", placeholder: "Password" },
            { name: "password2", type: "password", placeholder: "Confirm password" },
          ]}
          helperText="Landlord sign-up uses the real account creation endpoint, then logs in immediately."
          initialState={initialAuthActionState}
          submitLabel="Create account"
        />
      </section>
    </main>
  );
}

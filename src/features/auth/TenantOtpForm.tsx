"use client";

import { useActionState, useState } from "react";
import { AppForm, FormInlineError, FormInlineSuccess, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import {
  requestTenantOtpAction,
  verifyTenantOtpAction,
} from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";
import {
  formatPhonePreview,
} from "@/features/auth/phone";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

export function TenantOtpForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [requestState, requestAction, requestPending] = useActionState(
    requestTenantOtpAction,
    initialAuthActionState,
  );
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyTenantOtpAction,
    initialAuthActionState,
  );

  const resolvedPhoneNumber =
    verifyState.phoneNumber ?? requestState.phoneNumber ?? phoneNumber;
  const otpRequested =
    requestState.step === "verify" || verifyState.step === "verify";
  const otpMessage = verifyState.message ?? requestState.message;
  const otpError = verifyState.error ?? requestState.error;
  const otpErrorDetails = verifyState.errorDetails ?? requestState.errorDetails;
  useSyncGlobalApiError(otpError, {
    title: "Erreur OTP locataire",
    scope: "tenant-auth",
  });

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-4xl border border-[#d9e4ea] bg-[#f8fbfd] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#2a3439]">Connexion par OTP</p>
            <p className="mt-1 text-xs text-[#717c82]">
              Flux locataire recommandé par le backend. En développement, le
              code OTP s’affiche dans la console du serveur.
            </p>
          </div>
          <span className="rounded-full bg-[#d8e3fb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#485367]">
            Recommandé
          </span>
        </div>

        {!otpRequested ? (
          <AppForm action={requestAction} className="mt-5 space-y-4">
            <FormField
              helperText="Saisissez le numéro du locataire. Le backend le normalisera avant l’envoi."
              name="phone_number"
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Numéro de téléphone"
              required
              type="text"
              value={phoneNumber}
            />
            <FormInlineError message={otpError} />
            {otpErrorDetails?.length ? (
              <div className="rounded-xl border border-[#f2b7b3] bg-white px-4 py-4">
                <p className="text-sm font-bold text-[#752121]">Détails :</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5d3b39]">
                  {otpErrorDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <FormSubmitButton className="w-full" disabled={requestPending}>
              {requestPending ? "Envoi..." : "Demander le code OTP"}
            </FormSubmitButton>
          </AppForm>
        ) : (
          <AppForm action={verifyAction} className="mt-5 space-y-4">
            <FormField name="phone_number" type="hidden" value={resolvedPhoneNumber} />
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[#566166]">
              {formatPhonePreview(resolvedPhoneNumber)}
            </div>
            <FormField
              inputClassName="tracking-[0.35em]"
              maxLength={6}
              name="code"
              placeholder="123456"
              required
              type="text"
            />
            <FormInlineSuccess className="bg-[#d8e3fb]/50" message={otpMessage} />
            <FormInlineError message={otpError} />
            {otpErrorDetails?.length ? (
              <div className="rounded-xl border border-[#f2b7b3] bg-white px-4 py-4">
                <p className="text-sm font-bold text-[#752121]">Détails :</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5d3b39]">
                  {otpErrorDetails.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="flex gap-3">
              <FormSubmitButton
                className="flex-1 border border-[#d9e4ea] bg-white text-[#566166]"
                onClick={() => {
                  setPhoneNumber(resolvedPhoneNumber);
                }}
                type="button"
              >
                Garder ce numéro
              </FormSubmitButton>
              <FormSubmitButton className="flex-1" disabled={verifyPending}>
                {verifyPending ? "Vérification..." : "Vérifier le code"}
              </FormSubmitButton>
            </div>
          </AppForm>
        )}
      </div>
    </div>
  );
}

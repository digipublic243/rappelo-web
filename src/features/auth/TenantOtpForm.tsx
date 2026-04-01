"use client";

import { useActionState, useState } from "react";
import { loginAction, requestTenantOtpAction, verifyTenantOtpAction } from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";
import { extractLocalPhoneDigits, formatPhonePreview } from "@/features/auth/phone";

export function TenantOtpForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordPhoneNumber, setPasswordPhoneNumber] = useState("");
  const [requestState, requestAction, requestPending] = useActionState(requestTenantOtpAction, initialAuthActionState);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyTenantOtpAction, initialAuthActionState);
  const [passwordState, passwordAction, passwordPending] = useActionState(loginAction, initialAuthActionState);

  const resolvedPhoneNumber = verifyState.phoneNumber ?? requestState.phoneNumber ?? phoneNumber;
  const otpRequested = requestState.step === "verify" || verifyState.step === "verify";
  const otpMessage = verifyState.message ?? requestState.message;
  const otpError = verifyState.error ?? requestState.error;

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-[24px] border border-[#d9e4ea] bg-[#f8fbfd] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#2a3439]">Sign in with OTP</p>
            <p className="mt-1 text-xs text-[#717c82]">
              Canonical tenant flow from the backend guide. In development, the backend prints the OTP in its console.
            </p>
          </div>
          <span className="rounded-full bg-[#d8e3fb] px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-[#485367]">
            Preferred
          </span>
        </div>

        {!otpRequested ? (
          <form action={requestAction} className="mt-5 space-y-4">
            <div className="space-y-2">
              <div className="flex overflow-hidden rounded-2xl border border-[#d9e4ea] bg-white">
                <span className="inline-flex items-center border-r border-[#d9e4ea] bg-[#f8fbfd] px-4 text-sm font-semibold text-[#566166]">
                  243
                </span>
                <input
                  className="w-full bg-white px-4 py-3 outline-none"
                  inputMode="numeric"
                  maxLength={9}
                  name="phone_number"
                  onChange={(event) => setPhoneNumber(extractLocalPhoneDigits(event.target.value))}
                  placeholder="XXXXXXXXX"
                  required
                  type="text"
                  value={phoneNumber}
                />
              </div>
              <p className="text-[11px] text-[#717c82]">Enter only the last 9 digits. The request will be sent as `243XXXXXXXXX`.</p>
            </div>
            {otpError ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{otpError}</p> : null}
            <button
              className="w-full rounded-2xl bg-[#545f73] px-4 py-3 font-semibold text-[#f6f7ff] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={requestPending}
              type="submit"
            >
              {requestPending ? "Requesting..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form action={verifyAction} className="mt-5 space-y-4">
            <input name="phone_number" type="hidden" value={resolvedPhoneNumber} />
            <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[#566166]">{formatPhonePreview(resolvedPhoneNumber)}</div>
            <input
              className="w-full rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3 tracking-[0.35em]"
              maxLength={6}
              name="code"
              placeholder="123456"
              required
              type="text"
            />
            {otpMessage ? <p className="rounded-xl bg-[#d8e3fb]/50 px-4 py-3 text-sm text-[#485367]">{otpMessage}</p> : null}
            {otpError ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{otpError}</p> : null}
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3 font-semibold text-[#566166]"
                onClick={() => {
                  setPhoneNumber(extractLocalPhoneDigits(resolvedPhoneNumber));
                }}
                type="button"
              >
                Keep number
              </button>
              <button
                className="flex-1 rounded-2xl bg-[#545f73] px-4 py-3 font-semibold text-[#f6f7ff] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={verifyPending}
                type="submit"
              >
                {verifyPending ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-[24px] border border-[#d9e4ea] bg-white p-5">
        <p className="text-sm font-bold text-[#2a3439]">Password fallback</p>
        <p className="mt-1 text-xs text-[#717c82]">
          Still supported by the backend while OTP delivery remains dependent on the SMS provider rollout.
        </p>
        <form action={passwordAction} className="mt-5 space-y-4">
          <div className="space-y-2">
            <div className="flex overflow-hidden rounded-2xl border border-[#d9e4ea] bg-white">
              <span className="inline-flex items-center border-r border-[#d9e4ea] bg-[#f8fbfd] px-4 text-sm font-semibold text-[#566166]">
                243
              </span>
              <input
                className="w-full bg-white px-4 py-3 outline-none"
                inputMode="numeric"
                maxLength={9}
                name="phone_number"
                onChange={(event) => setPasswordPhoneNumber(extractLocalPhoneDigits(event.target.value))}
                placeholder="XXXXXXXXX"
                type="text"
                value={passwordPhoneNumber}
              />
            </div>
            <p className="text-[11px] text-[#717c82]">Enter only the last 9 digits. The app submits them as `243XXXXXXXXX`.</p>
          </div>
          <input className="w-full rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3" name="password" placeholder="Password" type="password" />
          {passwordState.error ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{passwordState.error}</p> : null}
          <button
            className="w-full rounded-2xl bg-[#eef3f6] px-4 py-3 font-semibold text-[#2a3439] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={passwordPending}
            type="submit"
          >
            {passwordPending ? "Working..." : "Continue with password"}
          </button>
        </form>
      </div>
    </div>
  );
}

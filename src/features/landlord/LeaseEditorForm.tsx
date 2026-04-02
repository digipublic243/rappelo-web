"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AppForm,
  FormInlineError,
  FormSubmitButton,
} from "@/components/forms/AppForm";
import { FormField, FormFieldMuted } from "@/components/forms/FormField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { type LeaseEditorActionState } from "@/features/landlord/lease-editor-state";

interface LeaseEditorDefaults {
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  moveInDate: string;
  monthlyRent: string;
  securityDeposit: string;
  securityDepositMonthsTaken: string;
  paymentFrequency: string;
  notes: string;
}

interface LeaseEditorFormProps {
  action: (
    state: LeaseEditorActionState,
    formData: FormData,
  ) => Promise<LeaseEditorActionState>;
  defaults: LeaseEditorDefaults;
  initialState: LeaseEditorActionState;
  tenants: Array<{ label: string; value: string }>;
  units: Array<{ label: string; value: string }>;
}

export function LeaseEditorForm({
  action,
  defaults,
  initialState,
  tenants,
  units,
}: LeaseEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useSyncGlobalApiError(state.error, {
    title: "Échec de création du bail",
    scope: "lease-editor",
  });

  return (
    <AppForm action={formAction} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-8">
        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-[var(--primary)]">
              <MaterialIcon name="description" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Contrat de bail
              </h2>
              <p className="text-sm text-secondary-2">
                Associez un locataire à une unité et définissez les bases du
                contrat avant activation.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted
              defaultValue={defaults.tenantId}
              label="Locataire"
              name="tenant"
              options={tenants}
              required
              type="select"
            />
            <FormFieldMuted
              defaultValue={defaults.unitId}
              label="Unité"
              name="unit"
              options={units}
              required
              type="select"
            />
            <FormFieldMuted
              defaultValue={defaults.startDate}
              label="Date de début"
              name="start_date"
              required
              type="date"
            />
            <FormFieldMuted
              defaultValue={defaults.endDate}
              label="Date de fin"
              name="end_date"
              required
              type="date"
            />
            <FormFieldMuted
              defaultValue={defaults.moveInDate}
              label="Date d’entrée"
              name="move_in_date"
              type="date"
            />
            <FormFieldMuted
              defaultValue={defaults.paymentFrequency}
              label="Périodicité de facturation"
              name="payment_frequency"
              options={[
                { label: "Mensuelle", value: "monthly" },
                { label: "Trimestrielle", value: "quarterly" },
                { label: "Semestrielle", value: "semi_annual" },
                { label: "Annuelle", value: "annual" },
              ]}
              required
              type="select"
            />
            <FormFieldMuted
              defaultValue={defaults.monthlyRent}
              label="Loyer mensuel contractuel"
              min={1}
              name="monthly_rent"
              required
              step="0.01"
              type="number"
            />
            <FormFieldMuted
              defaultValue={defaults.securityDeposit}
              label="Dépôt de garantie"
              min={0}
              name="security_deposit"
              step="0.01"
              type="number"
            />
            <FormFieldMuted
              defaultValue={defaults.securityDepositMonthsTaken}
              helperText="Si laissé vide, le backend reprendra automatiquement la configuration de l’unité."
              label="Mois de garantie prélevés"
              min={0}
              name="security_deposit_months_taken"
              step="1"
              type="number"
            />
            <FormField name="status" type="hidden" value="draft" />
            <FormFieldMuted
              className="md:col-span-2"
              defaultValue={defaults.notes}
              label="Notes"
              name="notes"
              rows={5}
              type="textarea"
            />
          </div>
        </section>
      </div>

      <div className="space-y-8 lg:col-span-4">
        <section className="rounded-[28px] bg-[var(--primary-2)] p-8 text-white shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Cycle du bail
            </h2>
            <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              API
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <p>1. Création via `POST /api/leases/leases/`.</p>
            <p>2. Le bail est créé en brouillon tant qu’il n’est pas activé.</p>
            <p>
              3. L’activation du bail changera aussi l’état de l’unité en
              occupée.
            </p>
            <p>
              4. La périodicité de facturation pilote ensuite le calcul des
              paiements backend.
            </p>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">
            Vérifications utiles
          </p>
          <div className="mt-5 space-y-3 text-sm text-secondary-2">
            <p>Choisissez de préférence une unité vacante ou réservée.</p>
            <p>La date de fin doit être postérieure à la date de début.</p>
            <p>
              Le loyer mensuel et la périodicité servent de base au calcul des
              paiements à venir.
            </p>
          </div>
        </section>

        <div className="space-y-3">
          <FormInlineError className="rounded-2xl" message={state.error} />
          {state.errorDetails?.length ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-white px-5 py-4">
              <p className="text-sm font-bold text-[var(--danger)]">
                Veuillez vérifier ces champs :
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color-mix(in_srgb,var(--danger) 72%,var(--background))]">
                {state.errorDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="lg:col-span-12">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-secondary-2"
            href="/landlord/leases"
          >
            Annuler
          </Link>
          <FormSubmitButton
            className="rounded-lg px-6 text-sm shadow-sm"
            disabled={pending}
          >
            {pending ? "Création..." : "Créer le bail"}
          </FormSubmitButton>
        </div>
      </div>
    </AppForm>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AppForm, FormInlineError, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField, FormFieldMuted } from "@/components/forms/FormField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import type { TenantEditorActionState } from "@/features/landlord/tenant-editor-state";

interface TenantEditorFormProps {
  action: (state: TenantEditorActionState, formData: FormData) => Promise<TenantEditorActionState>;
  initialState: TenantEditorActionState;
}

const employmentOptions = [
  { value: "employed", label: "Employé" },
  { value: "self_employed", label: "Indépendant" },
  { value: "student", label: "Étudiant" },
  { value: "unemployed", label: "Sans emploi" },
  { value: "retired", label: "Retraité" },
  { value: "military", label: "Militaire" },
  { value: "officer", label: "Officier" },
];

const maritalOptions = [
  { value: "single", label: "Célibataire" },
  { value: "married", label: "Marié(e)" },
  { value: "divorced", label: "Divorcé(e)" },
  { value: "widowed", label: "Veuf / veuve" },
  { value: "separated", label: "Séparé(e)" },
];

export function TenantEditorForm({ action, initialState }: TenantEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [alternatePhone, setAlternatePhone] = useState("");

  useSyncGlobalApiError(state.error, {
    title: "Échec de création du locataire",
    scope: "tenant-editor",
  });

  return (
    <AppForm action={formAction} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-8">
        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="group" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Accès locataire</h2>
              <p className="text-sm text-secondary-2">Le backend créera automatiquement le compte tenant à partir du numéro saisi ici.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormField
              className="md:col-span-2"
              helperText="Saisissez uniquement les 9 derniers chiffres. L’application enverra automatiquement le préfixe `243`, et ce numéro servira au compte tenant créé par le backend."
              label="Numéro du locataire"
              name="alternate_phone"
              onChange={setAlternatePhone}
              placeholder="812345678"
              required
              type="phone"
              value={alternatePhone}
            />
            <FormFieldMuted label="Email alternatif" name="alternate_email" placeholder="second@email.com" type="email" />
          </div>
        </section>

        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="description" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Profil locataire</h2>
              <p className="text-sm text-secondary-2">Renseignez les informations de base disponibles dans le guide API.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted
              label="Statut professionnel"
              name="employment_status"
              options={employmentOptions}
              type="select"
            />
            <FormFieldMuted
              label="Situation matrimoniale"
              name="marital_status"
              options={maritalOptions}
              type="select"
            />
            <FormFieldMuted className="md:col-span-2" label="Notes" name="notes" rows={4} type="textarea" />
            <FormField className="md:col-span-2" helperText="Le fichier ne peut pas être restauré automatiquement après un échec pour des raisons de sécurité navigateur." label="Pièce d’identité" name="id_card" type="file" />
          </div>
        </section>

      </div>

      <div className="space-y-8 lg:col-span-4">
        <section className="rounded-[28px] bg-[var(--primary-2)] p-8 text-white shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Création guidée</h2>
            <span className="rounded-full bg-background/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              API
            </span>
          </div>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            <p>1. Le formulaire est envoyé directement vers `POST /api/tenants/profiles/`.</p>
            <p>2. Le backend crée automatiquement un user `tenant` avec `alternate_phone` comme numéro de connexion.</p>
            <p>3. Redirection vers la fiche locataire si la création réussit.</p>
          </div>
        </section>

        <div className="space-y-3">
          <FormInlineError className="rounded-2xl" message={state.error} />
          {state.errorDetails?.length ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-background px-5 py-4">
              <p className="text-sm font-bold text-[var(--danger)]">Veuillez vérifier ces champs :</p>
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
          <Link className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-secondary-2" href="/landlord/tenants">
            Annuler
          </Link>
          <FormSubmitButton className="rounded-lg px-6 text-sm shadow-sm" disabled={pending}>
            {pending ? "Création..." : "Créer le locataire"}
          </FormSubmitButton>
        </div>
      </div>
    </AppForm>
  );
}

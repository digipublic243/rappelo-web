"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AppForm, FormInlineError, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField, FormFieldMuted } from "@/components/forms/FormField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { formatMoney } from "@/lib/format";
import type { ApiPropertyStatus } from "@/types/api";
import type { PropertyEditorActionState } from "@/features/landlord/property-editor-state";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface PropertyEditorDefaults {
  propertyId?: string;
  name: string;
  propertyType: string;
  status: ApiPropertyStatus;
  addressContent: string;
  city: string;
  country: string;
  description: string;
  totalUnits: string;
  currency: string;
  isActive: boolean;
}

interface PropertyEditorFormProps {
  mode: "create" | "edit";
  action: (state: PropertyEditorActionState, formData: FormData) => Promise<PropertyEditorActionState>;
  defaults: PropertyEditorDefaults;
  initialState: PropertyEditorActionState;
  propertyStats?: {
    occupiedUnits?: number;
    occupancyRate?: number | null;
    monthlyRevenue?: number;
  };
}

const statusOptions: ApiPropertyStatus[] = ["active", "inactive", "maintenance", "sold"];
const propertyStatusLabels: Record<ApiPropertyStatus, string> = {
  active: "Actif",
  inactive: "Inactif",
  maintenance: "Maintenance",
  sold: "Vendu",
};

const propertyTypeOptions = [
  { value: "apartment", label: "Appartement" },
  { value: "house", label: "Maison" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Maison en bande" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Autre" },
];

const propertyCityOptions = [{ value: "kinshasa", label: "Kinshasa" }];

export function PropertyEditorForm({
  mode,
  action,
  defaults,
  initialState,
  propertyStats,
}: PropertyEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  useSyncGlobalApiError(state.error, {
    title: mode === "create" ? "Échec de création du bien" : "Échec de mise à jour du bien",
    scope: "property-editor",
  });
  const [selectedStatus, setSelectedStatus] = useState<ApiPropertyStatus>(defaults.status);
  const title = mode === "create" ? "Créer un bien" : "Mettre à jour le bien";

  return (
    <AppForm action={formAction} className="grid gap-8 lg:grid-cols-12">
      {defaults.propertyId ? <FormField name="propertyId" type="hidden" value={defaults.propertyId} /> : null}

      <div className="space-y-8 lg:col-span-8">
        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="domain" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
              <p className="text-sm text-secondary-2">Renseignez l’identité du bien, son adresse et sa configuration principale.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted defaultValue={defaults.name} label="Nom du bien" name="name" required />
            <FormFieldMuted
              defaultValue={defaults.propertyType}
              label="Type de bien"
              name="property_type"
              options={propertyTypeOptions}
              required
              type="select"
            />
            <FormFieldMuted className="md:col-span-2" defaultValue={defaults.addressContent} label="Adresse" name="address_content" required />
            <FormFieldMuted
              defaultValue={defaults.city}
              label="Ville"
              name="city"
              options={propertyCityOptions}
              required
              type="select"
            />
            <FormFieldMuted defaultValue={defaults.country} label="Pays" name="country" required />
            <FormFieldMuted className="md:col-span-2" defaultValue={defaults.description} label="Description" name="description" rows={5} type="textarea" />
          </div>
        </section>

        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="payments" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Configuration documentée</h2>
              <p className="text-sm text-secondary-2">Le contrat backend actuel accepte ici surtout le statut métier et le nombre total d’unités.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted defaultValue={defaults.totalUnits} label="Nombre total d’unités" min={1} name="total_units" type="number" />
            <FormFieldMuted
              defaultValue={defaults.currency}
              label="Devise de référence"
              name="currency"
              options={[
                { label: "USD", value: "USD" },
              ]}
              type="select"
            />
            <div className="rounded-2xl bg-[var(--secondary-4)] px-4 py-4 text-sm text-secondary-2 md:col-span-2">
              Les informations avancées comme l’année de construction, la superficie ou la valorisation restent visibles en lecture sur la fiche bien, mais ne font plus partie du payload documenté pour la création et la mise à jour.
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-8 lg:col-span-4">
        <section className="rounded-[28px] bg-[var(--primary-2)] p-8 text-white shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Statut du bien</h2>
            <span className="rounded-full bg-background/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              Relié à l’API
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <FormField
              activeOptionClassName="border-white/50 bg-background/12"
              inactiveOptionClassName="border-transparent bg-background/8"
              name="status"
              onChange={(value) => setSelectedStatus(value as ApiPropertyStatus)}
              options={statusOptions.map((status) => ({
                description:
                  status === "active"
                    ? "Visible et opérationnel."
                    : status === "inactive"
                      ? "Conservé au patrimoine sans exploitation active."
                      : status === "maintenance"
                        ? "Temporairement indisponible pour l’exploitation."
                        : "Archivé hors exploitation active.",
                label: propertyStatusLabels[status],
                value: status,
              }))}
              type="radio-group"
              value={selectedStatus}
            />
          </div>
        </section>

        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Aperçu média</p>
          <div className="mt-6 flex h-56 items-end overflow-hidden rounded-2xl bg-[linear-gradient(145deg,var(--secondary-4),var(--primary-4))] p-5">
            <div className="rounded-xl bg-background/80 px-4 py-3 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-secondary-2">
                Média
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Aucun visuel statique affiché
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-secondary-2">
            La spécification backend actuelle n’expose pas encore l’envoi des médias du bien. Ce bloc reste donc un aperçu visuel.
          </p>
        </section>

        <section className="rounded-[28px] bg-secondary p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Résumé de performance</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Unités occupées</span>
              <span className="font-bold text-foreground">{propertyStats?.occupiedUnits ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Taux d’occupation</span>
              <span className="font-bold text-foreground">
                {propertyStats?.occupancyRate != null ? `${Math.round(propertyStats.occupancyRate)}%` : "N/D"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Revenu mensuel</span>
              <span className="font-bold text-foreground">
                {propertyStats?.monthlyRevenue != null
                  ? formatMoney(propertyStats.monthlyRevenue, defaults.currency)
                  : "N/D"}
              </span>
            </div>
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
          <Link className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-secondary-2" href="/landlord/properties">
            Annuler
          </Link>
          <FormSubmitButton
            className="rounded-lg px-6 text-sm shadow-sm"
            disabled={pending}
          >
            {pending ? "Enregistrement..." : mode === "create" ? "Enregistrer le bien" : "Enregistrer la configuration"}
          </FormSubmitButton>
        </div>
      </div>
    </AppForm>
  );
}

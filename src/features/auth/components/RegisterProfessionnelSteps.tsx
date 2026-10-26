import { useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { FileText, MapPin, LocateFixed, Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "@/shared/lib/toast";
import { METIERS } from "@/features/demandes/lib/metiers";
import { SENEGAL_ZONES } from "../lib/senegalZones";
import {
  DOCUMENTS_BY_METIER,
  SPECIALITES_BY_METIER,
  type RequiredDocument,
} from "../lib/professionalConfig";
import type { RegisterProfessionnelValues } from "../schema/registerProfessionnel.schema";
import { Field, PasswordInput, ToggleChip } from "./RegisterProFields";
import { INPUT_CLASS, toggleInList } from "../lib/registerFormHelpers";

type Form = UseFormReturn<RegisterProfessionnelValues>;
interface StepProps {
  form: Form;
}

const SELECT_TRIGGER_CLASS =
  "h-10 w-full rounded-lg border-ink/10 bg-white px-3 text-sm focus-visible:border-signal focus-visible:ring-signal/20";

/* ── Étape 1 ─────────────────────────────────────────────────── */

export function StepAccount({ form }: StepProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
        <Field
          label="Prénom"
          htmlFor="prenom"
          required
          error={errors.prenom?.message}
        >
          <Input
            id="prenom"
            autoComplete="given-name"
            placeholder="Ex : Ousmane"
            className={INPUT_CLASS}
            {...register("prenom")}
          />
        </Field>
        <Field label="Nom" htmlFor="nom" required error={errors.nom?.message}>
          <Input
            id="nom"
            autoComplete="family-name"
            placeholder="Ex : Diop"
            className={INPUT_CLASS}
            {...register("nom")}
          />
        </Field>
      </div>

      <Field
        label="Numéro de téléphone"
        htmlFor="telephone"
        required
        error={errors.telephone?.message}
      >
        <div className="flex">
          <span className="flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 border-ink/10 bg-navy/5 px-3 text-xs font-semibold text-navy">
            SN +221
          </span>
          <Input
            id="telephone"
            type="tel"
            autoComplete="tel-national"
            placeholder="77 123 45 67"
            className={`${INPUT_CLASS} rounded-l-none`}
            {...register("telephone")}
          />
        </div>
      </Field>

      <Field
        label="Adresse email professionnelle ou personnelle"
        htmlFor="email"
        required
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nom.prenom@exemple.com"
          className={INPUT_CLASS}
          {...register("email")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
        <Field
          label="Mot de passe"
          htmlFor="password"
          required
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("password")}
          />
        </Field>
        <Field
          label="Confirmation"
          htmlFor="confirmPassword"
          required
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
        </Field>
      </div>
      <p className="-mt-2 text-xs text-navy/40">
        Au moins 8 caractères avec 1 chiffre et 1 symbole.
      </p>
    </div>
  );
}

/* ── Étape 2 ─────────────────────────────────────────────────── */

export function StepProfile({ form }: StepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;
  const metier = watch("metier");
  const isJuriste = metier === "JURISTE_CONSEIL";

  return (
    <div className="space-y-5">
      <Field
        label="Type de professionnel"
        upper
        required
        error={errors.metier?.message}
      >
        <Controller
          name="metier"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {METIERS.map(({ value, label, icon: Icon }) => {
                const selected = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      field.onChange(value);
                      // la liste des spécialités dépend du métier : on repart de zéro
                      setValue("specialites", []);
                      clearErrors("specialites");
                    }}
                    className={`relative flex h-20 flex-col items-center justify-center gap-2 rounded-xl border text-xs font-medium transition-colors ${
                      selected
                        ? "border-signal bg-signal/5 text-ink"
                        : "border-ink/10 bg-white text-navy/60 hover:border-ink/25"
                    }`}
                  >
                    {selected && (
                      <span className="absolute top-2 right-2 size-1.5 rounded-full bg-signal" />
                    )}
                    <span
                      className={`flex size-7 items-center justify-center rounded-full ${selected ? "bg-signal/10 text-signal" : "bg-navy/5 text-navy/50"}`}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
      </Field>

      <Field
        label="Numéro professionnel / matricule"
        htmlFor="numeroOrdre"
        upper
        required={!isJuriste}
        error={errors.numeroOrdre?.message}
      >
        <Input
          id="numeroOrdre"
          placeholder="Ex. 10482/SN"
          className={INPUT_CLASS}
          {...register("numeroOrdre")}
        />
      </Field>

      <Field
        label="Spécialités (sélectionnez une ou plusieurs mentions)"
        upper
        required
        error={errors.specialites?.message}
      >
        <Controller
          name="specialites"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {!metier && (
                <p className="col-span-full text-xs text-navy/40">
                  Choisissez d'abord un type de professionnel.
                </p>
              )}
              {metier &&
                SPECIALITES_BY_METIER[metier].map((s) => (
                  <ToggleChip
                    key={s}
                    selected={field.value.includes(s)}
                    onClick={() => field.onChange(toggleInList(field.value, s))}
                  >
                    {s}
                  </ToggleChip>
                ))}
            </div>
          )}
        />
      </Field>
    </div>
  );
}

/* ── Étape 3 ─────────────────────────────────────────────────── */

function DocumentRow({ doc, form }: { doc: RequiredDocument; form: Form }) {
  const files = form.watch(doc.field) as FileList | undefined;
  const fileName = files?.[0]?.name;
  const error = form.formState.errors[doc.field]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-navy/60">
          {doc.label}
        </span>
        <span
          className={`text-[11px] ${doc.required ? "font-medium text-signal" : "text-navy/40"}`}
        >
          {doc.required ? "Obligatoire" : "Facultatif"}
        </span>
      </div>

      <div
        className={`flex items-center gap-3 rounded-xl border border-dashed bg-white px-4 py-3 ${error ? "border-red-400" : "border-ink/20"}`}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy/5 text-navy/50">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">
            {fileName ?? doc.label}
          </p>
          <p className="text-xs text-navy/40">
            {fileName ? "Fichier sélectionné" : doc.hint}
          </p>
        </div>
        <label
          htmlFor={doc.field}
          className="shrink-0 cursor-pointer rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink/5"
        >
          {fileName ? "Remplacer" : "Parcourir les fichiers"}
        </label>
        <input
          id={doc.field}
          type="file"
          accept="application/pdf,image/png,image/jpeg"
          className="sr-only"
          {...form.register(doc.field)}
        />
      </div>
      <p className="text-xs text-navy/40">PDF, JPG ou PNG — 5 Mo max.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function StepDocuments({ form }: StepProps) {
  const metier = form.watch("metier");
  if (!metier) return null;

  const config = DOCUMENTS_BY_METIER[metier];
  const declarationError = form.formState.errors.declarationHonneur?.message;

  return (
    <div className="space-y-5">
      {config.documents.map((doc) => (
        <DocumentRow key={doc.field} doc={doc} form={form} />
      ))}

      {config.declaration && (
        <div className="space-y-1.5">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 ${
              declarationError ? "border-red-400" : "border-ink/10"
            }`}
          >
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-signal"
              {...form.register("declarationHonneur")}
            />
            <span className="text-sm leading-relaxed text-ink/80">
              {config.declaration}
            </span>
          </label>
          {declarationError && (
            <p className="text-xs text-red-600">{declarationError}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Étape 4 ─────────────────────────────────────────────────── */

function formatCoords(lat: number, lng: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

export function StepLocation({ form }: StepProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const lat = watch("latitude");
  const lng = watch("longitude");
  const hasPosition = lat !== undefined && lng !== undefined;
  const [recherche, setRecherche] = useState(false);

  // Pas de préfixe « use » : ce n'est pas un hook
  function utiliserMaPosition() {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil");
      return;
    }
    setRecherche(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
        setRecherche(false);
        toast.success("Position enregistrée");
      },
      () => {
        setRecherche(false);
        toast.error(
          "Impossible d'obtenir votre position",
          "Autorisez la localisation dans votre navigateur.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-4">
      <Field label="Zone d'intervention" required error={errors.region?.message}>
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                <SelectValue placeholder="Choisissez une région" />
              </SelectTrigger>
              <SelectContent>
                {SENEGAL_ZONES.map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field
        label="Adresse professionnelle / Siège du cabinet"
        htmlFor="adresse"
        required
        error={errors.adresse?.message}
      >
        <Input
          id="adresse"
          placeholder="Rue, quartier, repère…"
          className={INPUT_CLASS}
          {...register("adresse")}
        />
      </Field>

      {/* Position : carte mise en avant, hauteur stable entre les états */}
      <div
        className={`rounded-xl border p-4 transition-colors ${
          hasPosition
            ? "border-emerald-200 bg-linear-to-br from-emerald-50 to-white"
            : "border-signal/25 bg-linear-to-br from-signal/8 to-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-full ${
              hasPosition
                ? "bg-emerald-100 text-emerald-600"
                : "bg-signal/15 text-signal"
            }`}
          >
            {hasPosition ? (
              <Check className="size-5" strokeWidth={2.5} />
            ) : (
              <MapPin className="size-5" />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy">
              {hasPosition ? "Position enregistrée" : "Localisez votre cabinet"}
            </p>
            <p className="mt-0.5 min-h-8 text-xs leading-snug text-navy/60">
              {hasPosition ? (
                <>
                  Coordonnées :{" "}
                  <span className="font-mono">{formatCoords(lat, lng)}</span>
                </>
              ) : (
                "Elle permet d'orienter vers vous les justiciables de votre ressort."
              )}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={utiliserMaPosition}
          disabled={recherche}
          variant={hasPosition ? "outline" : "default"}
          className={`mt-3 h-11 w-full gap-2 rounded-lg text-sm font-semibold ${
            hasPosition
              ? "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
              : "bg-signal text-white shadow-lg shadow-signal/25 hover:bg-signal/90"
          }`}
        >
          {recherche ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Localisation en cours…
            </>
          ) : (
            <>
              <LocateFixed className="size-4" aria-hidden />
              {hasPosition
                ? "Actualiser ma position"
                : "Utiliser ma position actuelle"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
import { Controller, type UseFormReturn } from "react-hook-form";
import { FileText, MapPin, LocateFixed, Check } from "lucide-react";
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
  EXPERIENCE_RANGES,
  LANGUES,
  MODALITES_FACTURATION,
  ORGANISMES_BY_METIER,
  SPECIALITES_BY_METIER,
  getInscriptionYears,
  type RequiredDocument,
} from "../lib/professionalConfig";
import {
  BIO_MAX_LENGTH,
  type RegisterProfessionnelValues,
} from "../schema/registerProfessionnel.schema";
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
      <div className="grid grid-cols-2 gap-3">
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

      <div className="grid grid-cols-2 gap-3">
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
  const years = getInscriptionYears();

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
                      // les listes dépendent du métier : on repart de zéro
                      setValue("organisme", "");
                      setValue("specialites", []);
                      clearErrors(["organisme", "specialites"]);
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

      <div className="grid gap-3 sm:grid-cols-2">
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
          label="Barreau / Chambre / Organisme"
          upper
          required={!isJuriste}
          error={errors.organisme?.message}
        >
          <Controller
            name="organisme"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!metier}
              >
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue
                    placeholder={
                      metier ? "Sélectionnez" : "Choisissez d'abord un type"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(metier ? ORGANISMES_BY_METIER[metier] : []).map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Année d'inscription"
          upper
          required
          error={errors.anneeInscription?.message}
        >
          <Controller
            name="anneeInscription"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field
          label="Années d'expérience"
          upper
          required
          error={errors.anneesExperience?.message}
        >
          <Controller
            name="anneesExperience"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_RANGES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

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

  function useMyPosition() {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("latitude", pos.coords.latitude);
        setValue("longitude", pos.coords.longitude);
        toast.success("Position enregistrée");
      },
      () =>
        toast.error(
          "Impossible d'obtenir votre position",
          "Autorisez la localisation dans votre navigateur.",
        ),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-navy/60">
          <MapPin className="size-3.5 text-signal" />
          Où exercez-vous principalement ?{" "}
          <span className="text-signal">*</span>
        </span>
        <button
          type="button"
          onClick={useMyPosition}
          className="flex items-center gap-1.5 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5"
        >
          <LocateFixed className="size-3.5 text-signal" />
          Utiliser ma position actuelle
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Région" required error={errors.region?.message}>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                  <SelectValue placeholder="Région" />
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
        {/* TODO : passer en Select en cascade quand le référentiel département/commune sera disponible */}
        <Field
          label="Ville / Département"
          htmlFor="ville"
          required
          error={errors.ville?.message}
        >
          <Input
            id="ville"
            placeholder="Ex. Dakar"
            className={INPUT_CLASS}
            {...register("ville")}
          />
        </Field>
        <Field
          label="Commune / Zone"
          htmlFor="commune"
          required
          error={errors.commune?.message}
        >
          <Input
            id="commune"
            placeholder="Ex. Parcelles Assainies"
            className={INPUT_CLASS}
            {...register("commune")}
          />
        </Field>
      </div>

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

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-ink">
            Repérage cartographique &amp; rayon d'intervention
          </span>
          {lat !== undefined && lng !== undefined && (
            <span className="font-mono text-[10px] text-navy/40">
              Coordonnées : {formatCoords(lat, lng)}
            </span>
          )}
        </div>
        {hasPosition && (
          <p className="flex items-center gap-1.5 text-xs text-navy/60">
            <Check className="size-3.5 text-emerald-600" />
            Position enregistrée
            <span className="font-mono text-[10px] text-navy/40">
              ({formatCoords(lat, lng)})
            </span>
          </p>
        )}
        <p className="text-xs italic text-navy/40">
          Cette localisation permettra d'orienter les justiciables situés dans
          votre ressort territorial de compétence.
        </p>
      </div>
    </div>
  );
}

/* ── Étape 5 ─────────────────────────────────────────────────── */

export function StepPresentation({ form }: StepProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;
  const bioLength = watch("biographie")?.length ?? 0;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="biographie"
            className="text-[11px] font-semibold uppercase tracking-wide text-navy/60"
          >
            Biographie / Présentation professionnelle{" "}
            <span className="text-signal">*</span>
          </label>
          <span className="text-[11px] text-navy/40">
            {bioLength} / {BIO_MAX_LENGTH.toLocaleString("fr-FR")} caractères
          </span>
        </div>
        <p className="text-xs text-navy/40">
          Parlez brièvement de votre parcours, de votre expérience et de vos
          domaines de compétence principaux.
        </p>
        <textarea
          id="biographie"
          rows={4}
          maxLength={BIO_MAX_LENGTH}
          className="w-full resize-none rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm outline-none focus-visible:border-signal focus-visible:ring-3 focus-visible:ring-signal/20"
          {...register("biographie")}
        />
        {errors.biographie && (
          <p className="text-xs text-red-600">{errors.biographie.message}</p>
        )}
      </div>

      <Field
        label="Langues parlées"
        upper
        required
        error={errors.langues?.message}
        hint="Sélectionnez les langues dans lesquelles vous pouvez conseiller ou échanger avec les justiciables."
      >
        <Controller
          name="langues"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LANGUES.map((l) => (
                <ToggleChip
                  key={l}
                  shape="circle"
                  selected={field.value.includes(l)}
                  onClick={() => field.onChange(toggleInList(field.value, l))}
                >
                  {l}
                </ToggleChip>
              ))}
            </div>
          )}
        />
      </Field>

      <div className="space-y-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-navy/60">
            Honoraires et tarifs indicatifs (optionnel)
          </p>
          <p className="mt-1 text-xs text-navy/40">
            Tarif indicatif de consultation initiale — seulement si votre modèle
            d'exercice le prévoit (respect du code de déontologie).
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Tarif consultation initiale"
            htmlFor="tarifConsultation"
            error={errors.tarifConsultation?.message}
          >
            <div className="relative">
              <Input
                id="tarifConsultation"
                inputMode="numeric"
                placeholder="35 000"
                className={`${INPUT_CLASS} pr-14`}
                {...register("tarifConsultation")}
              />
              <span className="absolute inset-y-0 right-3 flex items-center text-xs text-navy/40">
                FCFA
              </span>
            </div>
          </Field>
          <Field label="Modalité de facturation">
            <Controller
              name="modaliteFacturation"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={SELECT_TRIGGER_CLASS}>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALITES_FACTURATION.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Contact, Loader2, Mail, User } from "lucide-react";
import { toast } from "@/shared/lib/toast";
import {
  modifierProfilSchema,
  type ModifierProfilValues,
} from "../schema/modifierProfil.schema";
import { useModifierProfil } from "../hooks/useProfil";
import {
  useCommunesDeRegion,
  useRegions,
} from "../hooks/useReferentielsProfil";
import { profilRoutes } from "../lib/profilRoutes";
import type { ProfilParticulier } from "../types/profil.types";
import { ZoneAutocomplete } from "./ZoneAutocomplete";

const INPUT =
  "h-13 w-full rounded-xl border border-ink/10 bg-white px-4 pr-12 text-[15px] text-ink shadow-sm outline-none transition placeholder:text-ink/30 focus:border-signal/60 focus:ring-2 focus:ring-signal/20 aria-invalid:border-red-400 disabled:opacity-60";

interface ChampProps {
  id: string;
  label: string;
  facultatif?: boolean;
  /** Message d'aide, remplacé par l'erreur quand il y en a une */
  aide?: string;
  erreur?: string;
  children: React.ReactNode;
}

function Champ({ id, label, facultatif, aide, erreur, children }: ChampProps) {
  return (
    <div>
      <label htmlFor={id} className="text-[15px] font-semibold text-navy">
        {label}
        {facultatif && (
          <span className="font-normal text-ink/50"> (Facultatif)</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {/* Hauteur réservée : 2 lignes quand il y a un texte d'aide, 1 sinon */}
      <p
        role={erreur ? "alert" : undefined}
        className={`mt-1.5 text-[13px] leading-snug ${
          aide ? "min-h-10" : "min-h-5"
        } ${erreur ? "text-red-600" : "text-ink/55"}`}
      >
        {erreur ?? aide}
      </p>
    </div>
  );
}

function IconeDroite({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink/35"
    >
      {children}
    </span>
  );
}

export function MesInformationsForm({ profil }: { profil: ProfilParticulier }) {
  const navigate = useNavigate();
  const { mutateAsync: modifier, isPending } = useModifierProfil();
  const idBase = useId();

  const form = useForm<ModifierProfilValues>({
    resolver: zodResolver(modifierProfilSchema),
    defaultValues: {
      prenom: profil.prenom,
      nom: profil.nom,
      email: profil.email ?? "",
      regionId: profil.regionId,
      communeId: profil.communeId,
    },
  });
  const { errors, isDirty } = form.formState;

  const regionId = form.watch("regionId");
  const { data: regions = [] } = useRegions();
  const { data: communes = [], isLoading: chargementCommunes } =
    useCommunesDeRegion(regionId);

  const onSubmit = form.handleSubmit(async (values) => {
    // Rien n'a changé : pas d'appel inutile
    if (!isDirty) {
      navigate(profilRoutes.accueil);
      return;
    }
    try {
      await modifier({
        prenom: values.prenom.trim(),
        nom: values.nom.trim(),
        email: values.email.trim() === "" ? null : values.email.trim(),
        regionId: values.regionId,
        communeId: values.communeId,
      });
      toast.success("Informations enregistrées.");
      navigate(profilRoutes.accueil, { replace: true });
    } catch {
      toast.error("Impossible d'enregistrer. Réessayez.");
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <Champ id={`${idBase}-prenom`} label="Prénom" erreur={errors.prenom?.message}>
        <div className="relative">
          <input
            id={`${idBase}-prenom`}
            autoComplete="given-name"
            aria-invalid={!!errors.prenom}
            disabled={isPending}
            className={INPUT}
            {...form.register("prenom")}
          />
          <IconeDroite>
            <Contact className="size-5" />
          </IconeDroite>
        </div>
      </Champ>

      <Champ id={`${idBase}-nom`} label="Nom" erreur={errors.nom?.message}>
        <div className="relative">
          <input
            id={`${idBase}-nom`}
            autoComplete="family-name"
            aria-invalid={!!errors.nom}
            disabled={isPending}
            className={INPUT}
            {...form.register("nom")}
          />
          <IconeDroite>
            <User className="size-5" />
          </IconeDroite>
        </div>
      </Champ>

      <Champ
        id={`${idBase}-email`}
        label="Adresse e-mail"
        facultatif
        aide="Utilisée seulement pour vous envoyer un récapitulatif de vos demandes."
        erreur={errors.email?.message}
      >
        <div className="relative">
          <input
            id={`${idBase}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            disabled={isPending}
            className={INPUT}
            {...form.register("email")}
          />
          <IconeDroite>
            <Mail className="size-5" />
          </IconeDroite>
        </div>
      </Champ>

      <Champ id={`${idBase}-region`} label="Région">
        <Controller
          control={form.control}
          name="regionId"
          render={({ field }) => (
            <div className="relative">
              <select
                id={`${idBase}-region`}
                disabled={isPending}
                value={field.value ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  field.onChange(v === "" ? null : Number(v));
                  // Une autre région : la zone choisie n'a plus de sens
                  form.setValue("communeId", null, { shouldDirty: true });
                }}
                className={`${INPUT} appearance-none`}
              >
                <option value="">Choisir une région</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </select>
              <IconeDroite>
                <ChevronDown className="size-5 text-ink/60" />
              </IconeDroite>
            </div>
          )}
        />
      </Champ>

      <Champ
        id={`${idBase}-zone`}
        label="Zone / Quartier habituel"
        aide="Nous ne demandons pas votre adresse exacte. Cette zone sert seulement si vous ne partagez pas votre position."
      >
        <Controller
          control={form.control}
          name="communeId"
          render={({ field }) => (
            <ZoneAutocomplete
              id={`${idBase}-zone`}
              communes={communes}
              value={field.value}
              onChange={(id) => field.onChange(id)}
              disabled={isPending || regionId === null}
              chargement={chargementCommunes}
            />
          )}
        />
      </Champ>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Enregistrement…
          </>
        ) : (
          <>
            <Check className="size-5" aria-hidden />
            Enregistrer
          </>
        )}
      </button>
    </form>
  );
}
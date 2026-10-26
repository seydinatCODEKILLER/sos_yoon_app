import { useId } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Check, Contact, Loader2, Mail, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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

// Même gabarit pour tous les champs (Input et SelectTrigger)
const CHAMP =
  "h-13 w-full rounded-xl border-ink/10 bg-white px-4 text-[15px] text-ink shadow-sm focus-visible:border-signal/60 focus-visible:ring-2 focus-visible:ring-signal/20 aria-invalid:border-red-400";

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
      <Label htmlFor={id} className="text-[15px] font-semibold text-navy">
        {label}
        {facultatif && (
          <span className="font-normal text-ink/50"> (Facultatif)</span>
        )}
      </Label>
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

  const regionId = useWatch({ control: form.control, name: "regionId" });
  const { data: regions = [] } = useRegions();
  const { data: communes = [], isLoading: chargementCommunes } =
    useCommunesDeRegion(regionId);

  // Select travaille avec des chaînes : on associe valeur et libellé
  const optionsRegions = regions.map((r) => ({
    value: String(r.id),
    label: r.nom,
  }));

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
      <Champ
        id={`${idBase}-prenom`}
        label="Prénom"
        erreur={errors.prenom?.message}
      >
        <div className="relative">
          <Input
            id={`${idBase}-prenom`}
            autoComplete="given-name"
            aria-invalid={!!errors.prenom}
            disabled={isPending}
            className={`${CHAMP} pr-12`}
            {...form.register("prenom")}
          />
          <IconeDroite>
            <Contact className="size-5" />
          </IconeDroite>
        </div>
      </Champ>

      <Champ id={`${idBase}-nom`} label="Nom" erreur={errors.nom?.message}>
        <div className="relative">
          <Input
            id={`${idBase}-nom`}
            autoComplete="family-name"
            aria-invalid={!!errors.nom}
            disabled={isPending}
            className={`${CHAMP} pr-12`}
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
          <Input
            id={`${idBase}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            disabled={isPending}
            className={`${CHAMP} pr-12`}
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
            <Select
              items={optionsRegions}
              value={field.value === null ? null : String(field.value)}
              disabled={isPending}
              onValueChange={(v) => {
                field.onChange(v === null ? null : Number(v));
                // Une autre région : la zone choisie n'a plus de sens
                form.setValue("communeId", null, { shouldDirty: true });
              }}
            >
              <SelectTrigger
                id={`${idBase}-region`}
                className={`${CHAMP} data-[size=default]:h-13`}
              >
                <SelectValue placeholder="Choisir une région" />
              </SelectTrigger>
              <SelectContent>
                {optionsRegions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-14 w-full rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] hover:bg-signal/90"
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
      </Button>
    </form>
  );
}

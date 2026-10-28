import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { useModifierProfilAdmin } from "../hooks/useParametresAdmin";
import { LIBELLE_NIVEAU, PRIVILEGES_PAR_NIVEAU, sansIndicatif } from "../lib/parametres";
import { initiales } from "../lib/formatAdmin";
import { profilAdminSchema, type ProfilAdminValeurs } from "../schema/parametresAdmin.schema";
import type { ProfilAdmin } from "../types/parametres.types";

export const ID_FORMULAIRE_PROFIL_ADMIN = "profil-admin-form";

interface Props {
  profil: ProfilAdmin;
  onEtat: (e: { modifie: boolean; enCours: boolean }) => void;
}

const valeursDe = (p: ProfilAdmin): ProfilAdminValeurs => ({
  prenom: p.prenom,
  nom: p.nom,
  telephone: sansIndicatif(p.telephone),
});

export function ProfilAdminForm({ profil, onEtat }: Props) {
  const { mutate, isPending, isSuccess, error } = useModifierProfilAdmin();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfilAdminValeurs>({
    resolver: zodResolver(profilAdminSchema),
    defaultValues: valeursDe(profil),
  });

  useEffect(() => onEtat({ modifie: isDirty, enCours: isPending }), [isDirty, isPending, onEtat]);

  const nomComplet = `${profil.prenom} ${profil.nom}`;

  function envoyer(v: ProfilAdminValeurs) {
    mutate(
      {
        prenom: v.prenom.trim(),
        nom: v.nom.trim(),
        telephone: `+221${v.telephone.replace(/\s/g, "")}`,
      },
      { onSuccess: (p) => reset(valeursDe(p)) },
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-lg font-semibold">Profil administrateur</h2>
          <p className="text-sm text-muted-foreground">
            Informations personnelles et rôle au sein de l'instance SOS Yoon Sénégal.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Compte actif
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-muted/50 p-5 sm:flex-row sm:items-center">
        <span className="grid size-20 shrink-0 place-items-center rounded-full bg-navy text-2xl font-semibold text-white">
          {initiales(nomComplet)}
        </span>
        <div className="min-w-0 space-y-2">
          <div>
            <p className="text-lg font-semibold">{nomComplet}</p>
            <p className="text-sm text-muted-foreground">{LIBELLE_NIVEAU[profil.niveau]}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Privilèges accordés :
            </span>
            {PRIVILEGES_PAR_NIVEAU[profil.niveau].map((p) => (
              <span key={p} className="rounded-md border border-border bg-card px-2 py-0.5 text-xs">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <form
        id={ID_FORMULAIRE_PROFIL_ADMIN}
        onSubmit={handleSubmit(envoyer)}
        noValidate
        className="mt-6 grid gap-5 sm:grid-cols-2"
      >
        <Champ label="Prénom" erreur={errors.prenom?.message}>
          <Input id="prenom" autoComplete="given-name" {...register("prenom")} aria-invalid={!!errors.prenom} />
        </Champ>
        <Champ label="Nom de famille" erreur={errors.nom?.message}>
          <Input id="nom" autoComplete="family-name" {...register("nom")} aria-invalid={!!errors.nom} />
        </Champ>

        <Champ label="Adresse e-mail administrative" note="Non modifiable">
          <Input id="email" value={profil.email} readOnly disabled />
        </Champ>

        <Champ label="Numéro mobile sécurisé" erreur={errors.telephone?.message}>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 shrink-0 items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
              SN +221
            </span>
            <Input
              id="telephone"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="77 123 45 67"
              {...register("telephone")}
              aria-invalid={!!errors.telephone}
            />
          </div>
        </Champ>

        <div className="sm:col-span-2" aria-live="polite">
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {(error as { message?: string }).message ?? "Impossible d'enregistrer le profil."}
            </p>
          )}
          {isSuccess && !isDirty && (
            <p className={cn("inline-flex items-center gap-1.5 text-sm text-emerald-600")}>
              <Check className="size-4" /> Modifications enregistrées.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

function Champ({
  label,
  erreur,
  note,
  children,
}: {
  label: string;
  erreur?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
        {note && <span className="text-[11px] text-muted-foreground">{note}</span>}
      </div>
      {children}
      {erreur && <p className="text-xs text-destructive">{erreur}</p>}
    </div>
  );
}
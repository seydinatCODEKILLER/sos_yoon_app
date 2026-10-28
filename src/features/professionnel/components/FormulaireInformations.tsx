import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useMettreAJourProfil } from "../hooks/useProfil";
import { LIBELLE_PROFESSION } from "../lib/profil";
import { profilProSchema, type ProfilProValues } from "../schema/profilPro.schema";
import type { ProfilPro } from "../types/profil.types";

const versValues = (p: ProfilPro): ProfilProValues => ({
  prenom: p.prenom,
  nom: p.nom,
  telephone: p.telephone.replace(/^\+221/, ""),
  adresseCabinet: p.adresseCabinet ?? "",
});

function Champ({
  id,
  libelle,
  erreur,
  children,
}: {
  id: string;
  libelle: string;
  erreur?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-ink">
        {libelle}
      </Label>
      {children}
      {erreur && (
        <p role="alert" className="text-sm text-red-600">
          {erreur}
        </p>
      )}
    </div>
  );
}

function Lecture({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-wide text-ink/50 uppercase">{libelle}</dt>
      <dd className="text-sm font-medium text-ink">{valeur}</dd>
    </div>
  );
}

const carte = "space-y-4 rounded-xl border border-ink/10 bg-white p-5";

export function FormulaireInformations({ profil }: { profil: ProfilPro }) {
  const maj = useMettreAJourProfil();
  const form = useForm<ProfilProValues>({
    resolver: zodResolver(profilProSchema),
    defaultValues: versValues(profil),
  });
  const { errors, isDirty } = form.formState;

  async function enregistrer(v: ProfilProValues) {
    maj.reset();
    try {
      const national = v.telephone.replace(/\D/g, "").replace(/^221/, "");
      const miseAJour = await maj.mutateAsync({
        prenom: v.prenom,
        nom: v.nom,
        telephone: `+221${national}`,
        adresseCabinet: v.adresseCabinet.trim(),
      });
      form.reset(versValues(miseAJour)); // remet "modifié" à zéro
    } catch {
      /* l'erreur est lue via maj.error */
    }
  }

  return (
    <form onSubmit={form.handleSubmit(enregistrer)} noValidate className="space-y-5">
      <section className={carte}>
        <h3 className="text-base font-bold text-ink">Identité</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Champ id="pf-prenom" libelle="Prénom" erreur={errors.prenom?.message}>
            <Input id="pf-prenom" aria-invalid={!!errors.prenom} {...form.register("prenom")} />
          </Champ>
          <Champ id="pf-nom" libelle="Nom" erreur={errors.nom?.message}>
            <Input id="pf-nom" aria-invalid={!!errors.nom} {...form.register("nom")} />
          </Champ>
          <Champ id="pf-tel" libelle="Numéro de téléphone" erreur={errors.telephone?.message}>
            <div className="flex">
              <span className="flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 border-ink/10 bg-navy/5 px-3 text-xs font-semibold text-navy">
                SN +221
              </span>
              <Input
                id="pf-tel"
                type="tel"
                autoComplete="tel-national"
                placeholder="77 123 45 67"
                aria-invalid={!!errors.telephone}
                className="rounded-l-none"
                {...form.register("telephone")}
              />
            </div>
          </Champ>
        </div>

        <dl className="grid grid-cols-1 gap-4 border-t border-ink/10 pt-4 sm:grid-cols-3">
          <Lecture libelle="E-mail" valeur={profil.email} />
          <Lecture libelle="Métier" valeur={LIBELLE_PROFESSION[profil.typeProfession]} />
          {profil.matricule && <Lecture libelle="Matricule" valeur={profil.matricule} />}
        </dl>
        <p className="text-xs text-ink/50">
          L'e-mail, le métier et le matricule ne sont pas modifiables. Contactez le support en cas d'erreur.
        </p>
      </section>

      <section className={carte}>
        <h3 className="text-base font-bold text-ink">Cabinet</h3>
        <Champ
          id="pf-adresse"
          libelle="Adresse professionnelle / Siège du cabinet"
          erreur={errors.adresseCabinet?.message}
        >
          <Input
            id="pf-adresse"
            placeholder="Rue, quartier, repère…"
            aria-invalid={!!errors.adresseCabinet}
            {...form.register("adresseCabinet")}
          />
        </Champ>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {maj.isError && (
          <p role="alert" className="flex items-center gap-2 text-sm text-red-600 sm:mr-auto">
            <CircleAlert className="size-4" aria-hidden />
            {(maj.error as Partial<ApiErreur>).message ?? "Enregistrement impossible."}
          </p>
        )}
        {maj.isSuccess && !isDirty && (
          <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 sm:mr-auto">
            <CircleCheck className="size-4" aria-hidden />
            Modifications enregistrées.
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || maj.isPending}
          onClick={() => {
            form.reset(versValues(profil));
            maj.reset();
          }}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || maj.isPending}
          className="bg-signal font-semibold text-white hover:bg-signal/90"
        >
          {maj.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
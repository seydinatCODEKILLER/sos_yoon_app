import { useState } from "react";
import { Check, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/lib/toast";
import { useModifierParametre, useParametresPlateforme } from "../hooks/useParametresAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import { erreurValeurParametre, grouperParametres, metaParametre } from "../lib/parametres";
import type { ParametreAdmin } from "../types/parametres.types";

export function ParametresPlateformeAdmin() {
  const { data, isError, refetch } = useParametresPlateforme();

  if (isError) {
    return (
      <p className="text-sm text-muted-foreground">
        Impossible de charger les paramètres.{" "}
        <button onClick={() => refetch()} className="font-medium text-signal underline">Réessayer</button>
      </p>
    );
  }
  if (!data) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-muted" />)}
      </div>
    );
  }
  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun paramètre n'est configuré sur la plateforme.</p>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Chaque modification prend effet immédiatement pour les prochaines opérations et est inscrite au journal d'audit.
      </p>
      {grouperParametres(data).map((g) => (
        <section key={g.titre} className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="border-b border-border pb-4 text-lg font-semibold">{g.titre}</h2>
          <ul className="divide-y divide-border">
            {g.parametres.map((p) => (
              // La clé change avec la valeur enregistrée : la saisie repart de la valeur du serveur.
              <LigneParametre key={`${p.cle}:${p.valeur}`} parametre={p} />
            ))}
          </ul>
        </section>
      ))}
      <LienAudit />
    </div>
  );
}

function LigneParametre({ parametre }: { parametre: ParametreAdmin }) {
  const meta = metaParametre(parametre);
  const [saisie, setSaisie] = useState(parametre.valeur);
  const [touche, setTouche] = useState(false);
  const { mutate, isPending, error, reset } = useModifierParametre();

  const modifie = saisie.trim() !== parametre.valeur;
  const erreurLocale = erreurValeurParametre(parametre.valeur, saisie);
  const erreur = touche && erreurLocale ? erreurLocale : error ? messageAdmin(error, "Enregistrement impossible.") : null;
  const idChamp = `param-${parametre.cle}`;

  function enregistrer() {
    setTouche(true);
    if (erreurLocale || !modifie) return;
    mutate(
      { cle: parametre.cle, valeur: saisie.trim() },
      { onSuccess: () => toast.success("Paramètre enregistré", meta.libelle) },
    );
  }

  return (
    <li className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor={idChamp} className="text-sm font-medium">{meta.libelle}</Label>
          {!meta.applique && (
            <span
              title="La valeur est enregistrée mais le serveur ne la lit pas encore."
              className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
            >
              Pas encore appliqué
            </span>
          )}
        </div>
        {parametre.description && meta.libelle !== parametre.description && (
          <p className="text-xs text-muted-foreground">{parametre.description}</p>
        )}
        <p className="break-all font-mono text-[11px] text-muted-foreground/70">{parametre.cle}</p>
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          enregistrer();
        }}
        className="space-y-2 sm:w-72"
      >
        <div className="flex items-center gap-2">
          <Input
            id={idChamp}
            value={saisie}
            inputMode="numeric"
            aria-invalid={!!erreur}
            onChange={(e) => {
              setSaisie(e.target.value);
              if (error) reset();
            }}
            onBlur={() => setTouche(true)}
          />
          {meta.unite && <span className="w-24 shrink-0 text-xs text-muted-foreground">{meta.unite}</span>}
        </div>
        {erreur && (
          <p role="alert" className="text-xs text-destructive">
            {erreur}
          </p>
        )}
        {modifie && (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => {
                setSaisie(parametre.valeur);
                setTouche(false);
                reset();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              <Check className="size-4" /> {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        )}
      </form>
    </li>
  );
}

function LienAudit() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Qui a changé quoi, et quand : retrouvez chaque modification de paramètre dans le journal d'audit.
      </p>
      <Button variant="outline" onClick={() => navigate("/admin/audit?typeCible=PARAMETRE")} className="shrink-0">
        <History className="size-4" /> Voir les modifications
      </Button>
    </div>
  );
}
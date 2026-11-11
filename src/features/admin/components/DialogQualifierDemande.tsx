import { useState } from "react";
import { Info, Wrench } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useMatieres, useQualifierDemande } from "../hooks/useDemandesAdmin";
import { LIBELLE_PRESTATION, URGENCES } from "../lib/demande";
import { messageAdmin } from "../lib/erreursAdmin";
import { METIERS_PRO } from "../lib/professionnels";
import type { DemandeAdmin, NiveauUrgence, PrestationRecommandee } from "../types/demandes.types";
import type { TypeProfession } from "../types/professionnels.types";

interface Props {
  cible: DemandeAdmin | null;
  onFermer: () => void;
}

export function DialogQualifierDemande({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

const METIERS = Object.keys(METIERS_PRO) as TypeProfession[];
const NIVEAUX = Object.keys(URGENCES) as NiveauUrgence[];
const SANS_PRESTATION = "AUCUNE";
const ITEMS_PRESTATION = [
  { value: SANS_PRESTATION, label: "Non précisée" },
  ...(Object.keys(LIBELLE_PRESTATION) as PrestationRecommandee[]).map((p) => ({
    value: p,
    label: LIBELLE_PRESTATION[p],
  })),
];

function Formulaire({ cible, onFermer }: { cible: DemandeAdmin; onFermer: () => void }) {
  const { data: matieres = [], isLoading: chargementMatieres, isError: erreurMatieres } = useMatieres(true);
  const { mutate, isPending, error } = useQualifierDemande();

  const [matiereId, setMatiereId] = useState("");
  const [metiers, setMetiers] = useState<string[]>(() => cible.metiers.filter((m) => m in METIERS_PRO));
  const [urgence, setUrgence] = useState<NiveauUrgence | "">(() =>
    cible.niveauUrgence && cible.niveauUrgence in URGENCES ? (cible.niveauUrgence as NiveauUrgence) : "",
  );
  const [prestation, setPrestation] = useState<string>(SANS_PRESTATION);

  const valide = matiereId !== "" && metiers.length > 0 && urgence !== "";

  function basculerMetier(m: string) {
    setMetiers((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
  }

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
          <Wrench className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Qualifier la demande</DialogTitle>
          <DialogDescription>
            Demande <strong className="font-semibold text-foreground tabular-nums">{cible.reference ?? "sans référence"}</strong>
            {cible.citoyen?.nomComplet ? ` de ${cible.citoyen.nomComplet}` : ""}.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className="flex gap-2.5 rounded-xl border border-signal/25 bg-signal/5 p-3.5 text-[13px] leading-relaxed text-foreground/80">
          <Info className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />
          Une fois qualifiée, la demande repart automatiquement à la recherche d'un professionnel.
        </div>

        <div className="space-y-2">
          <Label>
            Matière juridique <span className="text-destructive">*</span>
          </Label>
          <Select
            value={matiereId}
            onValueChange={(v) => setMatiereId(v ?? "")}
            items={matieres.map((m) => ({ value: m.id, label: m.libelle }))}
          >
            <SelectTrigger className="w-full" disabled={chargementMatieres || erreurMatieres}>
              <SelectValue placeholder={chargementMatieres ? "Chargement…" : "Choisir une matière"} />
            </SelectTrigger>
            <SelectContent>
              {matieres.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {erreurMatieres && (
            <p role="alert" className="text-xs text-destructive">
              Impossible de charger les matières. Fermez la fenêtre et réessayez.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label id="label-metiers">
            Professions concernées <span className="text-destructive">*</span>
          </Label>
          <div role="group" aria-labelledby="label-metiers" className="flex flex-wrap gap-2">
            {METIERS.map((m) => {
              const actif = metiers.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => basculerMetier(m)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal/50",
                    actif
                      ? "border-navy bg-navy text-white"
                      : "border-border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  <span className={cn("size-2 rounded-sm", actif ? "bg-white" : METIERS_PRO[m].pastille)} aria-hidden />
                  {METIERS_PRO[m].libelle}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label id="label-urgence">
            Niveau d'urgence <span className="text-destructive">*</span>
          </Label>
          <div
            role="group"
            aria-labelledby="label-urgence"
            className="inline-flex gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5"
          >
            {NIVEAUX.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={urgence === n}
                onClick={() => setUrgence(n)}
                className={cn(
                  "h-8 rounded-md px-4 text-[13px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal/50",
                  urgence === n ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {URGENCES[n].libelle}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Type de rendez-vous recommandé <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Select value={prestation} onValueChange={(v) => setPrestation(v ?? SANS_PRESTATION)} items={ITEMS_PRESTATION}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PRESTATION.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, "Impossible de qualifier cette demande.")}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          disabled={!valide || isPending}
          onClick={() =>
            mutate(
              {
                id: cible.id,
                payload: {
                  matiereId,
                  metiers,
                  niveauUrgence: urgence as NiveauUrgence,
                  prestationRecommandee:
                    prestation === SANS_PRESTATION ? undefined : (prestation as PrestationRecommandee),
                },
              },
              { onSuccess: onFermer },
            )
          }
        >
          {isPending ? "En cours…" : "Qualifier et relancer la recherche"}
        </Button>
      </DialogFooter>
    </>
  );
}
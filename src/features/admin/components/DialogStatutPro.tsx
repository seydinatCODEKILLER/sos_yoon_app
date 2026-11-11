import { useState, type ReactNode } from "react";
import { Ban, Check, Info, TriangleAlert } from "lucide-react";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { useChangerStatutPro, useDossiersEnCours, useMotifsPro } from "../hooks/useProfessionnelsAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import { formaterDate } from "../lib/professionnels";
import type { CiblePro } from "../types/professionnels.types";

interface Props {
  cible: CiblePro | null;
  onFermer: () => void;
}

export function DialogStatutPro({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

interface Variante {
  icone: ReactNode;
  titre: string;
  verbe: string;
  libelleMotif: string;
  libelleObservations: string;
  placeholder: string;
  libelleAction: string;
  iconeAction: ReactNode;
  tuile: string;
  encart: string;
  titreEncart: string;
  bouton: string;
  consequences: (email: string) => { titre: string; lignes: string[] };
}

const DESACTIVATION: Variante = {
  icone: <TriangleAlert className="size-5" aria-hidden />,
  titre: "Désactiver ce compte ?",
  verbe: "désactiver",
  libelleMotif: "Motif de la désactivation",
  libelleObservations: "Observations ou références du dossier",
  placeholder: "Ex : procès-verbal du conseil de discipline n°…",
  libelleAction: "Désactiver le compte",
  iconeAction: <Ban className="size-4" aria-hidden />,
  tuile: "bg-rose-50 text-rose-600 dark:bg-rose-500/10",
  encart: "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10",
  titreEncart: "text-rose-700 dark:text-rose-400",
  bouton: "bg-rose-600 text-white hover:bg-rose-700",
  consequences: (email) => ({
    titre: "Ce qui change immédiatement :",
    lignes: [
      "Le professionnel n'a plus accès à la plateforme ni à ses notifications.",
      "Ses dossiers en cours restent à réaffecter : la liste vous sera présentée ensuite.",
      `Une notification officielle lui est envoyée à ${email}.`,
    ],
  }),
};

const REACTIVATION: Variante = {
  icone: <Check className="size-5" aria-hidden />,
  titre: "Réactiver ce compte ?",
  verbe: "réactiver",
  libelleMotif: "Motif de la réactivation",
  libelleObservations: "Observations ou références de la levée de suspension",
  placeholder: "Ex : PV de réintégration de l'Ordre n°…",
  libelleAction: "Réactiver le compte",
  iconeAction: <Check className="size-4" aria-hidden />,
  tuile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  encart: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
  titreEncart: "text-emerald-700 dark:text-emerald-400",
  bouton: "bg-emerald-600 text-white hover:bg-emerald-700",
  consequences: (email) => ({
    titre: "Ce qui change immédiatement :",
    lignes: [
      "Le professionnel retrouve l'accès à la plateforme et à son espace.",
      "Il réapparaît dans le répertoire et peut de nouveau recevoir des sollicitations.",
      `Un e-mail de réactivation est envoyé à ${email}.`,
    ],
  }),
};

function Formulaire({ cible, onFermer }: { cible: CiblePro; onFermer: () => void }) {
  const v = cible.suspendu ? REACTIVATION : DESACTIVATION;
  const { data: motifs = [] } = useMotifsPro(cible.suspendu ? "REACTIVATION_PRO" : "DESACTIVATION_PRO");
  const { mutate, isPending, error } = useChangerStatutPro();
  const [motifId, setMotifId] = useState("");
  const [observations, setObservations] = useState("");
  // Renseigné après une désactivation qui laisse des dossiers à réaffecter.
  const [dossiersALister, setDossiersALister] = useState(0);

  if (dossiersALister > 0) {
    return <DossiersARepartir cible={cible} nombre={dossiersALister} onFermer={onFermer} />;
  }

  const { titre: titreEncart, lignes } = v.consequences(cible.email ?? "son adresse e-mail");

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", v.tuile)}>{v.icone}</span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">{v.titre}</DialogTitle>
          <DialogDescription>
            Vous allez {v.verbe} le compte de{" "}
            <strong className="font-semibold text-foreground">{cible.nomComplet}</strong>.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className={cn("rounded-xl border p-4", v.encart)}>
          <p className={cn("flex items-center gap-2 text-sm font-semibold", v.titreEncart)}>
            <Info className="size-4 shrink-0" aria-hidden /> {titreEncart}
          </p>
          <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-foreground/80">
            {lignes.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label>
            {v.libelleMotif} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={motifId}
            onValueChange={(val) => setMotifId(val ?? "")}
            items={motifs.map((m) => ({ value: m.id, label: m.libelle }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un motif" />
            </SelectTrigger>
            <SelectContent>
              {motifs.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations-pro">
            {v.libelleObservations} <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Textarea
            id="observations-pro"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={v.placeholder}
            className="resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error)}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          className={v.bouton}
          disabled={!motifId || isPending}
          onClick={() =>
            mutate(
              {
                id: cible.id,
                action: cible.suspendu ? "reactiver" : "desactiver",
                payload: { motifId, observations: observations.trim() },
              },
              {
                onSuccess: (res) => {
                  const restants = res.dossiersEnCours ?? 0;
                  if (restants > 0) setDossiersALister(restants);
                  else onFermer();
                },
              },
            )
          }
        >
          {v.iconeAction}
          {isPending ? "En cours…" : v.libelleAction}
        </Button>
      </DialogFooter>
    </>
  );
}

/** Étape 2 : le compte est désactivé, on montre ce qui reste à réaffecter. */
function DossiersARepartir({ cible, nombre, onFermer }: { cible: CiblePro; nombre: number; onFermer: () => void }) {
  const { data, isLoading, isError } = useDossiersEnCours(cible.id, true);

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10">
          <TriangleAlert className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Compte désactivé</DialogTitle>
          <DialogDescription>
            {cible.nomComplet} a {nombre} dossier{nombre > 1 ? "s" : ""} en cours à réaffecter.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="max-h-72 space-y-2 overflow-y-auto px-6 pb-6">
        {isLoading && <div className="h-20 animate-pulse rounded-xl bg-muted" />}
        {isError && (
          <p className="text-sm text-muted-foreground">
            Impossible de charger la liste des dossiers. Retrouvez-les dans la section Demandes.
          </p>
        )}
        {data?.map((d) => (
          <div key={d.demandeId} className="rounded-xl bg-muted/60 p-3 text-sm">
            <p className="font-medium">{d.titre ?? "Demande sans titre"}</p>
            <p className="text-xs text-muted-foreground">
              {[d.reference, d.citoyen, d.dateAcceptation ? `acceptée le ${formaterDate(d.dateAcceptation)}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        ))}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button onClick={onFermer}>Terminer</Button>
      </DialogFooter>
    </>
  );
}
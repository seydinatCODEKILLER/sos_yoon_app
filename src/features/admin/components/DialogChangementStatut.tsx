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
import { toast } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/utils";
import { useChangerStatutUtilisateur, useMotifsUtilisateur } from "../hooks/useUtilisateursAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import type { CibleUtilisateur } from "../types/utilisateurs.types";

interface Props {
  cible: CibleUtilisateur | null;
  onFermer: () => void;
}

export function DialogChangementStatut({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* key : réinitialise le formulaire à chaque utilisateur */}
        {cible && <Formulaire key={cible.id} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

interface Variante {
  icone: ReactNode;
  iconeAction: ReactNode;
  titre: string;
  verbe: string;
  libelleMotif: string;
  libelleObservations: string;
  placeholder: string;
  libelleAction: string;
  tuile: string;
  encart: string;
  titreEncart: string;
  bouton: string;
  consequences: (c: CibleUtilisateur) => { titre: string; lignes: string[] };
}

const sms = (c: CibleUtilisateur) =>
  c.telephone ? `Un SMS sera envoyé au ${c.telephone}.` : "Aucun numéro de téléphone : seule la notification sera envoyée.";

const VARIANTES: Record<"desactivation" | "reactivation", Variante> = {
  desactivation: {
    icone: <TriangleAlert className="size-5" aria-hidden />,
    iconeAction: <Ban className="size-4" aria-hidden />,
    titre: "Désactiver ce compte ?",
    verbe: "désactiver",
    libelleMotif: "Motif de la désactivation",
    libelleObservations: "Observations ou références administratives",
    placeholder: "Ex : signalement reçu via le support n°SY-TICK-482 pour tentative de falsification…",
    libelleAction: "Désactiver le compte",
    tuile: "bg-rose-50 text-rose-600 dark:bg-rose-500/10",
    encart: "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10",
    titreEncart: "text-rose-700 dark:text-rose-400",
    bouton: "bg-rose-600 text-white hover:bg-rose-700",
    consequences: (c) => ({
      titre: "Ce qui change tout de suite :",
      lignes: [
        "Le citoyen est déconnecté de tous ses appareils et ne peut plus se connecter ni déposer de demande.",
        "Ses demandes et ses dossiers sont conservés.",
        `Il est prévenu par notification. ${sms(c)}`,
      ],
    }),
  },
  reactivation: {
    icone: <Check className="size-5" aria-hidden />,
    iconeAction: <Check className="size-4" aria-hidden />,
    titre: "Réactiver ce compte ?",
    verbe: "réactiver",
    libelleMotif: "Motif de la réactivation",
    libelleObservations: "Observations ou références de la levée de suspension",
    placeholder: "Ex : justificatif d'identité validé ou confirmation du service conformité…",
    libelleAction: "Réactiver le compte",
    tuile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
    encart: "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
    titreEncart: "text-emerald-700 dark:text-emerald-400",
    bouton: "bg-emerald-600 text-white hover:bg-emerald-700",
    consequences: (c) => ({
      titre: "Ce qui change tout de suite :",
      lignes: [
        "Le citoyen peut de nouveau se connecter et déposer des demandes.",
        "Ses demandes et ses dossiers sont à nouveau accessibles.",
        `Il est prévenu par notification. ${sms(c)}`,
      ],
    }),
  },
};

function Formulaire({ cible, onFermer }: { cible: CibleUtilisateur; onFermer: () => void }) {
  const reactivation = cible.desactive;
  const v = VARIANTES[reactivation ? "reactivation" : "desactivation"];
  const { data: motifs = [], isLoading: motifsEnChargement } = useMotifsUtilisateur(
    reactivation ? "REACTIVATION_USER" : "DESACTIVATION_USER",
  );
  const { mutate, isPending, error } = useChangerStatutUtilisateur();
  const [motifId, setMotifId] = useState("");
  const [observations, setObservations] = useState("");

  const { titre: titreEncart, lignes } = v.consequences(cible);

  function envoyer() {
    mutate(
      {
        id: cible.id,
        action: reactivation ? "reactiver" : "desactiver",
        payload: { motifId, observations: observations.trim() },
      },
      {
        onSuccess: () => {
          toast.success(
            reactivation ? "Compte réactivé" : "Compte désactivé",
            reactivation
              ? `${cible.nomComplet} peut de nouveau se connecter.`
              : `${cible.nomComplet} ne peut plus se connecter.`,
          );
          onFermer();
        },
      },
    );
  }

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
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground/80">
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
            <SelectTrigger className="w-full" disabled={isPending}>
              <SelectValue placeholder={motifsEnChargement ? "Chargement…" : "Choisir un motif"} />
            </SelectTrigger>
            <SelectContent>
              {motifs.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.libelle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!motifsEnChargement && motifs.length === 0 && (
            <p className="text-xs text-destructive">Aucun motif n'est configuré : l'action est impossible pour l'instant.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations-statut">
            {v.libelleObservations} <span className="font-normal text-muted-foreground">(facultatif)</span>
          </Label>
          <Textarea
            id="observations-statut"
            rows={3}
            maxLength={1000}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={v.placeholder}
            disabled={isPending}
            className="resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, `Impossible de ${v.verbe} ce compte.`)}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button className={v.bouton} disabled={!motifId || isPending} onClick={envoyer}>
          {v.iconeAction}
          {isPending ? "En cours…" : v.libelleAction}
        </Button>
      </DialogFooter>
    </>
  );
}
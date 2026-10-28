import { useState } from "react";
import { Ban, Check, Info, TriangleAlert, type LucideIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/lib/utils";
import {
  useChangerStatutUtilisateur,
  useMotifsAdmin,
} from "../hooks/useUtilisateursAdmin";
import { estActif } from "../lib/utilisateurs";
import type { UtilisateurAdmin } from "../types/utilisateurs.types";

interface Props {
  utilisateur: UtilisateurAdmin | null;
  onFermer: () => void;
}

export function DialogChangementStatut({ utilisateur, onFermer }: Props) {
  return (
    <Dialog open={!!utilisateur} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {/* key : réinitialise le formulaire à chaque utilisateur */}
        {utilisateur && (
          <Formulaire
            key={utilisateur.id}
            utilisateur={utilisateur}
            onFermer={onFermer}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface Variante {
  icone: LucideIcon;
  titre: string;
  libelleMotif: string;
  libelleObservations: string;
  placeholder: string;
  libelleAction: string;
  iconeAction: LucideIcon;
  tuile: string;
  encart: string;
  titreEncart: string;
  bouton: string;
  consequences: (u: UtilisateurAdmin) => { titre: string; lignes: string[] };
}

const VARIANTES: Record<"desactivation" | "reactivation", Variante> = {
  desactivation: {
    icone: TriangleAlert,
    titre: "Confirmer la désactivation du compte",
    libelleMotif: "Motif réglementaire de désactivation",
    libelleObservations: "Observations ou références administratives",
    placeholder:
      "Ex : Signalement reçu via le support n°SY-TICK-482 pour tentative de falsification de justificatif d'identité…",
    libelleAction: "Désactiver le compte",
    iconeAction: Ban,
    tuile: "bg-rose-50 text-rose-600 dark:bg-rose-500/10",
    encart:
      "border-rose-200 bg-rose-50 dark:border-rose-500/20 dark:bg-rose-500/10",
    titreEncart: "text-rose-700 dark:text-rose-400",
    bouton: "bg-rose-600 text-white hover:bg-rose-700",
    consequences: (u) => ({
      titre: "Conséquences immédiates de la suspension :",
      lignes: [
        "L'utilisateur ne pourra plus se connecter à l'application mobile SOS YOON ni soumettre de nouvelles demandes juridiques.",
        "Ses dossiers et consultations en cours restent archivés, mais les notifications push seront suspendues.",
        `Une notification officielle par SMS sera transmise au ${u.telephone}.`,
      ],
    }),
  },
  reactivation: {
    icone: Check,
    titre: "Confirmer la réactivation du compte",
    libelleMotif: "Motif de la réactivation",
    libelleObservations: "Observations ou références de la levée de suspension",
    placeholder:
      "Ex : Justificatif d'identité validé ou confirmation par le service conformité…",
    libelleAction: "Réactiver le compte",
    iconeAction: Check,
    tuile: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
    encart:
      "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
    titreEncart: "text-emerald-700 dark:text-emerald-400",
    bouton: "bg-emerald-600 text-white hover:bg-emerald-700",
    consequences: (u) => ({
      titre: "Conséquences immédiates de la réactivation :",
      lignes: [
        "Le citoyen recouvrera immédiatement l'accès à son compte mobile SOS YOON et à ses démarches en ligne.",
        "Ses dossiers en cours, notifications d'audiences et consultations juridiques seront entièrement réactivés.",
        `Un SMS de confirmation sera transmis au ${u.telephone}.`,
      ],
    }),
  },
};

function Formulaire({
  utilisateur,
  onFermer,
}: {
  utilisateur: UtilisateurAdmin;
  onFermer: () => void;
}) {
  const desactivation = estActif(utilisateur.statutCompte);
  const v = VARIANTES[desactivation ? "desactivation" : "reactivation"];
  const { data: motifs = [] } = useMotifsAdmin(
    desactivation ? "DESACTIVATION" : "REACTIVATION",
  );
  const { mutate, isPending, error } = useChangerStatutUtilisateur();
  const [motifId, setMotifId] = useState("");
  const [observations, setObservations] = useState("");

  const { titre: titreEncart, lignes } = v.consequences(utilisateur);
  const nom = `${utilisateur.prenom} ${utilisateur.nom}`;
  const Icone = v.icone;
  const IconeAction = v.iconeAction;

  function envoyer() {
    mutate(
      {
        id: utilisateur.id,
        action: desactivation ? "desactiver" : "reactiver",
        payload: { motifId, observations: observations.trim() },
      },
      { onSuccess: onFermer },
    );
  }

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-xl",
            v.tuile,
          )}
        >
          <Icone className="size-5" />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">{v.titre}</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir{" "}
            {desactivation ? "désactiver" : "réactiver"} le compte citoyen de{" "}
            <strong className="font-semibold text-foreground">{nom}</strong> ?
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className={cn("rounded-xl border p-4", v.encart)}>
          <p
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              v.titreEncart,
            )}
          >
            <Info className="size-4 shrink-0" /> {titreEncart}
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
          <Label htmlFor="observations">
            {v.libelleObservations}{" "}
            <span className="font-normal text-muted-foreground">
              (optionnel)
            </span>
          </Label>
          <Textarea
            id="observations"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={v.placeholder}
            className="resize-none"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {(error as { message?: string }).message ??
              "Une erreur est survenue."}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        {" "}
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          className={v.bouton}
          disabled={!motifId || isPending}
          onClick={envoyer}
        >
          <IconeAction className="size-4" />
          {isPending ? "En cours…" : v.libelleAction}
        </Button>
      </DialogFooter>
    </>
  );
}

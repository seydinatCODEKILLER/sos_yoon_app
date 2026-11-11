import { useState } from "react";
import { FileWarning, Info, X } from "lucide-react";
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
import { useMotifsPro, useRejeterDossier } from "../hooks/useProfessionnelsAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import { LIBELLE_DOCUMENT } from "../lib/professionnels";
import type { CibleRefus, TypeDocument } from "../types/professionnels.types";

interface Props {
  cible: CibleRefus | null;
  onFermer: () => void;
}

export function DialogRefusDossier({ cible, onFermer }: Props) {
  return (
    <Dialog open={!!cible} onOpenChange={(o) => !o && onFermer()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        {cible && <Formulaire key={cible.dossierId} cible={cible} onFermer={onFermer} />}
      </DialogContent>
    </Dialog>
  );
}

const CONSEQUENCES = [
  "Le professionnel reçoit un e-mail avec le motif, la pièce en cause et votre commentaire.",
  "Il peut corriger son dossier et le soumettre de nouveau.",
  "Son compte reste inactif tant qu'un dossier n'est pas approuvé.",
];

function Formulaire({ cible, onFermer }: { cible: CibleRefus; onFermer: () => void }) {
  // Le motif de refus d'un dossier d'inscription est de type REJET_PRO (spec 13.33).
  const { data: motifs = [] } = useMotifsPro("REJET_PRO");
  const { mutate, isPending, error } = useRejeterDossier();
  const [motifId, setMotifId] = useState("");
  const [piece, setPiece] = useState<TypeDocument | "">("");
  const [commentaire, setCommentaire] = useState("");

  // Une seule pièce de chaque type par dossier : on évite les doublons dans la liste.
  const pieces = cible.documents.filter((d, i, tous) => tous.findIndex((x) => x.type === d.type) === i);
  const valide = motifId !== "" && piece !== "" && commentaire.trim().length >= 5;

  return (
    <>
      <DialogHeader className="flex-row items-start gap-4 p-6 pb-4 pr-12 text-left">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10">
          <FileWarning className="size-5" aria-hidden />
        </span>
        <div className="space-y-1">
          <DialogTitle className="text-lg">Refuser ce dossier d'inscription ?</DialogTitle>
          <DialogDescription>
            Vous allez refuser le dossier de{" "}
            <strong className="font-semibold text-foreground">{cible.nomComplet}</strong>.
          </DialogDescription>
        </div>
      </DialogHeader>

      <div className="space-y-5 px-6 pb-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-400">
            <Info className="size-4 shrink-0" aria-hidden /> Ce qui se passe ensuite :
          </p>
          <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-foreground/80">
            {CONSEQUENCES.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <Label>
            Motif du refus <span className="text-destructive">*</span>
          </Label>
          <Select
            value={motifId}
            onValueChange={(v) => setMotifId(v ?? "")}
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
          <Label>
            Pièce en cause <span className="text-destructive">*</span>
          </Label>
          <Select
            value={piece}
            onValueChange={(v) => setPiece((v ?? "") as TypeDocument | "")}
            items={pieces.map((d) => ({ value: d.type, label: LIBELLE_DOCUMENT[d.type] ?? d.type }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir la pièce concernée" />
            </SelectTrigger>
            <SelectContent>
              {pieces.map((d) => (
                <SelectItem key={d.id} value={d.type}>
                  {LIBELLE_DOCUMENT[d.type] ?? d.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commentaire-refus">
            Commentaire pour le professionnel <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="commentaire-refus"
            rows={3}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Ex : carte expirée ou illisible, merci d'envoyer une copie récente."
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">5 caractères minimum.</p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {messageAdmin(error, "Impossible de refuser ce dossier.")}
          </p>
        )}
      </div>

      <DialogFooter className="m-0 flex-row justify-end gap-3 rounded-none border-t border-border bg-muted/40 px-6 py-5">
        <Button variant="ghost" onClick={onFermer} disabled={isPending}>
          Annuler
        </Button>
        <Button
          className="bg-rose-600 text-white hover:bg-rose-700"
          disabled={!valide || isPending}
          onClick={() =>
            mutate(
              {
                dossierId: cible.dossierId,
                payload: { motifId, pieceEnCause: piece as TypeDocument, commentaire: commentaire.trim() },
              },
              { onSuccess: onFermer },
            )
          }
        >
          <X className="size-4" aria-hidden />
          {isPending ? "En cours…" : "Refuser le dossier"}
        </Button>
      </DialogFooter>
    </>
  );
}
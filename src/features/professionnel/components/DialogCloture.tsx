import { useState } from "react";
import { CircleAlert, FolderCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface FormulaireClotureProps {
  enCours: boolean;
  erreur: string | null;
  onAnnuler: () => void;
  onConfirmer: (commentaire: string) => void;
}

function FormulaireCloture({ enCours, erreur, onAnnuler, onConfirmer }: FormulaireClotureProps) {
  const [commentaire, setCommentaire] = useState("");

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onConfirmer(commentaire.trim());
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="commentaire-cloture" className="text-sm font-medium text-ink">
          Commentaire de clôture <span className="font-normal text-ink/50">(facultatif)</span>
        </Label>
        <Textarea
          id="commentaire-cloture"
          rows={3}
          maxLength={500}
          disabled={enCours}
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          placeholder="Résumé de la mission, suite donnée…"
        />
      </div>

      {erreur && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {erreur}
        </p>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          disabled={enCours}
          onClick={onAnnuler}
          className="h-11 rounded-lg text-sm font-semibold"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={enCours}
          className="h-11 rounded-lg bg-navy text-sm font-semibold text-white hover:bg-navy/90"
        >
          <FolderCheck className="size-4" aria-hidden />
          {enCours ? "Clôture…" : "Clôturer le dossier"}
        </Button>
      </div>
    </form>
  );
}

interface DialogClotureProps {
  ouvert: boolean;
  reference: string;
  nomClient: string;
  enCours: boolean;
  erreur: string | null;
  onFermer: () => void;
  onConfirmer: (commentaire: string) => void;
}

export function DialogCloture({
  ouvert,
  reference,
  nomClient,
  enCours,
  erreur,
  onFermer,
  onConfirmer,
}: DialogClotureProps) {
  return (
    <Dialog
      open={ouvert}
      onOpenChange={(o) => {
        if (!o && !enCours) onFermer();
      }}
    >
      <DialogContent className="gap-4 sm:max-w-lg">
        <div className="space-y-2">
          <DialogTitle className="text-lg font-bold text-ink">
            Clôturer le dossier {reference} ?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-ink/65">
            La demande de <strong className="text-ink">{nomClient}</strong> passera à « Terminée ».
            Le client pourra ensuite donner son avis sur votre accompagnement.
          </DialogDescription>
        </div>
        {/* Le formulaire est démonté à la fermeture : le commentaire est vidé */}
        {ouvert && (
          <FormulaireCloture
            enCours={enCours}
            erreur={erreur}
            onAnnuler={onFermer}
            onConfirmer={onConfirmer}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
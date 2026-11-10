import { useRef, useState, type ChangeEvent } from "react";
import { CircleAlert, FileText, FolderCheck, Paperclip, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { TAILLE_MAX_COMPTE_RENDU, formaterTaille } from "../lib/dossier";

interface FormulaireClotureProps {
  enCours: boolean;
  erreur: string | null;
  onAnnuler: () => void;
  onConfirmer: (commentaire: string, compteRendu: File | null) => void;
}

function FormulaireCloture({ enCours, erreur, onAnnuler, onConfirmer }: FormulaireClotureProps) {
  const [commentaire, setCommentaire] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [erreurFichier, setErreurFichier] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function choisir(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "application/pdf") return setErreurFichier("Joignez un fichier PDF.");
    if (f.size > TAILLE_MAX_COMPTE_RENDU) return setErreurFichier("10 Mo maximum.");
    setErreurFichier(null);
    setFichier(f);
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onConfirmer(commentaire.trim(), fichier);
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
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentaire(e.target.value)}
          placeholder="Résumé de la mission, suite donnée…"
        />
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-ink">
          Compte rendu <span className="font-normal text-ink/50">(PDF, facultatif)</span>
        </p>
        {fichier ? (
          <div className="flex items-center gap-3 rounded-lg border border-ink/10 bg-ink/3 px-3 py-2">
            <FileText className="size-4 shrink-0 text-signal" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{fichier.name}</p>
              <p className="text-[11px] text-ink/55">{formaterTaille(fichier.size)}</p>
            </div>
            <button
              type="button"
              disabled={enCours}
              onClick={() => setFichier(null)}
              aria-label="Retirer le compte rendu"
              className="grid size-7 place-items-center rounded-md text-ink/55 outline-none hover:bg-ink/8 focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={enCours}
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/20 px-3 py-3 text-sm font-medium text-ink/65 outline-none hover:border-signal hover:text-signal focus-visible:ring-2 focus-visible:ring-signal disabled:opacity-60"
          >
            <Paperclip className="size-4" aria-hidden />
            Joindre un compte rendu
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={choisir}
        />
        {erreurFichier ? (
          <p role="alert" className="text-xs text-red-600">
            {erreurFichier}
          </p>
        ) : (
          <p className="text-xs text-ink/55">Le client pourra le télécharger depuis sa demande.</p>
        )}
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
  onConfirmer: (commentaire: string, compteRendu: File | null) => void;
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
            Le client pourra ensuite donner son avis sur votre accompagnement. Cette action est
            définitive.
          </DialogDescription>
        </div>
        {/* Le formulaire est démonté à la fermeture : commentaire et fichier sont vidés */}
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
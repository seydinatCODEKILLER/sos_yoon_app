import { useRef, useState } from "react";
import { FileUp, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { TypeDocumentPro } from "@/features/auth/types/types";
import { useResoumettreDossier } from "../hooks/useDossierPro";

const NOM_PIECE: Record<TypeDocumentPro, string> = {
  CARTE_PRO: "Carte professionnelle",
  DIPLOME: "Diplôme en droit",
  PIECE_IDENTITE: "Pièce d'identité",
};

const TAILLE_MAX = 5 * 1024 * 1024;
const TYPES_ACCEPTES = ["application/pdf", "image/png", "image/jpeg"];

/** Dépôt de la pièce à remplacer, puis renvoi du dossier (POST /pro/inscription/resoumettre) */
export function CorrectionDossier({
  pieceEnCause,
}: {
  pieceEnCause: TypeDocumentPro | null;
}) {
  const resoumettre = useResoumettreDossier();
  const [fichier, setFichier] = useState<File | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [survol, setSurvol] = useState(false);
  const champ = useRef<HTMLInputElement>(null);

  function choisir(f: File | undefined | null) {
    setErreur(null);
    if (!f) return setFichier(null);
    if (f.size > TAILLE_MAX) {
      setFichier(null);
      return setErreur("Ce fichier dépasse 5 Mo. Choisissez-en un plus léger.");
    }
    if (!TYPES_ACCEPTES.includes(f.type)) {
      setFichier(null);
      return setErreur("Format non accepté. Utilisez un PDF, un JPG ou un PNG.");
    }
    setFichier(f);
  }

  // Un rejet qui désigne une pièce exige son remplacement ; sinon le dossier repart tel quel
  const peutEnvoyer = pieceEnCause ? !!fichier : true;

  return (
    <section aria-labelledby="correction-titre" className="mt-6">
      <h2 id="correction-titre" className="text-base font-semibold text-ink">
        Corrigez votre dossier
      </h2>

      {pieceEnCause ? (
        <>
          <p className="mt-1 text-sm text-navy/60">
            Remplacez votre{" "}
            <span className="font-medium text-ink">
              {NOM_PIECE[pieceEnCause]?.toLowerCase() ?? "pièce"}
            </span>{" "}
            par un document lisible et en cours de validité.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setSurvol(true);
            }}
            onDragLeave={() => setSurvol(false)}
            onDrop={(e) => {
              e.preventDefault();
              setSurvol(false);
              choisir(e.dataTransfer.files?.[0]);
            }}
            className={`mt-4 rounded-xl border border-dashed transition-colors ${
              erreur
                ? "border-red-400 bg-red-50/40"
                : survol
                  ? "border-signal bg-signal/5"
                  : "border-ink/20 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => champ.current?.click()}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy/5 text-navy/60">
                <FileUp className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">
                  {fichier?.name ?? "Déposez le fichier ici ou parcourez"}
                </span>
                <span className="block text-xs text-navy/50">
                  PDF, JPG ou PNG, 5 Mo maximum
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-signal">
                {fichier ? "Remplacer" : "Parcourir"}
              </span>
            </button>
            <input
              ref={champ}
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => choisir(e.target.files?.[0])}
            />
          </div>
          {erreur && (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {erreur}
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-sm text-navy/60">
          Aucune pièce n'est désignée. Vérifiez vos informations, puis renvoyez
          votre dossier.
        </p>
      )}

      <Button
        type="button"
        disabled={!peutEnvoyer || resoumettre.isPending}
        onClick={() =>
          resoumettre.mutate(
            pieceEnCause && fichier ? { [pieceEnCause]: fichier } : {},
          )
        }
        className="mt-5 h-12 w-full gap-2 rounded-xl bg-signal text-sm font-semibold text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
      >
        {resoumettre.isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <RotateCw className="size-4" aria-hidden />
        )}
        Renvoyer mon dossier
      </Button>
    </section>
  );
}
import { CircleAlert, Download, FileText } from "lucide-react";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import { CARTE } from "@/shared/lib/styleCarte";
import { useDocumentsDossier } from "../hooks/useDossiers";
import { formaterTaille } from "../lib/dossier";
import { formaterDateCourte } from "../lib/formatDashboard";

/** Documents du dossier : pièces du citoyen et compte rendu déposé à la clôture */
export function DocumentsDossier({ demandeId }: { demandeId: string }) {
  const { data, isError, refetch } = useDocumentsDossier(demandeId);

  return (
    <section aria-label="Documents du dossier" className={`space-y-3 rounded-xl p-5 ${CARTE}`}>
      <h3 className="text-sm font-bold text-ink">
        Documents
        {data && data.length > 0 && <span className="font-normal text-ink/50"> ({data.length})</span>}
      </h3>

      {isError ? (
        <p role="alert" className="flex items-center gap-2 text-xs text-red-700">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          Impossible de charger les documents.
          <button type="button" onClick={() => void refetch()} className="font-semibold underline">
            Réessayer
          </button>
        </p>
      ) : !data ? (
        <div className="h-12 animate-pulse rounded-lg bg-ink/5" />
      ) : data.length === 0 ? (
        <p className="text-xs text-ink/60">
          Aucun document pour le moment. Le compte rendu apparaîtra ici après la clôture du dossier.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10">
          {data.map((f) => {
            const lien = mediaUrl(f.url);
            return (
              <li key={f.id} className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink/5 text-ink/55">
                  <FileText className="size-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{f.nom}</p>
                  <p className="text-[11px] text-ink/55">
                    {formaterTaille(f.tailleOctets)} ·{" "}
                    {f.deposePar === "PROFESSIONNEL" ? "Déposé par vous" : "Déposé par le client"}
                    {f.dateDepot && ` · ${formaterDateCourte(f.dateDepot)}`}
                  </p>
                </div>
                {lien && (
                  <a
                    href={lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={f.nom}
                    aria-label={`Télécharger ${f.nom}`}
                    className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink/10 text-ink/70 outline-none hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-signal"
                  >
                    <Download className="size-4" aria-hidden />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
import { useState } from "react";
import { Check, CircleAlert, Download, FileText, Star } from "lucide-react";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import { useDemandeDetail } from "../hooks/useDemandeDetail";
import { useCompteRendu, useDonnerAvis } from "../hooks/useAvisDemande";
import { COMMENTAIRE_MAX, LIBELLES_NOTE, messageAvis } from "../lib/avis";

const CARTE = "rounded-2xl border border-ink/10 bg-white p-4 shadow-sm";

function CompteRendu({ demandeId }: { demandeId: string }) {
  const { data, isError, isPending, refetch } = useCompteRendu(demandeId, true);
  const lien = mediaUrl(data?.url);

  return (
    <div className={CARTE}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal"
        >
          <FileText className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-navy">Compte rendu de votre dossier</p>
          {data && <p className="truncate text-[13px] text-ink/55">{data.nomFichier}</p>}
          {isError && (
            <p role="alert" className="flex items-center gap-1.5 text-[13px] text-red-600">
              <CircleAlert className="size-3.5 shrink-0" aria-hidden />
              Impossible de le récupérer.
              <button
                type="button"
                onClick={() => void refetch()}
                className="font-semibold underline"
              >
                Réessayer
              </button>
            </p>
          )}
        </div>
      </div>
      {(isPending || lien) && (
        <a
          href={lien ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          download={data?.nomFichier}
          aria-disabled={!lien}
          className={`mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-paper transition hover:bg-navy/90 ${
            lien ? "" : "pointer-events-none opacity-60"
          }`}
        >
          <Download className="size-4" aria-hidden />
          {lien ? "Télécharger le compte rendu" : "Chargement…"}
        </a>
      )}
    </div>
  );
}

function CarteAvis({
  demandeId,
  nomPro,
  avisDonne,
}: {
  demandeId: string;
  nomPro: string | null;
  avisDonne: boolean;
}) {
  const donner = useDonnerAvis(demandeId);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  if (avisDonne || donner.isSuccess) {
    // La note n'est connue ici que si l'avis vient d'être envoyé depuis cet écran
    const donnee = donner.data?.note;
    return (
      <div className={`${CARTE} flex items-center gap-3`}>
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700"
        >
          <Check className="size-5" strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-navy">Merci pour votre avis</p>
          <p className="text-[13px] text-ink/60">
            Il aide d'autres personnes à choisir leur professionnel.
          </p>
          {donnee && (
            <p className="mt-1 flex gap-0.5" aria-label={`Votre note : ${donnee} sur 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  aria-hidden
                  className={`size-4 ${
                    n <= donnee ? "fill-amber-400 text-amber-400" : "text-ink/20"
                  }`}
                />
              ))}
            </p>
          )}
        </div>
      </div>
    );
  }

  function envoyer(e: React.FormEvent) {
    e.preventDefault();
    if (note === 0) return;
    donner.mutate({ note, ...(commentaire.trim() ? { commentaire: commentaire.trim() } : {}) });
  }

  return (
    <form onSubmit={envoyer} noValidate className={`${CARTE} space-y-3`}>
      <div>
        <p className="text-[15px] font-semibold text-navy">
          Comment s'est passé votre échange{nomPro ? ` avec ${nomPro}` : ""} ?
        </p>
        <p className="text-[13px] text-ink/60">Votre note est visible sur son profil.</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div role="radiogroup" aria-label="Votre note" className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={note === n}
              aria-label={`${n} étoile${n > 1 ? "s" : ""} : ${LIBELLES_NOTE[n]}`}
              disabled={donner.isPending}
              onClick={() => setNote(n)}
              className="grid size-11 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-signal/50 disabled:opacity-60"
            >
              <Star
                aria-hidden
                className={`size-7 transition-colors ${
                  n <= note ? "fill-amber-400 text-amber-400" : "text-ink/20"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="min-h-5 text-right text-sm font-semibold text-navy" aria-live="polite">
          {LIBELLES_NOTE[note]}
        </p>
      </div>

      {note > 0 && (
        <div className="space-y-1.5">
          <label htmlFor="avis-commentaire" className="text-sm font-medium text-ink">
            Un commentaire ? <span className="font-normal text-ink/50">(facultatif)</span>
          </label>
          <textarea
            id="avis-commentaire"
            rows={3}
            maxLength={COMMENTAIRE_MAX}
            disabled={donner.isPending}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Réactivité, clarté des explications, écoute…"
            className="w-full resize-none rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus-visible:border-signal focus-visible:ring-3 focus-visible:ring-signal/20 disabled:opacity-60"
          />
          <p className="text-right text-[11px] text-ink/45">
            {commentaire.length} / {COMMENTAIRE_MAX}
          </p>
        </div>
      )}

      {donner.isError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {messageAvis(donner.error)}
        </p>
      )}

      <button
        type="submit"
        disabled={note === 0 || donner.isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-signal text-sm font-semibold text-paper transition hover:brightness-105 disabled:opacity-50"
      >
        {donner.isPending ? "Envoi…" : "Envoyer mon avis"}
      </button>
    </form>
  );
}

interface AvisEtCompteRenduProps {
  demandeId: string;
  /** Nom du professionnel, pour la question posée au citoyen */
  nomPro: string | null;
}

/** Demande terminée : compte rendu à télécharger (s'il existe) et avis à donner (une seule fois) */
export function AvisEtCompteRendu({ demandeId, nomPro }: AvisEtCompteRenduProps) {
  const { data: detail, isError } = useDemandeDetail(demandeId);

  if (isError) return null;
  if (!detail) return <div className="mt-4 h-28 animate-pulse rounded-2xl bg-ink/5" />;

  return (
    <section aria-label="Avis et compte rendu" className="mt-4 space-y-4">
      {detail.compteRenduDisponible && <CompteRendu demandeId={demandeId} />}
      <CarteAvis demandeId={demandeId} nomPro={nomPro} avisDonne={detail.avisDonne} />
    </section>
  );
}
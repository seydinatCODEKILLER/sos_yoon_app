import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, Loader2, Mic, RotateCw } from "lucide-react";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { viderDemandeEnAttente } from "../lib/demandeEnAttente";
import { lireAudio } from "../lib/stockageAudio";
import { useEnvoyerDemande } from "../hooks/useEnvoyerDemande";
import {
  useDemandeEnAttente,
  type DemandeEnAttente,
} from "../store/demandeEnAttente.store";

class AudioIntrouvable extends Error {}

/**
 * Dernière étape du parcours visiteur : le compte vient d'être créé, la demande
 * conservée part en UNE requête (POST /demandes). Pas de brouillon serveur :
 * si l'envoi échoue, rien n'a été créé et « Réessayer » ne peut pas faire de doublon.
 */
export function EnvoiDemandeEnAttentePage() {
  const navigate = useNavigate();
  // Instantané pris à l'arrivée : vider le store pendant l'envoi ne redirige pas la page
  const [demande] = useState(() => useDemandeEnAttente.getState().demande);

  // En cas de succès, useEnvoyerDemande ouvre l'écran de suivi
  const { envoyer, envoyerVocale } = useEnvoyerDemande();
  const demarre = useRef(false);

  const { mutate, isError, error } = useMutation({
    mutationFn: async (d: DemandeEnAttente) => {
      let resultat;
      if (d.type === "ECRITE") {
        resultat = await envoyer({
          description: d.values.description.trim(),
          motsCles: d.values.motsCles,
          localisation: d.localisation,
        });
      } else {
        const fichier = await lireAudio();
        if (!fichier) throw new AudioIntrouvable();
        resultat = await envoyerVocale({
          fichier,
          dureeSecondes: d.dureeSecondes,
          motsCles: d.motsCles ?? [],
          localisation: d.localisation,
        });
      }
      if (!resultat.ok) throw resultat.error;
      await viderDemandeEnAttente();
    },
  });

  // Une seule fois, même en mode développement (StrictMode)
  useEffect(() => {
    if (!demande || demarre.current) return;
    demarre.current = true;
    mutate(demande);
  }, [demande, mutate]);

  // Rien à envoyer (page ouverte directement, ou demande expirée)
  if (!demande) return <Navigate to="/app" replace />;

  const audioPerdu = isError && error instanceof AudioIntrouvable;

  async function abandonner() {
    await viderDemandeEnAttente();
    navigate("/app", { replace: true });
  }

  async function refaireVocal() {
    await viderDemandeEnAttente();
    navigate("/app/demandes/nouvelle", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-md flex-col items-center justify-center px-5 text-center md:min-h-[60dvh]">
      {!isError && (
        <>
          <Loader2 className="size-10 animate-spin text-signal" aria-hidden />
          <h2 className="mt-6 text-[22px] font-bold text-navy">
            Envoi de votre demande…
          </h2>
          <p
            aria-live="polite"
            className="mt-2 min-h-12 text-[15px] leading-snug text-ink/60"
          >
            Un instant, nous la transmettons aux professionnels près de vous.
          </p>
        </>
      )}

      {isError && !audioPerdu && (
        <>
          <span className="grid size-14 place-items-center rounded-full bg-red-50 text-red-600">
            <CircleAlert className="size-7" aria-hidden />
          </span>
          <h2 role="alert" className="mt-6 text-[22px] font-bold text-navy">
            L'envoi n'a pas abouti
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-ink/60">
            {demandeErrorMessage(error)}
            <span className="mt-1 block">
              Votre demande est conservée : vous pouvez réessayer.
            </span>
          </p>
          <button
            type="button"
            onClick={() => mutate(demande)}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105"
          >
            <RotateCw className="size-4" aria-hidden />
            Réessayer
          </button>
          <button
            type="button"
            onClick={() => void abandonner()}
            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-ink/60 hover:underline"
          >
            Abandonner ma demande
          </button>
        </>
      )}

      {audioPerdu && (
        <>
          <span className="grid size-14 place-items-center rounded-full bg-amber-50 text-amber-600">
            <Mic className="size-7" aria-hidden />
          </span>
          <h2 role="alert" className="mt-6 text-[22px] font-bold text-navy">
            Enregistrement introuvable
          </h2>
          <p className="mt-2 text-[15px] leading-snug text-ink/60">
            Votre message vocal n'a pas pu être récupéré. Enregistrez-le à
            nouveau, ou écrivez votre message.
          </p>
          <button
            type="button"
            onClick={() => void refaireVocal()}
            className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105"
          >
            Refaire ma demande
          </button>
        </>
      )}
    </div>
  );
}
import { Navigate } from "react-router-dom";
import { useStatutDossierPro } from "../hooks/useDossierPro";
import { formatDateComplete } from "@/features/demandes/lib/formatDateDemande";
import { BandeauEmail } from "../components/BandeauEmail";
import { CorrectionDossier } from "../components/CorrectionDossier";
import {
  DossierIndisponible,
  FeuilleDossier,
  PiedFeuille,
} from "../components/FeuilleDossier";
import { RailDossier } from "../components/RailDossier";

const ROUTE_ATTENTE = "/pro/validation";

/** Dossier rejeté : le motif, la pièce à remplacer, et le renvoi sur la même page */
export function DemandeRefuseePage() {
  const { data, isPending, isError, refetch } = useStatutDossierPro();

  if (isPending || isError || !data) {
    return <DossierIndisponible erreur={isError} onRetry={() => void refetch()} />;
  }

  // Dossier renvoyé (ou approuvé) : l'écran d'attente prend le relais
  if (data.statut !== "REJETE") return <Navigate to={ROUTE_ATTENTE} replace />;

  const { rejet } = data;

  return (
    <FeuilleDossier teinte="alerte">
      <h1 className="font-display text-3xl leading-tight font-bold text-ink">
        Votre dossier n'a pas été approuvé
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Dossier {data.reference}
        {data.dateTraitement
          ? `, examiné le ${formatDateComplete(data.dateTraitement)}`
          : ""}
      </p>

      <div className="mt-6">
        <RailDossier etapes={data.etapes} statut={data.statut} />
      </div>

      <div
        role="alert"
        className="mt-6 rounded-r-xl border-l-4 border-red-500 bg-red-50/70 py-3 pr-4 pl-4"
      >
        <p className="text-sm font-semibold text-ink">
          {rejet?.motif ?? "Nos équipes n'ont pas pu valider votre dossier."}
        </p>
        {rejet?.commentaire && (
          <p className="mt-1 text-sm leading-relaxed text-navy/70">
            {rejet.commentaire}
          </p>
        )}
      </div>

      {data.resoumissionPossible ? (
        <CorrectionDossier pieceEnCause={rejet?.pieceEnCause ?? null} />
      ) : (
        <p className="mt-6 text-sm text-navy/70">
          Ce dossier ne peut plus être renvoyé depuis l'application. Contactez
          l'équipe SOS Yoon pour connaître la suite.
        </p>
      )}

      <BandeauEmail />

      <PiedFeuille texte="Vous pouvez quitter cette page : votre dossier est conservé. Reconnectez-vous avec votre e-mail pour le corriger plus tard." />
    </FeuilleDossier>
  );
}
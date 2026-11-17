import { Navigate } from "react-router-dom";
import { useStatutDossierPro } from "../hooks/useDossierPro";
import { formatDateComplete } from "@/features/demandes/lib/formatDateDemande";
import { BandeauEmail } from "../components/BandeauEmail";
import { CorrectionDossier } from "../components/CorrectionDossier";
import { DossierIndisponible } from "../components/FeuilleDossier";
import { EcranDossier, PiedPage, Section, Titre } from "../components/EcranDossier";
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
    <EcranDossier scene="refus" legende="Dossier d'inscription">
      <Titre>Votre dossier n'a pas été approuvé</Titre>
      <p className="mt-5 text-base leading-relaxed text-ink/65">
        Dossier {data.reference}
        {data.dateTraitement
          ? `, examiné le ${formatDateComplete(data.dateTraitement)}`
          : ""}
      </p>

      <div className="mt-10">
        <RailDossier etapes={data.etapes} statut={data.statut} />
      </div>

      <Section>
        <div role="alert">
          <h2 className="text-lg font-semibold text-ink">
            {rejet?.motif ?? "Nos équipes n'ont pas pu valider votre dossier."}
          </h2>
          {rejet?.commentaire && (
            <p className="mt-1 text-base leading-relaxed text-ink/65">
              {rejet.commentaire}
            </p>
          )}
        </div>
      </Section>

      {data.resoumissionPossible ? (
        <CorrectionDossier pieceEnCause={rejet?.pieceEnCause ?? null} />
      ) : (
        <p className="mt-10 border-t border-ink/15 pt-6 text-base leading-relaxed text-ink/65">
          Ce dossier ne peut plus être renvoyé depuis l'application. Contactez
          l'équipe SOS Yoon pour connaître la suite.
        </p>
      )}

      <BandeauEmail />

      <PiedPage texte="Vous pouvez quitter cette page : votre dossier est conservé. Reconnectez-vous avec votre e-mail pour le corriger plus tard." />
    </EcranDossier>
  );
}
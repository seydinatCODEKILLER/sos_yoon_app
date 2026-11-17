import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRouteForSession } from "@/shared/lib/getPostLoginRoute";
import { refreshSession } from "@/shared/lib/refreshToken";
import { toast } from "@/shared/lib/toast";
import { formatDateComplete } from "@/features/demandes/lib/formatDateDemande";
import { useStatutDossierPro } from "../hooks/useDossierPro";
import { BandeauEmail } from "../components/BandeauEmail";
import { DossierIndisponible } from "../components/FeuilleDossier";
import { ACTION, EcranDossier, PiedPage, Section, Titre } from "../components/EcranDossier";
import { RailDossier } from "../components/RailDossier";
import { detailEtapeCourante } from "../lib/etapesDossier";

const ROUTE_REFUS = "/pro/demande-refusee";
const ROUTE_VALIDE = "/pro/profil-valide";

/** Dossier d'inscription : en attente d'examen, ou approuvé en attente d'ouverture de l'espace */
export function ValidationDossierPage() {
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useStatutDossierPro();
  const [ouverture, setOuverture] = useState(false);

  if (isPending || isError || !data) {
    return <DossierIndisponible erreur={isError} onRetry={() => void refetch()} />;
  }

  // Une décision négative est tombée pendant que la page était ouverte
  if (data.statut === "REJETE") return <Navigate to={ROUTE_REFUS} replace />;

  const approuve = data.statut === "APPROUVE";
  const detail = detailEtapeCourante(data.etapes, data.statut);

  // Dossier approuvé : on relit la session pour obtenir la portée COMPLET
  async function ouvrirEspace() {
    setOuverture(true);
    try {
      await refreshSession();
      const { user, portee } = useAuthStore.getState();
      if (user && portee === "COMPLET") {
        // Page de bienvenue la première fois, puis tableau de bord
        navigate(ROUTE_VALIDE, { replace: true });
      } else if (user && portee) {
        navigate(getRouteForSession(user.role, portee), { replace: true });
      } else {
        toast.error(
          "Votre accès n'est pas encore activé",
          "Réessayez dans un instant.",
        );
      }
    } finally {
      setOuverture(false);
    }
  }

  return (
    <EcranDossier
      scene={approuve ? "approuve" : "examen"}
      legende="Dossier d'inscription"
    >
      <Titre>
        {approuve ? "Votre dossier est approuvé" : "Votre dossier est en cours d'examen"}
      </Titre>
      <p className="mt-5 text-base leading-relaxed text-ink/65">
        Dossier {data.reference}, envoyé le {formatDateComplete(data.dateSoumission)}
      </p>

      <div className="mt-10">
        <RailDossier etapes={data.etapes} statut={data.statut} />
      </div>

      {approuve ? (
        <Section>
          <h2 className="text-lg font-semibold text-ink">
            Votre espace praticien est prêt.
          </h2>
          <p className="mt-1 text-base leading-relaxed text-ink/65">
            Ouvrez-le pour recevoir vos premières demandes.
          </p>
          <Button
            type="button"
            onClick={() => void ouvrirEspace()}
            disabled={ouverture}
            className={`mt-6 ${ACTION}`}
          >
            Ouvrir mon espace
            {ouverture ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="size-4" aria-hidden />
            )}
          </Button>
        </Section>
      ) : (
        detail && (
          <Section>
            <h2 className="text-lg font-semibold text-ink">{detail.titre}</h2>
            {detail.texte && (
              <p className="mt-1 text-base leading-relaxed text-ink/65">
                {detail.texte}
              </p>
            )}
            <p className="mt-4 flex items-center gap-2 text-sm text-ink/55">
              <Clock className="size-4" aria-hidden />
              Délai moyen : 24 à 48 h ouvrées
            </p>
          </Section>
        )
      )}

      {!approuve && <BandeauEmail />}

      <PiedPage texte="Nous vous écrivons dès qu'une décision est prise. Reconnectez-vous à tout moment avec votre e-mail pour suivre votre dossier." />
    </EcranDossier>
  );
}
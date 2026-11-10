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
import {
  DossierIndisponible,
  FeuilleDossier,
  PiedFeuille,
} from "../components/FeuilleDossier";
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
    <FeuilleDossier teinte="signal">
      <h1 className="font-display text-3xl leading-tight font-bold text-ink">
        {approuve
          ? "Votre dossier est approuvé"
          : "Votre dossier est en cours d'examen"}
      </h1>
      <p className="mt-2 text-sm text-navy/60">
        Dossier {data.reference}, envoyé le {formatDateComplete(data.dateSoumission)}
      </p>

      <div className="mt-6">
        <RailDossier etapes={data.etapes} statut={data.statut} />
      </div>

      {approuve ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p className="text-sm font-semibold text-ink">
            Votre espace praticien est prêt.
          </p>
          <p className="mt-1 text-sm text-navy/70">
            Ouvrez-le pour recevoir vos premières demandes.
          </p>
          <Button
            type="button"
            onClick={() => void ouvrirEspace()}
            disabled={ouverture}
            className="mt-4 h-11 w-full gap-2 rounded-xl bg-signal text-sm font-semibold text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
          >
            {ouverture ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="size-4" aria-hidden />
            )}
            Ouvrir mon espace
          </Button>
        </div>
      ) : (
        detail && (
          <div className="mt-6 rounded-xl bg-ink/5 p-4">
            <p className="text-sm font-semibold text-ink">{detail.titre}</p>
            {detail.texte && (
              <p className="mt-1 text-sm leading-relaxed text-navy/70">
                {detail.texte}
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-xs text-navy/60">
              <Clock className="size-3.5" aria-hidden />
              Délai moyen : 24 à 48 h ouvrées
            </p>
          </div>
        )
      )}

      {!approuve && <BandeauEmail />}

      <PiedFeuille texte="Nous vous écrivons dès qu'une décision est prise. Reconnectez-vous à tout moment avec votre e-mail pour suivre votre dossier." />
    </FeuilleDossier>
  );
}
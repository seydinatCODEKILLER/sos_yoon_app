import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSuiviDemande } from "../hooks/useSuiviDemande";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { SuiviRecherche } from "../components/SuiviRecherche";
import { SuiviAccepte } from "../components/SuiviAccepte";
import { SuiviAucunProfessionnel } from "../components/SuiviAucunProfessionnel";
import { DemandeDetailTerminee } from "../components/DemandeDetailTerminee";
import { estStatutFinal } from "../lib/demandeStatus";

export function SuiviDemandePage() {
  const { id } = useParams<{ id: string }>();
  const { data: suivi, isPending, error } = useSuiviDemande(id);

  let contenu: React.ReactNode;

  if (isPending) {
    contenu = (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2
          className="size-6 animate-spin text-ink/40"
          aria-label="Chargement"
        />
      </div>
    );
  } else if (error || !suivi || !id) {
    contenu = (
      <p role="alert" className="py-24 text-center text-sm text-red-600">
        {demandeErrorMessage(error)}
      </p>
    );
  } else if (estStatutFinal(suivi.statut)) {
    // Terminée, annulée ou restée sans réponse
    contenu = <DemandeDetailTerminee suivi={suivi} demandeId={id} />;
  } else if (suivi.professionnelAffecte) {
    // ACCEPTEE / EN_COURS : un professionnel est affecté
    contenu = (
      <SuiviAccepte
        suivi={suivi}
        pro={suivi.professionnelAffecte}
        demandeId={id}
      />
    );
  } else if (suivi.statut === "RECHERCHE_PROFESSIONNEL") {
    // File épuisée : transmise à l'équipe SOS Yoon
    contenu = <SuiviAucunProfessionnel demandeId={id} suivi={suivi} />;
  } else {
    // Analyse en cours, ou professionnel sollicité (EN_ATTENTE_ACCEPTATION)
    contenu = <SuiviRecherche demandeId={id} suivi={suivi} />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-md flex-col px-5 pt-2 pb-6 md:min-h-0 md:pt-10 md:pb-12">
      {contenu}
    </div>
  );
}
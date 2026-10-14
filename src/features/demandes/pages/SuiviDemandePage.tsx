import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSuiviDemande } from "../hooks/useSuiviDemande";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { SuiviRecherche } from "../components/SuiviRecherche";
import { SuiviAccepte } from "../components/SuiviAccepte";
import { SuiviAucunProfessionnel } from "../components/SuiviAucunProfessionnel";

export function SuiviDemandePage() {
  const { id } = useParams<{ id: string }>();
  const { data: suivi, isPending, error } = useSuiviDemande(id);

  let contenu: React.ReactNode;

  if (isPending) {
    contenu = (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
      </div>
    );
  } else if (error || !suivi) {
    contenu = (
      <p role="alert" className="py-24 text-center text-sm text-red-600">
        {demandeErrorMessage(error)}
      </p>
    );
  } else if (suivi.etape === "ACCEPTEE" && suivi.professionnel) {
    contenu = <SuiviAccepte suivi={suivi} pro={suivi.professionnel} />;
  } else if (suivi.etape === "AUCUN_PROFESSIONNEL") {
    contenu = <SuiviAucunProfessionnel suivi={suivi} />;
  } else {
    contenu = <SuiviRecherche suivi={suivi} />;
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-md flex-col px-5 pt-2 pb-6 md:min-h-0 md:pt-10 md:pb-12">
      {contenu}
    </div>
  );
}
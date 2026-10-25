import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { viderDemandeEnAttente } from "@/features/demandes/lib/demandeEnAttente";
import { visiteurRoutes } from "@/features/demandes/lib/visiteurRoutes";
import { useDemandeEnAttente } from "@/features/demandes/store/demandeEnAttente.store";
import { RegisterParticulierForm } from "../components/RegisterParticulierForm";

export function RegisterParticulierPage() {
  const [params] = useSearchParams();
  const demande = useDemandeEnAttente((s) => s.demande);
  const marquerInscription = useDemandeEnAttente((s) => s.marquerInscription);

  // Inscription lancée depuis une demande (et cette demande existe bien)
  const pourDemande = params.get("origine") === "demande" && demande !== null;

  // true : l'inscription vient d'une demande ; false : parcours habituel
  useEffect(() => {
    marquerInscription(pourDemande);
  }, [pourDemande, marquerInscription]);

  return (
    <AuthShell
      panelTitle="Décrivez votre urgence, on s'occupe du reste."
      panelSubtitle="Votre compte particulier vous permet de déposer une demande et de suivre son traitement en temps réel auprès d'officiers et auxiliaires de justice agréés."
      backTo={pourDemande ? visiteurRoutes.nouvelle : "/register"}
    >
      <div className="text-left md:text-center">
        <AuthTitle>Créez votre compte</AuthTitle>
        <AuthSubtitle>
          {pourDemande
            ? "Votre demande est conservée. Validez votre numéro de téléphone pour l'envoyer."
            : "Renseignez vos informations pour recevoir un code de validation par SMS."}
        </AuthSubtitle>
      </div>

      <div className="mt-6 md:mt-8">
        <RegisterParticulierForm />
      </div>

      <p className="mt-6 text-center text-sm text-ink/60">
        Déjà un compte ?{" "}
        <Link
          to="/login"
          onClick={pourDemande ? () => void viderDemandeEnAttente() : undefined}
          className="font-semibold text-signal hover:underline"
        >
          Connectez-vous
        </Link>
      </p>
    </AuthShell>
  );
}
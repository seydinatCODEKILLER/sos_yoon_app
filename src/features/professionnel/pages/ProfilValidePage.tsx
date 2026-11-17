import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ACTION, EcranDossier, Titre } from "../components/EcranDossier";
import { useAbonnementPro } from "../hooks/useAbonnementPro";
import { RailDossier } from "../components/RailDossier";
import type { EtapeDossier } from "../types/dossierPro.types";

// À adapter à ta route réelle du tableau de bord pro
const ROUTE_TABLEAU_DE_BORD = "/pro";

// Affiché tant que l'abonnement n'est pas chargé (durée standard de l'essai)
const DUREE_ESSAI_PAR_DEFAUT = 30;

const ETAPES_TERMINEES: EtapeDossier[] = [
  { code: "INFORMATIONS", libelle: "Informations", etat: "FAIT" },
  { code: "DOCUMENTS", libelle: "Pièces", etat: "FAIT" },
  { code: "VERIFICATION", libelle: "Vérification", etat: "FAIT" },
  { code: "ACTIVATION", libelle: "Activation", etat: "FAIT" },
];

/** Première arrivée dans l'espace pro, une fois le dossier approuvé */
export function ProfilValidePage() {
  const { data: abonnement } = useAbonnementPro();
  const joursEssai =
    abonnement?.statut === "ESSAI" && abonnement.joursRestants !== null
      ? abonnement.joursRestants
      : DUREE_ESSAI_PAR_DEFAUT;
  const pluriel = joursEssai > 1;

  return (
    <EcranDossier scene="valide" legende="Espace praticien">
      <Titre>Votre profil est validé</Titre>
      <p className="mt-5 text-base leading-relaxed text-ink/65">
        Nous avons vérifié vos pièces auprès de l'ordre professionnel. Votre
        espace SOS Yoon est ouvert : vous pouvez recevoir des demandes dès
        maintenant.
      </p>

      <div className="mt-10">
        <RailDossier etapes={ETAPES_TERMINEES} statut="APPROUVE" />
      </div>

      <div className="mt-10 flex items-center gap-5 border-y border-ink/15 py-6">
        <span className="font-display text-6xl font-bold leading-none tracking-tight text-signal">
          {joursEssai}
        </span>
        <div className="min-w-0">
          <p className="text-lg font-semibold text-ink">
            jour{pluriel ? "s" : ""} d'essai offert{pluriel ? "s" : ""}
          </p>
          <p className="mt-1 text-base leading-snug text-ink/65">
            Toutes les fonctions sont ouvertes. L'abonnement ne commence qu'à la
            fin de cette période.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        nativeButton={false}
        render={<Link to={ROUTE_TABLEAU_DE_BORD} replace />}
        className={`mt-10 ${ACTION}`}
      >
        Ouvrir mon tableau de bord
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </EcranDossier>
  );
}
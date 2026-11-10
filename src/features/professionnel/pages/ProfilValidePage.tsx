import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FeuilleDossier } from "../components/FeuilleDossier";
import { RailDossier } from "../components/RailDossier";
import type { EtapeDossier } from "../types/dossierPro.types";

// À adapter à ta route réelle du tableau de bord pro
const ROUTE_TABLEAU_DE_BORD = "/pro";

// TODO : lire l'essai restant depuis GET /pro/abonnement quand il sera branché
const DUREE_ESSAI_JOURS = 30;

const ETAPES_TERMINEES: EtapeDossier[] = [
  { code: "INFORMATIONS", libelle: "Informations", etat: "FAIT" },
  { code: "DOCUMENTS", libelle: "Pièces", etat: "FAIT" },
  { code: "VERIFICATION", libelle: "Vérification", etat: "FAIT" },
  { code: "ACTIVATION", libelle: "Activation", etat: "FAIT" },
];

/** La coche se trace une fois, à l'arrivée : c'est le seul mouvement de la page */
function Medaille() {
  const reduit = useReducedMotion();
  return (
    <span
      aria-hidden
      className="grid size-14 place-items-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/25"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="none">
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduit ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/** Première arrivée dans l'espace pro, une fois le dossier approuvé */
export function ProfilValidePage() {
  return (
    <FeuilleDossier teinte="succes">
      <Medaille />

      <h1 className="font-display mt-5 text-3xl leading-tight font-bold text-ink">
        Votre profil est validé
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-navy/70">
        Nous avons vérifié vos pièces auprès de l'ordre professionnel. Votre
        espace SOS Yoon est ouvert : vous pouvez recevoir des demandes dès
        maintenant.
      </p>

      <div className="mt-6">
        <RailDossier etapes={ETAPES_TERMINEES} statut="APPROUVE" />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-signal/25 bg-signal/5 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-signal text-white">
          <Gift className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink">
            {DUREE_ESSAI_JOURS} jours d'essai offerts
          </p>
          <p className="mt-0.5 text-sm leading-snug text-navy/70">
            Toutes les fonctions sont ouvertes. L'abonnement ne commence qu'à la
            fin de cette période.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        nativeButton={false}
        render={<Link to={ROUTE_TABLEAU_DE_BORD} replace />}
        className="mt-6 h-12 w-full gap-2 rounded-xl bg-signal text-sm font-semibold text-white shadow-lg shadow-signal/25 hover:bg-signal/90"
      >
        Ouvrir mon tableau de bord
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </FeuilleDossier>
  );
}
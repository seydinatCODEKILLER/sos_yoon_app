import { motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import type {
  CodeEtapeDossier,
  EtapeDossier,
  StatutDossier,
} from "../types/dossierPro.types";
import { etatEtape, type EtatEtape } from "../lib/etapesDossier";

const COURT: Record<CodeEtapeDossier, string> = {
  INFORMATIONS: "Informations",
  DOCUMENTS: "Pièces",
  VERIFICATION: "Vérification",
  ACTIVATION: "Activation",
};

const LECTEUR_ECRAN: Record<EtatEtape, string> = {
  faite: "terminée",
  "en-cours": "en cours",
  "a-venir": "à venir",
  refusee: "non approuvée",
};

function Pastille({ etat, reduit }: { etat: EtatEtape; reduit: boolean }) {
  const base = "relative z-10 grid size-6 place-items-center rounded-full";
  if (etat === "faite") {
    return (
      <span aria-hidden className={`${base} bg-emerald-500 text-white`}>
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (etat === "refusee") {
    return (
      <span aria-hidden className={`${base} bg-red-500 text-white`}>
        <X className="size-3.5" strokeWidth={3} />
      </span>
    );
  }
  if (etat === "en-cours") {
    return (
      <span aria-hidden className={base}>
        {/* Seule l'étape active bouge : c'est elle qu'il faut regarder */}
        {!reduit && (
          <motion.span
            className="absolute inset-0 rounded-full bg-signal/40"
            animate={{ scale: [1, 1.9], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative grid size-6 place-items-center rounded-full bg-signal">
          <span className="size-2 rounded-full bg-white" />
        </span>
      </span>
    );
  }
  return (
    <span
      aria-hidden
      className={`${base} border-2 border-ink/15 bg-paper`}
    >
      <span className="size-1.5 rounded-full bg-ink/20" />
    </span>
  );
}

/** Avancement du dossier d'inscription : 4 étapes sur une seule ligne */
export function RailDossier({
  etapes,
  statut,
}: {
  etapes: EtapeDossier[];
  statut: StatutDossier["statut"];
}) {
  const reduit = useReducedMotion() ?? false;

  return (
    <ol
      aria-label="Avancement de votre dossier"
      className="grid"
      style={{ gridTemplateColumns: `repeat(${etapes.length}, minmax(0, 1fr))` }}
    >
      {etapes.map((etape, i) => {
        const etat = etatEtape(etape, statut);
        const dernier = i === etapes.length - 1;
        return (
          <li
            key={etape.code}
            aria-current={etat === "en-cours" ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
          >
            {/* Trait vers l'étape suivante : plein une fois l'étape terminée */}
            {!dernier && (
              <span
                aria-hidden
                className={`absolute top-3 left-1/2 h-0.5 w-full -translate-y-1/2 ${
                  etat === "faite" ? "bg-emerald-500" : "bg-ink/10"
                }`}
              />
            )}
            <Pastille etat={etat} reduit={reduit} />
            <span
              className={`mt-2 px-1 text-xs leading-tight ${
                etat === "en-cours" || etat === "refusee"
                  ? "font-semibold text-ink"
                  : etat === "a-venir"
                    ? "text-navy/45"
                    : "text-navy/70"
              }`}
            >
              {COURT[etape.code] ?? etape.libelle}
              <span className="sr-only"> : {LECTEUR_ECRAN[etat]}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
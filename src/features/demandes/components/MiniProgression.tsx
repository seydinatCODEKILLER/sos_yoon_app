import { NB_ETAPES, TONS, type EtatDemande } from "../lib/statutDemandeUi";

/** Barre fine à quatre segments : envoyée · recherche · prise en charge · terminée */
export function MiniProgression({ etat }: { etat: EtatDemande }) {
  const plein = TONS[etat.ton].plein;
  return (
    <div
      role="img"
      aria-label={`Étape ${etat.etape} sur ${NB_ETAPES} : ${etat.libelle}`}
      className="flex gap-1"
    >
      {Array.from({ length: NB_ETAPES }, (_, i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < etat.etape ? plein : "bg-ink/10"
          }`}
        />
      ))}
    </div>
  );
}
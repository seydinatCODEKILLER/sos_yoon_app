import { Link } from "react-router-dom";

/**
 * Phrase « En continuant, vous acceptez… » avec les deux liens. Les documents s'ouvrent dans un
 * nouvel onglet pour ne pas faire perdre la saisie d'un formulaire d'inscription en cours.
 */
export function MentionLegale({ className }: { className?: string }) {
  const lien = "font-medium underline underline-offset-2 hover:text-signal";
  return (
    <p className={className}>
      En continuant, vous acceptez les{" "}
      <Link to="/cgu" target="_blank" rel="noopener" className={lien}>
        Conditions générales d'utilisation
      </Link>{" "}
      et la{" "}
      <Link to="/confidentialite" target="_blank" rel="noopener" className={lien}>
        Politique de confidentialité
      </Link>{" "}
      de SOS Yoon.
    </p>
  );
}
import { useState } from "react";
import { useAnnulerDemande } from "../hooks/useAnnulerDemande";

export function AnnulerDemandeLien({ demandeId }: { demandeId: string }) {
  const { annuler, isCancelling } = useAnnulerDemande(demandeId);
  const [confirmation, setConfirmation] = useState(false);

  // Hauteur fixe : pas de décalage entre le lien et la confirmation
  return (
    <div className="flex min-h-10 items-center justify-center gap-4 text-sm">
      {confirmation ? (
        <>
          <button
            type="button"
            onClick={annuler}
            disabled={isCancelling}
            className="font-semibold text-red-600 hover:underline disabled:opacity-60"
          >
            {isCancelling ? "Annulation…" : "Oui, annuler"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmation(false)}
            disabled={isCancelling}
            className="font-medium text-ink/60 hover:underline"
          >
            Non, continuer
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmation(true)}
          className="text-ink/60 underline underline-offset-4 hover:text-ink"
        >
          Annuler ma demande
        </button>
      )}
    </div>
  );
}
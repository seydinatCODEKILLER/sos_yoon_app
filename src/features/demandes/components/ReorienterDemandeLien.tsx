import { useState } from "react";
import { useReorienterDemande } from "../hooks/useReoirienterDemande";

/** « Changer de professionnel » : confirmation en deux temps, comme l'annulation */
export function ReorienterDemandeLien({ demandeId }: { demandeId: string }) {
  const { reorienter, isReorienting } = useReorienterDemande(demandeId);
  const [confirmation, setConfirmation] = useState(false);

  return (
    <div className="flex min-h-10 items-center justify-center gap-4 text-sm">
      {confirmation ? (
        <>
          <button
            type="button"
            onClick={() => {
              reorienter();
              setConfirmation(false);
            }}
            disabled={isReorienting}
            className="font-semibold text-signal hover:underline disabled:opacity-60"
          >
            {isReorienting ? "Transmission…" : "Oui, changer"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmation(false)}
            disabled={isReorienting}
            className="font-medium text-ink/60 hover:underline"
          >
            Non, garder
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmation(true)}
          disabled={isReorienting}
          className="font-medium text-navy underline underline-offset-4 hover:text-ink disabled:opacity-60"
        >
          Changer de professionnel
        </button>
      )}
    </div>
  );
}
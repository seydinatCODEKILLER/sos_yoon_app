import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { useRevokeAllTokens } from "../hooks/useRevokeAllTokens";
import { getErrorMessage } from "@/shared/lib/errorHandler";
import { toast } from "@/shared/lib/toast";

export function SecuritySection() {
  const [confirming, setConfirming] = useState(false);
  const revokeAll = useRevokeAllTokens();

  const handleConfirm = () => {
    revokeAll.mutate(undefined, {
      onError: (error) => {
        toast.error(getErrorMessage(error));
        setConfirming(false);
      },
      // Pas de toast succès ici : logout() redirige immédiatement,
      // l'utilisateur ne verrait pas le message de toute façon.
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h2 className="text-sm font-semibold text-ink">Sécurité</h2>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-border bg-paper px-4 py-3.5">
        <ShieldAlert
          size={18}
          className="mt-0.5 shrink-0 text-muted-foreground"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-ink">
            Déconnecter tous les appareils
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Révoque toutes vos sessions actives, y compris celle-ci. Utile si
            vous pensez que votre compte a été utilisé sans votre accord.
          </p>

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="mt-3 text-sm font-medium text-red-600 hover:underline"
            >
              Déconnecter partout
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={revokeAll.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                {revokeAll.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={revokeAll.isPending}
                className="text-xs text-muted-foreground hover:text-ink"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

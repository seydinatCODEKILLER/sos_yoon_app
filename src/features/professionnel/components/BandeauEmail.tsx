import { useState } from "react";
import { Loader2, MailWarning } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { refreshSession } from "@/shared/lib/refreshToken";
import { toast } from "@/shared/lib/toast";
import { useRenvoyerEmailVerification } from "../hooks/useDossierPro";

/**
 * E-mail non confirmé : l'administrateur ne peut pas approuver le dossier (spec 4).
 * Ne s'affiche que si l'adresse n'est pas encore confirmée.
 */
export function BandeauEmail() {
  const user = useAuthStore((s) => s.user);
  const renvoyer = useRenvoyerEmailVerification();
  const [verification, setVerification] = useState(false);

  if (!user || user.emailVerifie) return null;
  const email = user.email;

  async function jAiConfirme() {
    setVerification(true);
    try {
      // La session relue indique si l'adresse est désormais confirmée
      await refreshSession();
      if (!useAuthStore.getState().user?.emailVerifie) {
        toast.error(
          "Adresse pas encore confirmée",
          "Ouvrez le lien reçu par e-mail.",
        );
      }
    } finally {
      setVerification(false);
    }
  }

  return (
    <div
      role="status"
      className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <MailWarning
          className="mt-0.5 size-4 shrink-0 text-amber-600"
          aria-hidden
        />
        <p className="text-sm leading-snug text-amber-950">
          <span className="font-semibold">Confirmez votre adresse e-mail.</span>{" "}
          {email ? `Nous avons envoyé un lien à ${email}. ` : ""}
          Sans cette confirmation, votre dossier ne peut pas être validé.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 pl-7">
        {email && (
          <button
            type="button"
            onClick={() => renvoyer.mutate(email)}
            disabled={renvoyer.isPending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
          >
            {renvoyer.isPending && (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            )}
            Renvoyer l'e-mail
          </button>
        )}
        <button
          type="button"
          onClick={() => void jAiConfirme()}
          disabled={verification}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-amber-900 underline-offset-2 hover:underline disabled:opacity-60"
        >
          {verification && (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          )}
          J'ai confirmé mon adresse
        </button>
      </div>
    </div>
  );
}
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CircleAlert, Loader2, LogOut, RotateCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { useAuthStore } from "@/features/auth/store/auth.store";

const BARRE: Record<"signal" | "alerte" | "succes", string> = {
  signal: "bg-signal",
  alerte: "bg-red-500",
  succes: "bg-emerald-500",
};

/**
 * Fiche commune aux écrans du dossier d'inscription (attente, refus, validation).
 * Fond uni, la fiche est centrée et la page ne défile pas ; le défilement interne
 * n'existe que si l'écran est trop court pour le contenu (téléphone en paysage).
 */
export function FeuilleDossier({
  teinte,
  children,
}: {
  teinte: "signal" | "alerte" | "succes";
  children: ReactNode;
}) {
  return (
    <main className="flex h-dvh overflow-y-auto bg-paper p-4">
      <motion.div
        variants={conteneur}
        initial="cache"
        animate="visible"
        className="m-auto w-full max-w-xl"
      >
        <motion.div variants={apparition}>
          <Card
            className={`relative gap-0 overflow-hidden rounded-2xl border py-0 shadow-sm ${CARTE}`}
          >
            {/* La couleur de l'état tient dans ce filet, pas dans le fond */}
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-1 ${BARRE[teinte]}`}
            />
            <CardContent className="p-5 pt-6 sm:p-8 sm:pt-9">{children}</CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}

/** Ferme la session : le professionnel se reconnectera avec son e-mail */
function useQuitterSession() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return async function quitter() {
    queryClient.clear();
    await logout();
    navigate("/", { replace: true });
  };
}

export function PiedFeuille({ texte }: { texte: string }) {
  const quitter = useQuitterSession();
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-xs text-xs leading-relaxed text-navy/60">{texte}</p>
      <Button
        type="button"
        variant="outline"
        onClick={() => void quitter()}
        className="h-10 shrink-0 gap-2 rounded-lg border-ink/15 px-4 text-sm font-medium text-ink hover:bg-ink/5"
      >
        <LogOut className="size-4" aria-hidden />
        Se déconnecter
      </Button>
    </div>
  );
}

/** Chargement, ou erreur avec une issue : réessayer ou se déconnecter */
export function DossierIndisponible({
  erreur,
  onRetry,
}: {
  erreur: boolean;
  onRetry: () => void;
}) {
  const quitter = useQuitterSession();
  return (
    <FeuilleDossier teinte="signal">
      {erreur ? (
        <div role="alert" className="text-center">
          <CircleAlert className="mx-auto size-8 text-red-600" aria-hidden />
          <h1 className="font-display mt-3 text-xl font-bold text-ink">
            Impossible de charger votre dossier
          </h1>
          <p className="mt-1 text-sm text-navy/60">
            Vérifiez votre connexion, puis réessayez.
          </p>
          <div className="mt-5 flex flex-col items-center gap-2">
            <Button
              type="button"
              onClick={onRetry}
              className="h-10 gap-2 rounded-lg bg-navy px-5 text-sm font-semibold text-paper hover:bg-navy/90"
            >
              <RotateCw className="size-4" aria-hidden />
              Réessayer
            </Button>
            <button
              type="button"
              onClick={() => void quitter()}
              className="text-xs font-semibold text-navy/60 hover:underline"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center py-6">
          <Loader2
            className="size-8 animate-spin text-signal"
            aria-label="Chargement de votre dossier"
          />
        </div>
      )}
    </FeuilleDossier>
  );
}
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, RotateCw, Smartphone } from "lucide-react";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { OtpVisualPanel } from "@/shared/components/OtpVisualPanel";
import { getPostLoginRoute } from "@/shared/lib/getPostLoginRoute";
import { visiteurRoutes } from "@/features/demandes/lib/visiteurRoutes";
import { useDemandeEnAttente } from "@/features/demandes/store/demandeEnAttente.store";
import { OtpForm } from "../components/OtpForm";
import { useFinaliserInscription } from "../hooks/useFinaliserInscription";
import { formatInternationalPhone } from "../lib/phone";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { telephone } = (useLocation().state as { telephone?: string } | null) ?? {};
  const pourDemande = useDemandeEnAttente((s) => s.inscriptionPourDemande);
  const { submit: finaliser, isSubmitting: finalisation } = useFinaliserInscription();
  // Jeton gardé si la création du compte échoue : permet de réessayer sans nouvel OTP
  const [jetonEnAttente, setJetonEnAttente] = useState<string | null>(null);

  if (!telephone) return <Navigate to="/register/particulier" replace />;

  const creerCompte = async (jeton: string) => {
    const session = await finaliser(jeton);
    if (!session) {
      setJetonEnAttente(jeton);
      return;
    }
    setJetonEnAttente(null);
    // La demande conservée part tout de suite (l'envoi exige un accès complet)
    navigate(
      session.portee === "COMPLET" ? visiteurRoutes.envoi : getPostLoginRoute(session),
      { replace: true },
    );
  };

  const onVerified = (jetonInscription: string) => {
    if (pourDemande) {
      void creerCompte(jetonInscription);
      return;
    }
    navigate("/inscription/code-secret", {
      replace: true,
      state: { telephone, jetonInscription },
    });
  };

  return (
    <AuthShell
      panel={<OtpVisualPanel />}
      tagline="Plus qu'une étape avant de commencer."
      badge="Validation sécurisée"
      backTo={pourDemande ? visiteurRoutes.inscription : "/register/particulier"}
      backLabel="Modifier le numéro"
    >
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal">
          <Smartphone className="size-6" aria-hidden />
        </span>
        <AuthTitle className="mt-5">Vérifiez votre numéro</AuthTitle>
        <AuthSubtitle>
          Entrez le code de vérification à 6 chiffres envoyé au
          <span className="mt-1 block font-semibold text-ink">
            {formatInternationalPhone(telephone)}
          </span>
        </AuthSubtitle>
      </div>

      <div className="mt-8">
        {jetonEnAttente ? (
          <div className="text-center">
            <p role="alert" className="text-sm text-red-700">
              La création de votre compte n'a pas abouti.
            </p>
            <button
              type="button"
              onClick={() => void creerCompte(jetonEnAttente)}
              disabled={finalisation}
              className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
            >
              {finalisation ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <RotateCw className="size-4" aria-hidden />
              )}
              Réessayer
            </button>
          </div>
        ) : (
          <div
            aria-busy={finalisation}
            className={finalisation ? "pointer-events-none opacity-60" : undefined}
          >
            <OtpForm
              telephone={telephone}
              type="INSCRIPTION"
              onVerified={onVerified}
            />
            {/* Emplacement réservé : pas de décalage pendant la création du compte */}
            <p className="mt-4 flex min-h-5 items-center justify-center gap-2 text-sm text-ink/60">
              {finalisation && (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Création de votre compte…
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
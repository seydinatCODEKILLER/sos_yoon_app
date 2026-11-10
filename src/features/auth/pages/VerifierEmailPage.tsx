import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, CircleAlert, Loader2, Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { toApiErreur } from "@/shared/lib/apiError";
import { getRouteForSession } from "@/shared/lib/getPostLoginRoute";
import { refreshSession } from "@/shared/lib/refreshToken";
import { useAuthStore } from "../store/auth.store";
import { authErrorMessage } from "../lib/authErrors";
import { useVerifierEmail } from "../hooks/useVerifierEmail";
import { useRenvoyerEmailVerification } from "@/features/professionnel/hooks/useDossierPro";
import { FeuilleDossier } from "@/features/professionnel/components/FeuilleDossier";

/** Ici « JETON_INVALIDE » parle d'un lien, pas d'une session : message dédié */
function messageLien(error: unknown): string {
  const { code } = toApiErreur(error);
  if (code === "JETON_INVALIDE")
    return "Ce lien n'est pas valide, ou il a déjà été utilisé.";
  if (code === "JETON_EXPIRE")
    return "Ce lien a expiré. Demandez un nouvel e-mail de confirmation.";
  return authErrorMessage(error);
}

function Renvoi() {
  const user = useAuthStore((s) => s.user);
  const renvoyer = useRenvoyerEmailVerification();
  const [email, setEmail] = useState(user?.email ?? "");
  const valide = /^\S+@\S+\.\S+$/.test(email.trim());

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (valide) renvoyer.mutate(email.trim());
      }}
      className="mt-6 text-left"
    >
      <label htmlFor="email-renvoi" className="text-[13px] font-medium text-ink">
        Recevoir un nouveau lien
      </label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id="email-renvoi"
          type="email"
          autoComplete="email"
          placeholder="nom.prenom@exemple.com"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className="h-10 rounded-lg border-ink/10 bg-white px-3 text-sm shadow-none focus-visible:border-signal focus-visible:ring-signal/20"
        />
        <Button
          type="submit"
          disabled={!valide || renvoyer.isPending}
          className="h-10 shrink-0 gap-1.5 rounded-lg bg-signal px-4 text-sm font-semibold text-white hover:bg-signal/90 disabled:opacity-60"
        >
          {renvoyer.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Envoyer
        </Button>
      </div>
    </form>
  );
}

/** Page ouverte depuis l'e-mail de confirmation : /verifier-email?token=… (publique) */
export function VerifierEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const connecte = useAuthStore((s) => s.isAuthenticated);
  const etat = useVerifierEmail(token);
  const [ouverture, setOuverture] = useState(false);

  // Déjà connecté : on relit la session (e-mail confirmé) puis on retourne chez soi
  async function retourner() {
    setOuverture(true);
    try {
      await refreshSession();
      const { user, portee } = useAuthStore.getState();
      navigate(user && portee ? getRouteForSession(user.role, portee) : "/login", {
        replace: true,
      });
    } finally {
      setOuverture(false);
    }
  }

  const lienManquant = !token;
  const enCours = !lienManquant && etat.statut === "cours";
  const isSuccess = etat.statut === "ok";
  const isError = etat.statut === "erreur";
  const error = etat.statut === "erreur" ? etat.error : undefined;

  return (
    <FeuilleDossier teinte={isSuccess ? "succes" : isError || lienManquant ? "alerte" : "signal"}>
      <div className="text-center" aria-live="polite">
          {enCours && (
            <>
              <Loader2
                className="mx-auto size-10 animate-spin text-signal"
                aria-hidden
              />
              <h1 className="font-display mt-5 text-2xl font-bold text-ink">
                Confirmation en cours…
              </h1>
              <p className="mt-2 text-sm text-navy/60">
                Un instant, nous vérifions votre adresse e-mail.
              </p>
            </>
          )}

          {isSuccess && (
            <>
              <span
                aria-hidden
                className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50"
              >
                <span className="grid size-9 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check className="size-5" strokeWidth={3} />
                </span>
              </span>
              <h1 className="font-display mt-5 text-2xl font-bold text-ink">
                Adresse e-mail confirmée
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-navy/60">
                Merci. Votre dossier peut maintenant être examiné par notre équipe.
              </p>
              {connecte ? (
                <Button
                  type="button"
                  onClick={() => void retourner()}
                  disabled={ouverture}
                  className="mt-6 h-11 w-full gap-2 rounded-lg bg-navy text-sm font-semibold text-paper hover:bg-navy/90 disabled:opacity-60"
                >
                  {ouverture ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : (
                    <ArrowRight className="size-4" aria-hidden />
                  )}
                  Retourner à mon espace
                </Button>
              ) : (
                <Link
                  to="/login/professionnel"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy text-sm font-semibold text-paper transition-colors hover:bg-navy/90"
                >
                  Me connecter
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
            </>
          )}

          {(isError || lienManquant) && (
            <>
              <span
                aria-hidden
                className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-600"
              >
                <CircleAlert className="size-7" />
              </span>
              <h1 className="font-display mt-5 text-2xl font-bold text-ink">
                Lien impossible à utiliser
              </h1>
              <p role="alert" className="mt-2 text-sm leading-relaxed text-navy/60">
                {lienManquant
                  ? "Ce lien est incomplet. Ouvrez-le depuis l'e-mail reçu, ou demandez-en un nouveau."
                  : messageLien(error)}
              </p>
              <Renvoi />
              <Link
                to={connecte ? "/" : "/login/professionnel"}
                className="mt-5 inline-block text-xs font-semibold text-navy/60 hover:underline"
              >
                {connecte ? "Retour à l'application" : "Retour à la connexion"}
              </Link>
            </>
          )}
      </div>
    </FeuilleDossier>
  );
}
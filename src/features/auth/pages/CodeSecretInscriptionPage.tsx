import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CircleAlert, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell, AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { getPostLoginRoute } from "@/shared/lib/getPostLoginRoute";
import { CodeSecretInput } from "../components/CodeSecretInput";
import { useDefinirCodeSecret } from "../hooks/useDefinirCodeSecret";
import { isCodeTrivial } from "../lib/codeSecret";

type State = { telephone?: string; jetonInscription?: string } | null;

export function CodeSecretInscriptionPage() {
  const navigate = useNavigate();
  const state = useLocation().state as State;
  const { submit, isSubmitting } = useDefinirCodeSecret();

  const [etape, setEtape] = useState<"creation" | "confirmation">("creation");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [essai, setEssai] = useState(0); // force le remontage des cases
  const [visible, setVisible] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  if (!state?.jetonInscription) return <Navigate to="/register/particulier" replace />;
  const jeton = state.jetonInscription;

  function handleCreation(v: string) {
    setErreur(null);
    setCode(v);
    if (v.length < 4) return;
    if (isCodeTrivial(v)) {
      setErreur("Choisissez un code moins évident (pas 0000, 1234…).");
      setTimeout(() => { setCode(""); setEssai((n) => n + 1); }, 300);
      return;
    }
    setTimeout(() => setEtape("confirmation"), 250);
  }

  async function handleConfirmation(v: string) {
    setErreur(null);
    setConfirmation(v);
    if (v.length < 4) return;
    if (v !== code) {
      setErreur("Les codes ne correspondent pas. Réessayez.");
      setTimeout(() => { setConfirmation(""); setEssai((n) => n + 1); }, 300);
      return;
    }
    const session = await submit(jeton, code);
    if (session) navigate(getPostLoginRoute(session), { replace: true });
  }

  function recommencer() {
    setCode(""); setConfirmation(""); setErreur(null);
    setEtape("creation"); setEssai((n) => n + 1);
  }

  const enCreation = etape === "creation";

  return (
    <AuthShell
      panelTitle="Protégez votre compte."
      panelSubtitle="Ce code à 4 chiffres vous permettra de vous reconnecter rapidement, sans SMS."
      tagline="Dernière étape : protégez votre compte."
      sheetHandle
    >
      <div className="text-center">
        <AuthTitle>{enCreation ? "Créez votre code secret" : "Confirmez votre code secret"}</AuthTitle>
        <AuthSubtitle>Code confidentiel à 4 chiffres</AuthSubtitle>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <CodeSecretInput
          key={`${etape}-${essai}`}
          variant="tiles"
          autoFocus
          value={enCreation ? code : confirmation}
          onChange={enCreation ? handleCreation : (v) => void handleConfirmation(v)}
          visible={visible}
          invalid={!!erreur}
          disabled={isSubmitting}
        />
<button
  type="button"
  onClick={() => setVisible((v) => !v)}
  aria-label={visible ? "Masquer le code" : "Afficher le code"}
  className="grid size-10 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
>
  {visible ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
</button>
      </div>

      <div className="mt-4 min-h-10 text-center">
        {erreur && (
          <p role="alert" className="flex items-center justify-center gap-1.5 text-sm text-red-700">
            <CircleAlert className="size-4 shrink-0" aria-hidden /> {erreur}
          </p>
        )}
        {isSubmitting && (
          <p className="flex items-center justify-center gap-2 text-sm text-ink/60">
            <Loader2 className="size-4 animate-spin" /> Création du compte…
          </p>
        )}
        {!enCreation && !isSubmitting && (
          <button type="button" onClick={recommencer} className="text-sm font-semibold text-signal hover:underline">
            Modifier mon code
          </button>
        )}
      </div>
    </AuthShell>
  );
}
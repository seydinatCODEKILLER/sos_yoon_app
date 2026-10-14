import { useState } from "react";
import { CircleAlert, Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { AuthSubtitle, AuthTitle } from "@/shared/components/AuthShell";
import { CodeSecretInput } from "./CodeSecretInput";
import { useReinitialiserCodeSecret } from "../hooks/useReinitialiserCodeSecret";
import { isCodeTrivial } from "../lib/codeSecret";

function EyeToggle({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={visible ? "Masquer le code" : "Afficher le code"}
      className="text-ink/50 hover:text-ink"
    >
      {visible ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
    </button>
  );
}

type Erreur = { champ: "nouveau" | "confirmation"; message: string } | null;

interface Props {
  jeton: string;
  onDone: () => void;
}

export function NouveauCodeForm({ jeton, onDone }: Props) {
  const { submit, isSubmitting } = useReinitialiserCodeSecret();
  const [nouveau, setNouveau] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showNouveau, setShowNouveau] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [erreur, setErreur] = useState<Erreur>(null);

  const pret = nouveau.length === 4 && confirmation.length === 4;

  function handleNouveau(v: string) {
    setErreur(null);
    setNouveau(v);
    // passe automatiquement au champ de confirmation
    if (v.length === 4) document.getElementById("confirmation-code")?.focus();
  }

  function handleConfirmation(v: string) {
    setErreur(null);
    setConfirmation(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isCodeTrivial(nouveau)) {
      setErreur({
        champ: "nouveau",
        message: "Choisissez un code moins évident (pas 0000, 1234…).",
      });
      return;
    }
    if (nouveau !== confirmation) {
      setErreur({
        champ: "confirmation",
        message: "Les codes ne correspondent pas.",
      });
      return;
    }
    if (await submit(jeton, nouveau)) onDone();
  }

  return (
    <div>
      <div className="text-left md:text-center">
        <AuthTitle>Choisissez votre nouveau code</AuthTitle>
        <AuthSubtitle>
          Ce sera votre code pour vous connecter. Ne le partagez avec personne.
        </AuthSubtitle>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="nouveau-code"
              className="text-sm font-semibold text-ink"
            >
              Nouveau code secret
            </label>
            <EyeToggle
              visible={showNouveau}
              onClick={() => setShowNouveau((v) => !v)}
            />
          </div>
          <CodeSecretInput
            id="nouveau-code"
            autoFocus
            value={nouveau}
            onChange={handleNouveau}
            visible={showNouveau}
            invalid={erreur?.champ === "nouveau"}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="confirmation-code"
              className="text-sm font-semibold text-ink"
            >
              Confirmer le code
            </label>
            <EyeToggle
              visible={showConfirmation}
              onClick={() => setShowConfirmation((v) => !v)}
            />
          </div>
          <CodeSecretInput
            id="confirmation-code"
            value={confirmation}
            onChange={handleConfirmation}
            visible={showConfirmation}
            invalid={erreur?.champ === "confirmation"}
            disabled={isSubmitting}
          />
        </div>

{/* Emplacement réservé : l'apparition de l'erreur ne déplace plus rien */}
<div className="min-h-5">
  {erreur && (
    <p
      role="alert"
      className="flex items-center gap-1.5 text-sm text-red-700"
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden />
      {erreur.message}
    </p>
  )}
</div>

        <button
          type="submit"
          disabled={!pret || isSubmitting}
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Enregistrement…
            </>
          ) : (
            "Enregistrer mon code"
          )}
        </button>
      </form>
    </div>
  );
}

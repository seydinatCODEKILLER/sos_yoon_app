import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { CodeSecretInput } from "@/features/auth/components/CodeSecretInput";
import { toApiErreur } from "@/shared/lib/apiError";
import { toast } from "@/shared/lib/toast";
import { useSupprimerCompte } from "../hooks/useSupprimerCompte";

const ELEMENTS_SUPPRIMES = [
  "Historique de vos demandes et dossiers",
  "Messages et pièces jointes échangés",
  "Enregistrements vocaux et coordonnées",
];

function messageErreur(e: unknown): string {
  const err = toApiErreur(e);
  const details = (err.details ?? {}) as unknown as Record<string, unknown>;

  switch (String(err.code)) {
    case "CODE_SECRET_INCORRECT": {
      const restants = details.essaisRestants;
      if (typeof restants === "number") {
        return `Code secret incorrect. Il vous reste ${restants} essai${restants > 1 ? "s" : ""}.`;
      }
      return "Code secret incorrect.";
    }
    case "COMPTE_VERROUILLE":
      return "Trop de tentatives. Réessayez plus tard.";
    default:
      return "Impossible de supprimer le compte. Réessayez.";
  }
}

export function SupprimerCompteForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const { mutateAsync: supprimer, isPending } = useSupprimerCompte();

  const [confirme, setConfirme] = useState(false);
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
    const [essai, setEssai] = useState(0);

  const checkboxId = useId();
  const codeId = useId();

  const peutSupprimer = confirme && code.length === 4 && !isPending;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!peutSupprimer) return;
    setErreur(null);
    try {
      await supprimer({ codeSecret: code });
      // On ne garde rien des données de cet utilisateur
      queryClient.clear();
      logout();
      toast.success("Votre compte a été supprimé.");
      navigate("/login", { replace: true });
    } catch (err) {
      setErreur(messageErreur(err));
      setCode("");
      setEssai((n) => n + 1);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-red-700"
            aria-hidden
          />
          <div>
            <p className="text-[16px] leading-snug font-semibold text-red-800">
              Vos demandes en cours seront annulées
            </p>
            <p className="mt-2 text-[14px] leading-snug text-red-800/90">
              Si un professionnel est actuellement en route ou consulte votre
              dossier, la mise en relation sera immédiatement interrompue.
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-3 rounded-2xl border border-ink/10 bg-white px-5 py-4 shadow-sm">
        {ELEMENTS_SUPPRIMES.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[14px] text-ink/75">
            <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-ink/40" />
            {item}
          </li>
        ))}
      </ul>

      <label
        htmlFor={checkboxId}
        className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-ink/10 bg-ink/3 px-4 py-3.5 has-focus-visible:ring-2 has-focus-visible:ring-signal/40"
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={confirme}
          disabled={isPending}
          onChange={(e) => setConfirme(e.target.checked)}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 border-navy transition-colors ${
            confirme ? "bg-navy" : "bg-white"
          }`}
        >
          {confirme && <Check className="size-4 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px] leading-snug text-navy">
          J'ai compris que la suppression de mon compte est définitive.
        </span>
      </label>

      <label
        htmlFor={codeId}
        className="mt-6 block text-[15px] font-semibold text-navy"
      >
        Confirmez avec votre code secret à 4 chiffres
      </label>
      <div className="mt-3 w-fit">
        <CodeSecretInput
          key={essai}
          id={codeId}
          variant="tiles"
          length={4}
          value={code}
          onChange={(v) => {
            setCode(v);
            if (erreur) setErreur(null);
          }}
          visible={false}
          autoFocus={essai > 0}
          invalid={erreur !== null}
          disabled={isPending}
        />
      </div>
      {/* Hauteur réservée : pas de décalage quand l'erreur apparaît */}
      <p
        role={erreur ? "alert" : undefined}
        className="mt-2 min-h-5 text-[13px] leading-snug text-red-600"
      >
        {erreur}
      </p>

      <button
        type="submit"
        disabled={!peutSupprimer}
        className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-700 bg-white px-6 text-[16px] font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Suppression…
          </>
        ) : (
          "Supprimer définitivement"
        )}
      </button>
    </form>
  );
}
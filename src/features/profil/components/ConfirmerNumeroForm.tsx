import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleCheck, Loader2, Smartphone } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { formatInternationalPhone } from "@/features/auth/lib/phone";
import { authErrorMessage } from "@/features/auth/lib/authErrors";
import { toApiErreur } from "@/shared/lib/apiError";
import { toast } from "@/shared/lib/toast";
import { useChangerTelephone } from "../hooks/useChangerTelephone";

const SLOT_CLASS =
  "h-13 w-10 rounded-xl border border-ink/10 bg-ink/3 text-lg font-semibold shadow-none first:rounded-xl first:border last:rounded-xl data-[active=true]:border-signal data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-signal/20 min-[380px]:w-11";

function formatCooldown(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

interface Props {
  /** Nouveau numéro, au format international */
  nouveauTelephone: string;
  /** Délai avant le premier renvoi (celui que le serveur vient de donner) */
  delaiInitial: number;
  /** Numéro confirmé : le profil est à jour */
  onConfirme: () => void;
  /** Retour à la saisie du numéro */
  onModifierNumero: () => void;
}

export function ConfirmerNumeroForm({
  nouveauTelephone,
  delaiInitial,
  onConfirme,
  onModifierNumero,
}: Props) {
  const { demander, confirmer, isConfirmationPending } = useChangerTelephone();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(delaiInitial);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function valider(valeur: string) {
    if (valeur.length !== 6 || isConfirmationPending) return;
    try {
      await confirmer(valeur);
      toast.success("Numéro modifié", "Connectez-vous désormais avec votre nouveau numéro.");
      onConfirme();
    } catch (e) {
      const err = toApiErreur(e);
      setCode("");
      // Plus de changement en attente (serveur redémarré, par exemple) : on repart du début
      if (err.code === "REGLE_METIER") {
        toast.error("Cette demande a expiré. Saisissez à nouveau le numéro.");
        onModifierNumero();
        return;
      }
      toast.error(authErrorMessage(e));
    }
  }

  async function renvoyer() {
    if (cooldown > 0) return;
    try {
      const res = await demander(nouveauTelephone);
      toast.success("Nouveau code envoyé");
      setCode("");
      setCooldown(res.delaiRenvoiSecondes);
    } catch (e) {
      toast.error(authErrorMessage(e));
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-signal/10 text-signal">
          <Smartphone className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-[22px] font-bold text-navy">Vérifiez le nouveau numéro</h2>
        <p className="mt-2 text-[15px] leading-snug text-ink/60">
          Entrez le code à 6 chiffres envoyé au
          <span className="mt-1 block font-semibold text-ink tabular-nums">
            {formatInternationalPhone(nouveauTelephone)}
          </span>
        </p>
        <button
          type="button"
          onClick={onModifierNumero}
          disabled={isConfirmationPending}
          className="mt-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-signal disabled:opacity-60"
        >
          Modifier le numéro
        </button>
      </div>

      <div
        aria-busy={isConfirmationPending}
        className={`mt-8 flex justify-center ${
          isConfirmationPending ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          value={code}
          onChange={setCode}
          onComplete={(valeur) => void valider(valeur)}
        >
          <InputOTPGroup className="gap-2 min-[380px]:gap-2.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className={SLOT_CLASS} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        type="button"
        onClick={() => void valider(code)}
        disabled={code.length !== 6 || isConfirmationPending}
        className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-[15px] font-semibold text-paper shadow-[0_8px_22px_rgba(249,97,13,0.32)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isConfirmationPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden /> Vérification…
          </>
        ) : (
          <>
            <CircleCheck className="size-4" aria-hidden /> Confirmer le nouveau numéro
          </>
        )}
      </button>

      <div className="mt-5 space-y-1.5 text-center">
        <p className="text-sm text-ink/60">
          Vous n'avez rien reçu ?{" "}
          <button
            type="button"
            onClick={() => void renvoyer()}
            disabled={cooldown > 0}
            className="font-semibold text-signal hover:underline disabled:cursor-not-allowed disabled:text-ink/30 disabled:no-underline"
          >
            Renvoyer le code
          </button>
        </p>
        {cooldown > 0 && (
          <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink/40">
            Disponible dans {formatCooldown(cooldown)}
          </p>
        )}
      </div>
    </div>
  );
}
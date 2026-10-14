import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowRight, CircleCheck, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/ui/input-otp";
import { verifyOtpSchema, type VerifyOtpValues } from "../schema/verifyOtp.schema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import type { TypeCode } from "../types/types";

const RESEND_DELAY_SECONDS = 60;

const SLOT_CLASS =
  "h-13 w-10 rounded-xl border border-ink/10 bg-ink/3 text-lg font-semibold shadow-none first:rounded-xl first:border last:rounded-xl data-[active=true]:border-signal data-[active=true]:bg-white data-[active=true]:ring-3 data-[active=true]:ring-signal/20 min-[380px]:w-11";

function formatCooldown(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

type OtpFormProps = {
  telephone: string;
  type: TypeCode;
  /** default : inscription · reset : code oublié */
  variant?: "default" | "reset";
  onVerified: (jeton: string) => void;
};

export function OtpForm({ telephone, type, variant = "default", onVerified }: OtpFormProps) {
  const { submit, resend, isSubmitting } = useVerifyOtp(telephone, type);
  const reset = variant === "reset";
  // un code vient d'être envoyé : le renvoi est bloqué dès l'arrivée
  const [cooldown, setCooldown] = useState(RESEND_DELAY_SECONDS);

  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const onSubmit = form.handleSubmit(async (values) => {
    const jeton = await submit(values);
    if (jeton) onVerified(jeton);
    else form.reset({ code: "" });
  });

  async function handleResend() {
    if (cooldown > 0) return;
    const delay = await resend();
    if (delay !== null) {
      form.reset({ code: "" });
      setCooldown(delay);
    }
  }

  const error = form.formState.errors.code?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-6">
      <div className="space-y-2">
        <div className="flex justify-center">
          <Controller
            name="code"
            control={form.control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                value={field.value}
                onChange={field.onChange}
                onComplete={() => void onSubmit()}
              >
                <InputOTPGroup className="gap-2 min-[380px]:gap-2.5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className={SLOT_CLASS} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
        {error && <p role="alert" className="text-center text-xs text-red-600">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          <><Loader2 className="size-4 animate-spin" /> Vérification…</>
        ) : reset ? (
          <>Vérifier le code <ArrowRight className="size-4" /></>
        ) : (
          <><CircleCheck className="size-4" /> Vérifier le code</>
        )}
      </button>

      {reset ? (
        <div className="space-y-1.5 text-center">
          <p className="text-sm text-ink/60">Vous n'avez rien reçu ?</p>
          <p className="text-sm">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="font-semibold text-signal hover:underline disabled:cursor-not-allowed disabled:text-ink/30 disabled:no-underline"
            >
              Renvoyer le code
            </button>
            {cooldown > 0 && (
              <span className="text-ink/50">
                {" "}•{" "}
                <span className="font-semibold text-ink">
                  Disponible dans {formatCooldown(cooldown)}
                </span>
              </span>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 text-center">
          <p className="text-sm text-ink/60">
            Vous n'avez rien reçu ?{" "}
            <button
              type="button"
              onClick={handleResend}
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
      )}
    </form>
  );
}
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CircleCheck, Lock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import {
  verifyOtpSchema,
  type VerifyOtpValues,
} from "../schema/verifyOtp.schema";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import type { TokenResponse, TypeCode } from "../types/types";

const RESEND_DELAY_SECONDS = 60;

const SLOT_CLASS =
  "size-11 rounded-lg border border-ink/10 bg-white text-lg font-medium shadow-none first:rounded-lg first:border last:rounded-lg data-[active=true]:border-signal data-[active=true]:ring-3 data-[active=true]:ring-signal/20";

function formatCooldown(seconds: number) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

type OtpFormProps = {
  telephone: string;
  type: TypeCode;
  onVerified: (response: TokenResponse) => void;
};


export function OtpForm({ telephone, type, onVerified }: OtpFormProps) {
  const { submit, resend, isSubmitting } = useVerifyOtp(telephone, type);
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
    const response = await submit(values);
    if (response) onVerified(response);
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
                <InputOTPGroup className="gap-2.5">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} className={SLOT_CLASS} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
        </div>
        {error && <p className="text-center text-xs text-red-600">{error}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Vérification…"
        ) : (
          <>
            <CircleCheck className="size-4" />
            Vérifier le code
          </>
        )}
      </Button>

      <div className="space-y-1 text-center">
        <p className="text-sm text-navy/60">
          Vous n'avez rien reçu ?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="font-medium text-signal hover:underline disabled:cursor-not-allowed disabled:text-navy/30 disabled:no-underline"
          >
            Renvoyer le code
          </button>
        </p>
        {cooldown > 0 && (
          <p className="text-[11px] font-medium uppercase tracking-wide text-navy/40">
            Disponible dans {formatCooldown(cooldown)}
          </p>
        )}
      </div>

      <p className="flex items-center justify-center gap-2 rounded-lg border border-ink/5 bg-navy/5 px-3 py-2.5 text-xs text-navy/60">
        <Lock className="size-3.5 text-signal" />
        Session de connexion sécurisée et chiffrée de bout en bout
      </p>
    </form>
  );
}
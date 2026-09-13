import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
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

type OtpFormProps = {
  telephone: string;
  onVerified: () => void;
};

export function OtpForm({ telephone, onVerified }: OtpFormProps) {
  const { submit, resend, isSubmitting } = useVerifyOtp();
  const [cooldown, setCooldown] = useState(0);

  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await submit(values);
    if (ok) onVerified();
  });

  async function handleResend() {
    if (cooldown > 0) return;
    await resend(telephone);
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      <div className="flex justify-center">
        <Controller
          name="code"
          control={form.control}
          render={({ field }) => (
            <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className="h-12 w-11 border-ink/15 bg-white text-lg" />
                <InputOTPSlot index={1} className="h-12 w-11 border-ink/15 bg-white text-lg" />
                <InputOTPSlot index={2} className="h-12 w-11 border-ink/15 bg-white text-lg" />
                <InputOTPSlot index={3} className="h-12 w-11 border-ink/15 bg-white text-lg" />
                <InputOTPSlot index={4} className="h-12 w-11 border-ink/15 bg-white text-lg" />
                <InputOTPSlot index={5} className="h-12 w-11 border-ink/15 bg-white text-lg" />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>
      {form.formState.errors.code && (
        <p className="text-center text-sm text-red-600">
          {form.formState.errors.code.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full gap-2 rounded-full bg-signal text-base font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          "Vérification…"
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Vérifier le code
          </>
        )}
      </Button>

      <p className="text-center text-sm text-ink/50">
        Vous n'avez rien reçu ?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="font-medium text-brass hover:underline disabled:cursor-not-allowed disabled:text-ink/30 disabled:no-underline"
        >
          {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Renvoyer le code"}
        </button>
      </p>
    </form>
  );
}
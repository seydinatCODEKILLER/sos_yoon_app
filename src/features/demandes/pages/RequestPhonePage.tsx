import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  requestOtpSchema,
  type RequestOtpValues,
} from "@/features/auth/schema/requestOtp.schema";
import { useRequestOtp } from "@/features/auth/hooks/useRequestOtp";

export function RequestPhonePage() {
  const navigate = useNavigate();
  const { submit, isSubmitting } = useRequestOtp();

  const form = useForm<RequestOtpValues>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { telephone: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const ok = await submit(values.telephone);
    if (ok) {
      navigate("/verification-otp", {
        state: { telephone: values.telephone, pendingAction: "voiceRequest" },
      });
    }
  });

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-6 py-8 md:px-12 md:py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour
      </button>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded bg-signal/10 text-signal">
            <Smartphone className="h-6 w-6" strokeWidth={1.75} />
          </span>

          <h1 className="mt-4 font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
            Un dernier pas
          </h1>
          <p className="mt-2 text-ink/60">
            Entrez votre numéro pour recevoir un code et suivre le traitement
            de votre demande.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 w-full max-w-md space-y-5 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-1.5">
            <Label htmlFor="telephone" className="text-sm text-ink/70">
              Numéro de téléphone
            </Label>
            <Input
              id="telephone"
              type="tel"
              autoComplete="tel"
              placeholder="77 123 45 67"
              className="h-12 border-ink/15 bg-paper px-4 text-base focus-visible:border-signal focus-visible:ring-signal/30"
              {...form.register("telephone")}
            />
            {form.formState.errors.telephone && (
              <p className="text-sm text-red-600">
                {form.formState.errors.telephone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full gap-2 rounded-full bg-signal text-base font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? (
              "Envoi en cours…"
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Recevoir mon code
              </>
            )}
          </Button>

          <p className="text-center text-xs text-ink/40">
            Vos données restent confidentielles et servent uniquement au
            suivi de votre demande.
          </p>
        </form>
      </div>
    </div>
  );
}
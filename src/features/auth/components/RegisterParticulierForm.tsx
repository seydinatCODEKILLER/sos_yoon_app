import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2, MessageSquare } from "lucide-react";
import { Label } from "@/shared/components/ui/label";
import { registerParticulierSchema, type RegisterParticulierValues } from "../schema/registerParticulier.schema";
import { useRegisterParticulier } from "../hooks/useRegisterParticulier";
import { toInternationalPhone } from "../lib/phone";
import { PhoneField } from "./PhoneField";

const LEGAL_LINK = "underline underline-offset-2 hover:text-ink";

export function RegisterParticulierForm() {
  const navigate = useNavigate();
  const { submit, isSubmitting } = useRegisterParticulier();

  const form = useForm<RegisterParticulierValues>({
    resolver: zodResolver(registerParticulierSchema),
    defaultValues: { telephone: "" },
  });
  const error = form.formState.errors.telephone;

  const onSubmit = form.handleSubmit(async (values) => {
    if (await submit(values)) {
      navigate("/verification-otp", {
        state: { telephone: toInternationalPhone(values.telephone) },
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="w-full space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="telephone" className="text-sm font-semibold text-ink">
          Numéro de téléphone
        </Label>
        <PhoneField id="telephone" invalid={!!error} {...form.register("telephone")} />
        {error ? (
          <p role="alert" className="text-sm text-red-600">{error.message}</p>
        ) : (
          <p className="text-xs text-ink/50">Vous recevrez un code à usage unique par SMS.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
      >
        {isSubmitting ? (
          <><Loader2 className="size-4 animate-spin" /> Envoi en cours…</>
        ) : (
          <><MessageSquare className="size-4" /> Recevoir mon code de validation</>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-ink/55">
        En continuant, vous acceptez les{" "}
        <Link to="/cgu" target="_blank" className={LEGAL_LINK}>Conditions Générales d'Utilisation</Link>{" "}
        et la{" "}
        <Link to="/confidentialite" target="_blank" className={LEGAL_LINK}>Politique de Confidentialité</Link>{" "}
        de SOS Yoon.
      </p>
    </form>
  );
}
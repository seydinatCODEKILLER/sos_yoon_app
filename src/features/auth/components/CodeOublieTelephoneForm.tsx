import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2, MessageSquare } from "lucide-react";
import { AuthSubtitle, AuthTitle } from "@/shared/components/AuthShell";
import { Label } from "@/shared/components/ui/label";
import {
  codeOublieSchema,
  type CodeOublieValues,
} from "../schema/codeOublie.schema";
import { useDemanderCodeReinitialisation } from "../hooks/useDemanderCodeReinitialisation";
import { PhoneField } from "./PhoneField";

export function CodeOublieTelephoneForm({
  onCodeSent,
}: {
  onCodeSent: (telephone: string) => void;
}) {
  const { submit, isSubmitting } = useDemanderCodeReinitialisation();
  const form = useForm<CodeOublieValues>({
    resolver: zodResolver(codeOublieSchema),
    defaultValues: { telephone: "" },
  });
  const error = form.formState.errors.telephone;

  const onSubmit = form.handleSubmit(async (values) => {
    const telephone = await submit(values);
    if (telephone) onCodeSent(telephone);
  });

  return (
    <div>
      <div className="text-left md:text-center">
        <AuthTitle>Code oublié ?</AuthTitle>
        <AuthSubtitle>
          Entrez votre numéro. Si un compte existe, nous vous enverrons un code
          par SMS pour choisir un nouveau code secret.
        </AuthSubtitle>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5 md:mt-8">
        <div className="space-y-1.5">
          <Label htmlFor="telephone" className="text-sm font-semibold text-ink">
            Numéro de téléphone
          </Label>
          <PhoneField
            id="telephone"
            invalid={!!error}
            {...form.register("telephone")}
          />
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-paper shadow-[0_8px_20px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Envoi en cours…
            </>
          ) : (
            <>
              <MessageSquare className="size-4" /> Recevoir mon code par SMS
            </>
          )}
        </button>

        <p className="text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-ink underline underline-offset-4 hover:text-signal"
          >
            Retour à la connexion
          </Link>
        </p>
      </form>
    </div>
  );
}

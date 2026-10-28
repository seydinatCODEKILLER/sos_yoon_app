import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLoginAdmin } from "../hooks/useLoginAdmin";
import { INPUT_CLASS } from "../lib/registerFormHelpers";
import { loginAdminSchema, type LoginAdminValues } from "../schema/loginAdmin.schema";
import { Field, PasswordInput } from "./RegisterProFields";

const MESSAGES: Record<string, string> = {
  IDENTIFIANTS_INVALIDES: "Identifiants invalides.",
  COMPTE_SUSPENDU: "Ce compte est suspendu.",
  ACCES_REFUSE: "Accès refusé.",
};

export function LoginAdminForm() {
  const connexion = useLoginAdmin();
  const form = useForm<LoginAdminValues>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: { email: "", motDePasse: "" },
  });
  const erreurs = form.formState.errors;

  const code = connexion.isError ? (connexion.error as Partial<ApiErreur>).code : undefined;
  const messageErreur = connexion.isError
    ? ((code && MESSAGES[code]) ?? "Connexion impossible. Réessayez.")
    : null;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((v) => {
        connexion.reset();
        connexion.mutate({ email: v.email, motDePasse: v.motDePasse });
      })}
      className="space-y-4"
    >
      <Field label="Adresse e-mail" htmlFor="email" required error={erreurs.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="prenom.nom@sosyoon.sn"
          className={INPUT_CLASS}
          {...form.register("email")}
        />
      </Field>

      <Field label="Mot de passe" htmlFor="motDePasse" required error={erreurs.motDePasse?.message}>
        <PasswordInput
          id="motDePasse"
          autoComplete="current-password"
          placeholder="••••••••"
          {...form.register("motDePasse")}
        />
      </Field>

      {messageErreur && (
        <p role="alert" className="text-sm text-red-600">
          {messageErreur}
        </p>
      )}

      <Button
        type="submit"
        disabled={connexion.isPending}
        className="h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
      >
        {connexion.isPending ? (
          "Connexion…"
        ) : (
          <>
            Se connecter
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>
    </form>
  );
}
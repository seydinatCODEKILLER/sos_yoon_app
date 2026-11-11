import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { toApiErreur } from "@/shared/lib/apiError";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLoginAdmin } from "../hooks/useLoginAdmin";
import { INPUT_CLASS } from "../lib/registerFormHelpers";
import { loginAdminSchema, type LoginAdminValues } from "../schema/loginAdmin.schema";
import { Field, PasswordInput } from "./RegisterProFields";

/** Volontairement vague sur les identifiants : on ne dit pas si c'est l'e-mail ou le mot de passe. */
const MESSAGES: Record<string, string> = {
  IDENTIFIANTS_INVALIDES: "E-mail ou mot de passe incorrect.",
  COMPTE_SUSPENDU: "Ce compte administrateur est suspendu.",
  ACCES_REFUSE: "Ce compte n'a pas accès à l'administration.",
  MFA_NON_DISPONIBLE: "La double authentification n'est pas encore disponible.",
  TROP_DE_REQUETES: "Trop de tentatives. Réessayez dans un instant.",
};

const MESSAGE_PAR_DEFAUT = "Connexion impossible. Vérifiez votre connexion et réessayez.";

export function LoginAdminForm() {
  const connexion = useLoginAdmin();
  const form = useForm<LoginAdminValues>({
    resolver: zodResolver(loginAdminSchema),
    defaultValues: { email: "", motDePasse: "" },
  });
  const erreurs = form.formState.errors;

  const messageErreur = connexion.isError
    ? (MESSAGES[toApiErreur(connexion.error).code] ?? MESSAGE_PAR_DEFAUT)
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
          autoFocus
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

      <div aria-live="polite">
        {messageErreur && (
          <p role="alert" className="text-sm text-red-600">
            {messageErreur}
          </p>
        )}
      </div>

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
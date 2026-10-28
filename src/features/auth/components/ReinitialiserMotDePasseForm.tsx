import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleAlert, CircleCheck } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { Button } from "@/shared/components/ui/button";
import { useReinitialiserMotDePasse } from "../hooks/useMotDePasse";
import {
  reinitialiserMotDePasseSchema,
  type ReinitialiserMotDePasseValues,
} from "../schema/motDePasse.schema";
import { Field, PasswordInput } from "./RegisterProFields";

const ROUTE_CONNEXION = "/login/professionnel";
const ROUTE_DEMANDE = "/mot-de-passe-oublie";

type ProblemeJeton = "JETON_EXPIRE" | "JETON_INVALIDE";

function EtatLien({ expire }: { expire: boolean }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <CircleAlert className="size-7" aria-hidden />
      </span>
      <div className="mt-5">
        <AuthTitle>{expire ? "Lien expiré" : "Lien invalide"}</AuthTitle>
        <AuthSubtitle>
          {expire
            ? "Ce lien de réinitialisation n'est plus valable. Demandez-en un nouveau."
            : "Ce lien de réinitialisation n'est pas valide ou a déjà été utilisé. Demandez-en un nouveau."}
        </AuthSubtitle>
      </div>
      <Button
        render={<Link to={ROUTE_DEMANDE} />}
        className="mt-6 h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90"
      >
        Demander un nouveau lien
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </div>
  );
}

export function ReinitialiserMotDePasseForm() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const reinitialiser = useReinitialiserMotDePasse();
  const [termine, setTermine] = useState(false);
  const [probleme, setProbleme] = useState<ProblemeJeton | null>(null);

  const form = useForm<ReinitialiserMotDePasseValues>({
    resolver: zodResolver(reinitialiserMotDePasseSchema),
    defaultValues: { nouveauMotDePasse: "", confirmation: "" },
  });
  const erreurs = form.formState.errors;

  if (!token) return <EtatLien expire={false} />;
  if (probleme) return <EtatLien expire={probleme === "JETON_EXPIRE"} />;

  if (termine) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheck className="size-7" aria-hidden />
        </span>
        <div className="mt-5">
          <AuthTitle>Mot de passe mis à jour</AuthTitle>
          <AuthSubtitle>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</AuthSubtitle>
        </div>
        <Button
          render={<Link to={ROUTE_CONNEXION} replace />}
          className="mt-6 h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90"
        >
          Se connecter
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    );
  }

  async function valider(v: ReinitialiserMotDePasseValues) {
    reinitialiser.reset();
    try {
      await reinitialiser.mutateAsync({
        token: token as string,
        nouveauMotDePasse: v.nouveauMotDePasse,
        confirmation: v.confirmation,
      });
      setTermine(true);
    } catch (e) {
      const code = (e as Partial<ApiErreur>).code;
      if (code === "JETON_EXPIRE" || code === "JETON_INVALIDE") setProbleme(code);
    }
  }

  const erreurGenerale =
    reinitialiser.isError &&
    !["JETON_EXPIRE", "JETON_INVALIDE"].includes((reinitialiser.error as Partial<ApiErreur>).code ?? "")
      ? ((reinitialiser.error as Partial<ApiErreur>).message ?? "Une erreur est survenue. Réessayez.")
      : null;

  return (
    <div>
      <div className="text-center">
        <AuthTitle>Nouveau mot de passe</AuthTitle>
        <AuthSubtitle>Choisissez un mot de passe pour sécuriser votre compte professionnel.</AuthSubtitle>
      </div>

      <form noValidate onSubmit={form.handleSubmit(valider)} className="mt-8 space-y-4">
        <Field
          label="Nouveau mot de passe"
          htmlFor="nouveauMotDePasse"
          required
          error={erreurs.nouveauMotDePasse?.message}
        >
          <PasswordInput
            id="nouveauMotDePasse"
            autoComplete="new-password"
            placeholder="••••••••"
            {...form.register("nouveauMotDePasse")}
          />
        </Field>
        <Field label="Confirmation" htmlFor="confirmation" required error={erreurs.confirmation?.message}>
          <PasswordInput
            id="confirmation"
            autoComplete="new-password"
            placeholder="••••••••"
            {...form.register("confirmation")}
          />
        </Field>
        <p className="-mt-2 text-xs text-navy/40">Au moins 8 caractères avec 1 chiffre et 1 symbole.</p>

        {erreurGenerale && (
          <p role="alert" className="text-sm text-red-600">
            {erreurGenerale}
          </p>
        )}

        <Button
          type="submit"
          disabled={reinitialiser.isPending}
          className="h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
        >
          {reinitialiser.isPending ? (
            "Enregistrement…"
          ) : (
            <>
              Enregistrer le mot de passe
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
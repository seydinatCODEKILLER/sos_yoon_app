import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { AuthTitle, AuthSubtitle } from "@/shared/components/AuthShell";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDemanderLienMotDePasse } from "../hooks/useMotDePasse";
import { INPUT_CLASS } from "../lib/registerFormHelpers";
import { motDePasseOublieSchema, type MotDePasseOublieValues } from "../schema/motDePasse.schema";
import { Field } from "./RegisterProFields";

const ROUTE_CONNEXION = "/login/professionnel";
const DELAI_RENVOI_SECONDES = 60;

export function MotDePasseOublieForm() {
  const demander = useDemanderLienMotDePasse();
  const [emailEnvoye, setEmailEnvoye] = useState<string | null>(null);
  const [restant, setRestant] = useState(0);

  const form = useForm<MotDePasseOublieValues>({
    resolver: zodResolver(motDePasseOublieSchema),
    defaultValues: { email: "" },
  });

  // Compte à rebours avant de pouvoir renvoyer le lien
  useEffect(() => {
    if (restant <= 0) return;
    const id = setTimeout(() => setRestant((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [restant]);

  async function envoyer(email: string) {
    demander.reset();
    try {
      await demander.mutateAsync(email);
      setEmailEnvoye(email);
      setRestant(DELAI_RENVOI_SECONDES);
    } catch {
      /* l'erreur est lue via demander.error */
    }
  }

  if (emailEnvoye) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-signal/10 text-signal">
          <MailCheck className="size-7" aria-hidden />
        </span>
        <div className="mt-5">
          <AuthTitle>Vérifiez votre boîte mail</AuthTitle>
          <AuthSubtitle>
            Si un compte existe pour <span className="font-semibold text-ink">{emailEnvoye}</span>, vous recevrez un
            lien pour choisir un nouveau mot de passe.
          </AuthSubtitle>
        </div>

        <p className="mt-4 text-xs text-navy/50">
          Rien reçu ? Vérifiez vos courriers indésirables, puis renvoyez le lien.
        </p>

        {demander.isError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {(demander.error as Partial<ApiErreur>).message ?? "Envoi impossible. Réessayez."}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          disabled={restant > 0 || demander.isPending}
          onClick={() => envoyer(emailEnvoye)}
          className="mt-5 h-10.5 w-full rounded-lg border-ink/10 text-sm font-medium"
        >
          {demander.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Envoi…
            </>
          ) : restant > 0 ? (
            `Renvoyer le lien (${restant} s)`
          ) : (
            "Renvoyer le lien"
          )}
        </Button>

        <Link
          to={ROUTE_CONNEXION}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <AuthTitle>Mot de passe oublié ?</AuthTitle>
        <AuthSubtitle>
          Saisissez l'adresse e-mail de votre compte professionnel. Nous vous enverrons un lien pour le réinitialiser.
        </AuthSubtitle>
      </div>

      <form noValidate onSubmit={form.handleSubmit((v) => envoyer(v.email))} className="mt-8 space-y-4">
        <Field label="Adresse e-mail" htmlFor="email" required error={form.formState.errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nom.prenom@exemple.com"
            className={INPUT_CLASS}
            {...form.register("email")}
          />
        </Field>

        {demander.isError && (
          <p role="alert" className="text-sm text-red-600">
            {(demander.error as Partial<ApiErreur>).message ?? "Envoi impossible. Réessayez."}
          </p>
        )}

        <Button
          type="submit"
          disabled={demander.isPending}
          className="h-10.5 w-full gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
        >
          {demander.isPending ? (
            "Envoi en cours…"
          ) : (
            <>
              Envoyer le lien
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link
          to={ROUTE_CONNEXION}
          className="inline-flex items-center gap-1.5 font-medium text-ink/70 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
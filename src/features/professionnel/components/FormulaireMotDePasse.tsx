import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck } from "lucide-react";
import { toApiErreur } from "@/shared/lib/apiError";
import { Button } from "@/shared/components/ui/button";
import { authErrorMessage } from "@/features/auth/lib/authErrors";
import { Field, PasswordInput } from "@/features/auth/components/RegisterProFields";
import { useChangerMotDePasse } from "../hooks/useProfilEdition";
import { changerMotDePasseSchema, type ChangerMotDePasseValues } from "../schema/changerMotDePasseSchema";

/** Onglet « Sécurité » : changement du mot de passe (spec 4.7) */
export function FormulaireMotDePasse() {
  const changer = useChangerMotDePasse();
  const form = useForm<ChangerMotDePasseValues>({
    resolver: zodResolver(changerMotDePasseSchema),
    defaultValues: { ancienMotDePasse: "", nouveauMotDePasse: "", confirmation: "" },
  });
  const { errors } = form.formState;

  async function enregistrer(v: ChangerMotDePasseValues) {
    changer.reset();
    try {
      await changer.mutateAsync({
        ancienMotDePasse: v.ancienMotDePasse,
        nouveauMotDePasse: v.nouveauMotDePasse,
      });
      form.reset();
    } catch (e) {
      const erreur = toApiErreur(e);
      if (erreur.code === "ANCIEN_MOT_DE_PASSE_INCORRECT") {
        form.setError("ancienMotDePasse", { message: authErrorMessage(e) });
      }
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(enregistrer)}
      noValidate
      className="space-y-4 rounded-xl border border-ink/10 bg-white p-5"
    >
      <div>
        <h3 className="text-base font-bold text-ink">Mot de passe</h3>
        <p className="mt-1 text-sm text-ink/60">
          Choisissez un mot de passe que vous n'utilisez nulle part ailleurs.
        </p>
      </div>

      <div className="grid gap-4 sm:max-w-md">
        <Field
          label="Mot de passe actuel"
          htmlFor="mdp-ancien"
          required
          error={errors.ancienMotDePasse?.message}
        >
          <PasswordInput
            id="mdp-ancien"
            autoComplete="current-password"
            placeholder="••••••••"
            {...form.register("ancienMotDePasse")}
          />
        </Field>
        <Field
          label="Nouveau mot de passe"
          htmlFor="mdp-nouveau"
          required
          error={errors.nouveauMotDePasse?.message}
          hint="Au moins 8 caractères avec 1 chiffre et 1 symbole."
        >
          <PasswordInput
            id="mdp-nouveau"
            autoComplete="new-password"
            placeholder="••••••••"
            {...form.register("nouveauMotDePasse")}
          />
        </Field>
        <Field
          label="Confirmation"
          htmlFor="mdp-confirmation"
          required
          error={errors.confirmation?.message}
        >
          <PasswordInput
            id="mdp-confirmation"
            autoComplete="new-password"
            placeholder="••••••••"
            {...form.register("confirmation")}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {changer.isError && toApiErreur(changer.error).code !== "ANCIEN_MOT_DE_PASSE_INCORRECT" && (
          <p role="alert" className="flex items-center gap-2 text-sm text-red-600 sm:mr-auto">
            <CircleAlert className="size-4" aria-hidden />
            {authErrorMessage(changer.error)}
          </p>
        )}
        {changer.isSuccess && (
          <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 sm:mr-auto">
            <CircleCheck className="size-4" aria-hidden />
            Mot de passe modifié.
          </p>
        )}
        <Button
          type="submit"
          disabled={changer.isPending}
          className="bg-signal font-semibold text-white hover:bg-signal/90"
        >
          {changer.isPending ? "Enregistrement…" : "Modifier le mot de passe"}
        </Button>
      </div>
    </form>
  );
}
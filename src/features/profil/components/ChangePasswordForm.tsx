import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "@/shared/lib/toast";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schema/profil.schema";
import { useChangePassword } from "../hooks/useChangePassword";

interface ChangePasswordFormProps {
  /** Route de destination après succès. Si absent, reste sur place. */
  redirectTo?: string;
  /** false pour le changement forcé de première connexion (pas de mot de passe actuel à saisir). */
  requireCurrentPassword?: boolean;
}

export function ChangePasswordForm({
  redirectTo,
  requireCurrentPassword = true,
}: ChangePasswordFormProps) {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Mot de passe mis à jour");
        if (redirectTo) navigate(redirectTo);
      },
      onError: () => {
        toast.error(
          "Échec de la mise à jour",
          "Vérifiez votre mot de passe actuel et réessayez.",
        );
      },
    });
  };

  const inputType = showPasswords ? "text" : "password";

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {requireCurrentPassword && (
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword" className="text-paper/80">
            Mot de passe actuel
          </Label>
          <Input
            id="currentPassword"
            type={inputType}
            autoComplete="current-password"
            placeholder="••••••••"
            className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
            {...register("currentPassword")}
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-400">
              {errors.currentPassword.message}
            </p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-paper/80">
          Nouveau mot de passe
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={inputType}
            autoComplete="new-password"
            placeholder="••••••••"
            className="border-paper/15 bg-paper/5 pr-10 text-paper placeholder:text-paper/30"
            {...register("newPassword")}
          />
          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-paper/40 hover:text-paper/70"
            aria-label={
              showPasswords
                ? "Masquer les mots de passe"
                : "Afficher les mots de passe"
            }
          >
            {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-xs text-red-400">{errors.newPassword.message}</p>
        )}
        <p className="text-xs text-paper/40">
          8 caractères minimum, avec une majuscule et un chiffre.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-paper/80">
          Confirmer le mot de passe
        </Label>
        <Input
          id="confirmPassword"
          type={inputType}
          autoComplete="new-password"
          placeholder="••••••••"
          className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={changePassword.isPending}
        className="w-full bg-signal text-ink hover:bg-signal/90"
      >
        {changePassword.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mise à jour...
          </>
        ) : (
          "Mettre à jour le mot de passe"
        )}
      </Button>
    </form>
  );
}

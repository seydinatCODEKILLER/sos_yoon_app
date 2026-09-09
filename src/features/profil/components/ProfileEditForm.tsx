import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { User } from "@/types/user.types";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import {
  updateProfilSchema,
  type UpdateProfilFormValues,
} from "../schema/profil.schema";
import { getErrorMessage } from "@/shared/lib/errorHandler";
import { toast } from "@/shared/lib/toast";

interface ProfileEditFormProps {
  user: User;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilFormValues>({
    resolver: zodResolver(updateProfilSchema),
    defaultValues: {
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone ?? "",
    },
  });

  const onSubmit = (values: UpdateProfilFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success("Profil mis à jour"),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-2xl border border-border bg-white p-6"
    >
      <h2 className="text-sm font-semibold text-ink">
        Informations personnelles
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="prenom">Prénom</Label>
          <Input id="prenom" {...register("prenom")} />
          {errors.prenom && (
            <p className="text-xs text-red-500">{errors.prenom.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nom">Nom</Label>
          <Input id="nom" {...register("nom")} />
          {errors.nom && (
            <p className="text-xs text-red-500">{errors.nom.message}</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label>Email</Label>
        <Input value={user.email} disabled className="bg-paper" />
        <p className="text-xs text-muted-foreground">
          L'email ne peut pas être modifié pour l'instant.
        </p>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label htmlFor="telephone">Téléphone</Label>
        <Input id="telephone" type="tel" {...register("telephone")} />
        {errors.telephone && (
          <p className="text-xs text-red-500">{errors.telephone.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isDirty || updateProfile.isPending}
        className="mt-5 bg-signal text-ink hover:bg-signal/90"
      >
        {updateProfile.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </>
        )}
      </Button>
    </form>
  );
}

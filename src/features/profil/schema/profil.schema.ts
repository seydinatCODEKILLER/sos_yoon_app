import { telephoneSchema } from "@/shared/lib/validators";
import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis").optional(),
    newPassword: z
      .string()
      .min(8, "8 caractères minimum")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/[0-9]/, "Au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const updateProfilSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: telephoneSchema,
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type UpdateProfilFormValues = z.infer<typeof updateProfilSchema>;

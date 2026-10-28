import { z } from "zod";

export const profilAdminSchema = z.object({
  prenom: z.string().trim().min(2, "Le prénom est obligatoire."),
  nom: z.string().trim().min(2, "Le nom est obligatoire."),
  // 9 chiffres, sans l'indicatif +221
  telephone: z.string().regex(/^7[05678]( ?\d){7}$/, "Numéro invalide (ex. 77 123 45 67)."),
});
export type ProfilAdminValeurs = z.infer<typeof profilAdminSchema>;

export const motDePasseAdminSchema = z
  .object({
    ancien: z.string().min(1, "Saisissez votre mot de passe actuel."),
    nouveau: z
      .string()
      .min(8, "8 caractères minimum.")
      .regex(/\d/, "Au moins un chiffre.")
      .regex(/[^A-Za-z0-9]/, "Au moins un symbole."),
    confirmation: z.string().min(1, "Confirmez le nouveau mot de passe."),
  })
  .refine((d) => d.nouveau === d.confirmation, {
    path: ["confirmation"],
    message: "Les mots de passe ne correspondent pas.",
  })
  .refine((d) => d.nouveau !== d.ancien, {
    path: ["nouveau"],
    message: "Le nouveau mot de passe doit être différent de l'ancien.",
  });
export type MotDePasseAdminValeurs = z.infer<typeof motDePasseAdminSchema>;
import { z } from "zod";

/** Numéro sénégalais sans l'indicatif : 70, 75, 76, 77 ou 78 + 7 chiffres (espaces tolérés). */
export const profilAdminSchema = z.object({
  prenom: z.string().trim().min(1, "Le prénom est obligatoire.").max(60, "60 caractères maximum."),
  nom: z.string().trim().min(1, "Le nom est obligatoire.").max(60, "60 caractères maximum."),
  telephone: z
    .string()
    .trim()
    .regex(/^7[05678]( ?\d){7}$/, "Numéro invalide (ex. 77 123 45 67)."),
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
  .refine((v) => v.nouveau === v.confirmation, {
    path: ["confirmation"],
    message: "Les deux mots de passe ne correspondent pas.",
  })
  .refine((v) => v.nouveau !== v.ancien, {
    path: ["nouveau"],
    message: "Le nouveau mot de passe doit être différent de l'actuel.",
  });
export type MotDePasseAdminValeurs = z.infer<typeof motDePasseAdminSchema>;
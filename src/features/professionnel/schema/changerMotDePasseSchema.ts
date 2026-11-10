import { z } from "zod";

/** Même règle qu'à l'inscription : 8 caractères, 1 chiffre, 1 symbole */
const regleMotDePasse = z
  .string()
  .min(8, "Au moins 8 caractères.")
  .regex(/\d/, "Au moins 1 chiffre.")
  .regex(/[^A-Za-z0-9]/, "Au moins 1 symbole.");

export const changerMotDePasseSchema = z
  .object({
    ancienMotDePasse: z.string().min(1, "Saisissez votre mot de passe actuel."),
    nouveauMotDePasse: regleMotDePasse,
    confirmation: z.string().min(1, "Confirmez votre nouveau mot de passe."),
  })
  .refine((v) => v.nouveauMotDePasse === v.confirmation, {
    path: ["confirmation"],
    message: "Les mots de passe ne correspondent pas.",
  })
  .refine((v) => v.nouveauMotDePasse !== v.ancienMotDePasse, {
    path: ["nouveauMotDePasse"],
    message: "Choisissez un mot de passe différent de l'actuel.",
  });

export type ChangerMotDePasseValues = z.infer<typeof changerMotDePasseSchema>;
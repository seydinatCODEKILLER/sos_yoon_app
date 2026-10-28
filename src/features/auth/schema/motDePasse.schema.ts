import { z } from "zod";

/** Même règle qu'à l'inscription : 8 caractères, 1 chiffre, 1 symbole */
const regleMotDePasse = z
  .string()
  .min(8, "Au moins 8 caractères.")
  .regex(/\d/, "Au moins 1 chiffre.")
  .regex(/[^A-Za-z0-9]/, "Au moins 1 symbole.");

export const motDePasseOublieSchema = z.object({
  email: z.string().trim().min(1, "Saisissez votre adresse e-mail.").pipe(z.email("Adresse e-mail invalide.")),
});

export const reinitialiserMotDePasseSchema = z
  .object({
    nouveauMotDePasse: regleMotDePasse,
    confirmation: z.string().min(1, "Confirmez votre mot de passe."),
  })
  .refine((v) => v.nouveauMotDePasse === v.confirmation, {
    path: ["confirmation"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type MotDePasseOublieValues = z.infer<typeof motDePasseOublieSchema>;
export type ReinitialiserMotDePasseValues = z.infer<typeof reinitialiserMotDePasseSchema>;
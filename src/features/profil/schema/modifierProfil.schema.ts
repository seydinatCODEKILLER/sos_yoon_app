import { z } from "zod";

export const modifierProfilSchema = z.object({
  prenom: z
    .string()
    .trim()
    .min(2, "Saisissez votre prénom.")
    .max(60, "Prénom trop long."),
  nom: z
    .string()
    .trim()
    .min(2, "Saisissez votre nom.")
    .max(60, "Nom trop long."),
  email: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || z.email().safeParse(v).success,
      "Adresse e-mail invalide.",
    ),
  regionId: z.number().nullable(),
  communeId: z.number().nullable(),
});

export type ModifierProfilValues = z.infer<typeof modifierProfilSchema>;
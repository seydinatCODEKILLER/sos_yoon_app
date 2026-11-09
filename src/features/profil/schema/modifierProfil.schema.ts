import { z } from "zod";

export const modifierProfilSchema = z.object({
  prenom: z
    .string()
    .trim()
    .min(2, "Saisissez votre prénom.")
    .max(80, "Prénom trop long."),
  nom: z
    .string()
    .trim()
    .min(2, "Saisissez votre nom.")
    .max(80, "Nom trop long."),
  /** Facultatif : vide = pas d'e-mail */
  email: z.string().trim().email("Adresse e-mail invalide.").or(z.literal("")),
  regionId: z.string().nullable(),
  zoneId: z.string().nullable(),
});

export type ModifierProfilValues = z.infer<typeof modifierProfilSchema>;

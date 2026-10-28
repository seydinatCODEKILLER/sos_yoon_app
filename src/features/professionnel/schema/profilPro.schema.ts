import { z } from "zod";

export const profilProSchema = z.object({
  prenom: z.string().trim().min(2, "Prénom requis.").max(60),
  nom: z.string().trim().min(2, "Nom requis.").max(60),
  telephone: z
    .string()
    .trim()
    .regex(/^(\+221)?\s?7[0-8](\s?\d){7}$/, "Numéro invalide (ex. 77 123 45 67)."),
  adresseCabinet: z.string().trim().min(3, "Adresse requise.").max(200, "200 caractères maximum."),
});

export type ProfilProValues = z.infer<typeof profilProSchema>;
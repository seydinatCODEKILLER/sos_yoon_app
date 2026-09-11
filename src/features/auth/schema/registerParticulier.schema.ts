import { z } from "zod";

export const registerParticulierSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom est trop long"),
  telephone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s]+$/, "Numéro de téléphone invalide"),
});

export type RegisterParticulierValues = z.infer<typeof registerParticulierSchema>;
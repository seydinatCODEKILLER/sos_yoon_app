import { z } from "zod";

export const registerParticulierSchema = z.object({
  telephone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s]+$/, "Numéro de téléphone invalide"),
});

export type RegisterParticulierValues = z.infer<typeof registerParticulierSchema>;
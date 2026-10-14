import { z } from "zod";

export const loginParticulierSchema = z.object({
  telephone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s]+$/, "Numéro de téléphone invalide"),

    codeSecret: z.string().regex(/^\d{4}$/, "Saisissez les 4 chiffres de votre code"),
});

export type LoginParticulierValues = z.infer<typeof loginParticulierSchema>;
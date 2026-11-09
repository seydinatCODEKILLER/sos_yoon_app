import { z } from "zod";
import { isValidSnPhone } from "../lib/phone";

export const loginParticulierSchema = z.object({
  telephone: z
    .string()
    .min(1, "Saisissez votre numéro de téléphone")
    .refine(isValidSnPhone, "Numéro de téléphone invalide (9 chiffres, ex. 77 123 45 67)"),

  codeSecret: z.string().regex(/^\d{4}$/, "Saisissez les 4 chiffres de votre code"),
});

export type LoginParticulierValues = z.infer<typeof loginParticulierSchema>;
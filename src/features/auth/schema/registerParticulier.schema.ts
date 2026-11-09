import { z } from "zod";
import { isValidSnPhone } from "../lib/phone";

export const registerParticulierSchema = z.object({
  telephone: z
    .string()
    .min(1, "Saisissez votre numéro de téléphone")
    .refine(isValidSnPhone, "Numéro de téléphone invalide (9 chiffres, ex. 77 123 45 67)"),
});

export type RegisterParticulierValues = z.infer<typeof registerParticulierSchema>;
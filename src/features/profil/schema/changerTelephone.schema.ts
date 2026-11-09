import { z } from "zod";
import { isValidSnPhone } from "@/features/auth/lib/phone";

export const changerTelephoneSchema = z.object({
  telephone: z
    .string()
    .min(1, "Saisissez le nouveau numéro")
    .refine(isValidSnPhone, "Numéro de téléphone invalide (9 chiffres, ex. 78 111 22 33)"),
});

export type ChangerTelephoneValues = z.infer<typeof changerTelephoneSchema>;
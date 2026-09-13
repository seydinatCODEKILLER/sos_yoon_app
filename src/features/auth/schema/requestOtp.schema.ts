import { z } from "zod";

export const requestOtpSchema = z.object({
  telephone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s]+$/, "Numéro de téléphone invalide"),
});

export type RequestOtpValues = z.infer<typeof requestOtpSchema>;
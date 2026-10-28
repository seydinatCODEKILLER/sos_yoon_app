import { z } from "zod";

export const paiementSchema = z.object({
  moyenPaiement: z.enum(["WAVE", "ORANGE_MONEY"]),
  telephonePaiement: z
    .string()
    .trim()
    .regex(/^(\+221)?\s?7[0-8](\s?\d){7}$/, "Numéro invalide (ex. 77 123 45 67)."),
});

export type PaiementValues = z.infer<typeof paiementSchema>;
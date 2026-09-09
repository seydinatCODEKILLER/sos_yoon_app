import { z } from "zod";

export const telephoneSchema = z
  .string()
  .regex(
    /^(\+221)?7[0-8]\d{7}$/,
    "Numéro de téléphone invalide (ex: 771234567)",
  )
  .optional()
  .or(z.literal(""));
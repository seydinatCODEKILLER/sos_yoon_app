import { z } from "zod";

export const DESCRIPTION_MAX = 1000;

export const demandeEcriteSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Décrivez votre situation pour continuer.")
    .max(DESCRIPTION_MAX, `${DESCRIPTION_MAX} caractères maximum.`),
  motsCles: z.array(z.string()),
});

export type DemandeEcriteValues = z.infer<typeof demandeEcriteSchema>;
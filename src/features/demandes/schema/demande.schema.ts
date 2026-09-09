import { z } from "zod";

export const createDemandeSchema = z.object({
  descriptionTexte: z
    .string()
    .min(5, "Décrivez votre situation en au moins 5 caractères")
    .max(2000, "Description trop longue (2000 caractères max.)"),
});

export type CreateDemandeFormValues = z.infer<typeof createDemandeSchema>;
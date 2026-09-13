import { z } from "zod";

export const writtenRequestSchema = z.object({
  message: z
    .string()
    .min(10, "Décrivez votre situation en quelques mots (10 caractères min.)")
    .max(2000, "Le message est trop long"),
});

export type WrittenRequestValues = z.infer<typeof writtenRequestSchema>;
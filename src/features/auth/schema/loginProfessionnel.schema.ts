import { z } from "zod";

export const loginProfessionnelSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type LoginProfessionnelValues = z.infer<typeof loginProfessionnelSchema>;
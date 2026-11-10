import { z } from "zod";

export const loginProfessionnelSchema = z.object({
  email: z.string().trim().min(1, "L'email est requis").pipe(z.email("Email invalide")),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export type LoginProfessionnelValues = z.infer<typeof loginProfessionnelSchema>;
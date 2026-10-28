import { z } from "zod";

export const loginAdminSchema = z.object({
  email: z.string().trim().min(1, "Saisissez votre adresse e-mail.").pipe(z.email("Adresse e-mail invalide.")),
  motDePasse: z.string().min(1, "Saisissez votre mot de passe."),
});

export type LoginAdminValues = z.infer<typeof loginAdminSchema>;
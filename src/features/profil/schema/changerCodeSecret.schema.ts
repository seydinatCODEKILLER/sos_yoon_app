import { z } from "zod";
import { isCodeTrivial } from "@/features/auth/lib/codeSecret";

const code4Chiffres = z.string().regex(/^\d{4}$/);

export const changerCodeSecretSchema = z
  .object({
    codeActuel: code4Chiffres.or(z.string().min(0)).pipe(
      z.string().regex(/^\d{4}$/, "Saisissez votre code actuel."),
    ),
    nouveauCode: z
      .string()
      .regex(/^\d{4}$/, "Saisissez 4 chiffres.")
      .refine((c) => !isCodeTrivial(c), "Code trop simple, choisissez-en un autre."),
    confirmation: z.string().regex(/^\d{4}$/, "Confirmez votre nouveau code."),
  })
  .refine((d) => d.nouveauCode === d.confirmation, {
    path: ["confirmation"],
    message: "Les deux codes ne correspondent pas.",
  })
  .refine((d) => d.nouveauCode !== d.codeActuel, {
    path: ["nouveauCode"],
    message: "Le nouveau code doit être différent de l'actuel.",
  });

export type ChangerCodeSecretValues = z.infer<typeof changerCodeSecretSchema>;
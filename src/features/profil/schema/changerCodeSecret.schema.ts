import { z } from "zod";
import { isCodeTrivial } from "@/features/auth/lib/codeSecret";

/**
 * avecCodeActuel = true  : l'utilisateur a déjà un code (le serveur exige l'ancien)
 * avecCodeActuel = false : compte créé sans code secret (parcours « demande d'abord »),
 *                          il n'a rien à saisir en « code actuel »
 */
export function makeChangerCodeSecretSchema(avecCodeActuel: boolean) {
  return z
    .object({
      codeActuel: avecCodeActuel
        ? z.string().regex(/^\d{4}$/, "Saisissez votre code actuel.")
        : z.string().optional(),
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
    .refine((d) => !avecCodeActuel || d.nouveauCode !== d.codeActuel, {
      path: ["nouveauCode"],
      message: "Le nouveau code doit être différent de l'actuel.",
    });
}

export type ChangerCodeSecretValues = z.infer<
  ReturnType<typeof makeChangerCodeSecretSchema>
>;
import { z } from "zod";

export const TYPES_RDV = ["CABINET", "VISIO", "APPEL", "AUDIENCE"] as const;

export const rendezVousSchema = z
  .object({
    titre: z.string().trim().min(2, "Saisissez un titre.").max(120, "120 caractères maximum."),
    type: z.enum(TYPES_RDV, { error: "Choisissez un type." }),
    date: z.string().min(1, "Choisissez une date."),
    heureDebut: z.string().min(1, "Heure de début requise."),
    heureFin: z.string().min(1, "Heure de fin requise."),
    lieu: z.string().trim().max(160, "160 caractères maximum."),
    /** "AUCUN" = pas de dossier lié */
    dossierDemandeId: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.heureDebut && v.heureFin && v.heureFin <= v.heureDebut) {
      ctx.addIssue({
        code: "custom",
        path: ["heureFin"],
        message: "L'heure de fin doit suivre l'heure de début.",
      });
    }
  });

export type RendezVousValues = z.infer<typeof rendezVousSchema>;
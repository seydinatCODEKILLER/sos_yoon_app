import { z } from "zod";
import { MOTIFS_REFUS_CODES } from "../lib/motifsRefus";

export const refusSollicitationSchema = z
  .object({
    motif: z.enum(MOTIFS_REFUS_CODES, { error: "Choisissez un motif." }),
    commentaire: z.string().trim().max(500, "500 caractères maximum."),
  })
  .superRefine((v, ctx) => {
    if (v.motif === "AUTRE" && v.commentaire.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["commentaire"],
        message: "Précisez votre motif.",
      });
    }
  });

export type RefusSollicitationValues = z.infer<typeof refusSollicitationSchema>;
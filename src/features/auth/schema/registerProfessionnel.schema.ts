import { z } from "zod";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

export const registerProfessionnelSchema = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom est trop long"),
  telephone: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .regex(/^[0-9+\s]+$/, "Numéro de téléphone invalide"),
  zoneIntervention: z.string().min(1, "Sélectionnez votre zone d'intervention"),
  numeroOrdre: z
    .string()
    .min(3, "Numéro d'inscription à l'ordre invalide")
    .max(30, "Numéro d'inscription à l'ordre invalide"),
  diplome: z
    .any()
    .refine(
      (files) => files instanceof FileList && files.length === 1,
      "Le diplôme est requis"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
      `Le fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB} Mo`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Formats acceptés : PDF, JPG, PNG"
    ),
});

export type RegisterProfessionnelValues = z.infer<
  typeof registerProfessionnelSchema
>;

export const REGISTER_PROFESSIONNEL_STEPS = [
  {
    id: "personnel",
    title: "Informations personnelles",
    fields: ["nom", "prenom", "telephone"] as const,
  },
  {
    id: "professionnel",
    title: "Informations professionnelles",
    fields: ["zoneIntervention", "numeroOrdre"] as const,
  },
  {
    id: "documents",
    title: "Documents justificatifs",
    fields: ["diplome"] as const,
  },
] as const;
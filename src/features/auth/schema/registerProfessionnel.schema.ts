import { z } from "zod";
import type { Metier } from "@/types/user.types";
import { DOCUMENTS_BY_METIER } from "../lib/professionalConfig";

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const METIER_VALUES: [Metier, ...Metier[]] = [
  "AVOCAT",
  "HUISSIER",
  "NOTAIRE",
  "JURISTE_CONSEIL",
];

/* ── Étape 1 : compte ───────────────────────────────────────── */

const step1Object = z.object({
  prenom: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom est trop long"),
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom est trop long"),
  telephone: z
    .string()
    .refine(
      (v) => /^7[05678]\d{7}$/.test(v.replace(/\s/g, "")),
      "Numéro invalide (ex. 77 123 45 67)",
    ),
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Au moins 8 caractères")
    .regex(/[0-9]/, "Au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Au moins un symbole"),
  confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
});

export const step1Schema = step1Object.refine(
  (d) => d.password === d.confirmPassword,
  { message: "Les mots de passe ne correspondent pas", path: ["confirmPassword"] },
);

/* ── Étape 2 : profil professionnel ─────────────────────────── */

const metierField = z.enum(METIER_VALUES, {
  error: () => "Sélectionnez votre type de professionnel",
});

const step2Object = z.object({
  metier: metierField,
  numeroOrdre: z.string().max(30, "Numéro trop long"),
  organisme: z.string(),
  anneeInscription: z.string().min(1, "Sélectionnez une année"),
  anneesExperience: z.string().min(1, "Sélectionnez une tranche"),
  specialites: z.array(z.string()).min(1, "Sélectionnez au moins une spécialité"),
});

export const step2Schema = step2Object.superRefine((d, ctx) => {
  // Le juriste-conseil n'a pas d'ordre : numéro et organisme facultatifs
  if (d.metier === "JURISTE_CONSEIL") return;
  if (d.numeroOrdre.trim().length < 3) {
    ctx.addIssue({
      code: "custom",
      path: ["numeroOrdre"],
      message: "Numéro professionnel invalide",
    });
  }
  if (!d.organisme) {
    ctx.addIssue({
      code: "custom",
      path: ["organisme"],
      message: "Sélectionnez votre organisme",
    });
  }
});

/* ── Étape 3 : documents (dépend du métier) ─────────────────── */

const step3Object = z.object({
  metier: metierField,
  diplome: z.any().optional(),
  pieceIdentite: z.any().optional(),
  carteProfessionnelle: z.any().optional(),
  declarationHonneur: z.boolean(),
});

function checkFile(
  value: unknown,
  required: boolean,
  path: string,
  label: string,
  ctx: z.RefinementCtx,
) {
  const file = value instanceof FileList ? value[0] : undefined;
  if (!file) {
    if (required) {
      ctx.addIssue({ code: "custom", path: [path], message: `${label} requis` });
    }
    return;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    ctx.addIssue({
      code: "custom",
      path: [path],
      message: `Le fichier ne doit pas dépasser ${MAX_FILE_SIZE_MB} Mo`,
    });
  } else if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    ctx.addIssue({
      code: "custom",
      path: [path],
      message: "Formats acceptés : PDF, JPG, PNG",
    });
  }
}

export const step3Schema = step3Object.superRefine((d, ctx) => {
  const config = DOCUMENTS_BY_METIER[d.metier];
  for (const doc of config.documents) {
    checkFile(d[doc.field], doc.required, doc.field, doc.label, ctx);
  }
  if (config.declaration && !d.declarationHonneur) {
    ctx.addIssue({
      code: "custom",
      path: ["declarationHonneur"],
      message: "Vous devez cocher la déclaration sur l'honneur",
    });
  }
});

/* ── Étape 4 : localisation ─────────────────────────────────── */

const step4Schema = z.object({
  region: z.string().min(1, "Sélectionnez une région"),
  ville: z.string().min(2, "Renseignez la ville ou le département"),
  commune: z.string().min(2, "Renseignez la commune ou la zone"),
  adresse: z.string().min(5, "Renseignez l'adresse professionnelle"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/* ── Étape 5 : présentation ─────────────────────────────────── */

export const BIO_MAX_LENGTH = 1000;

const step5Schema = z.object({
  biographie: z
    .string()
    .min(50, "Présentez-vous en au moins 50 caractères")
    .max(BIO_MAX_LENGTH, `${BIO_MAX_LENGTH} caractères maximum`),
  langues: z.array(z.string()).min(1, "Sélectionnez au moins une langue"),
  tarifConsultation: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^\d+$/.test(v.replace(/\s/g, "")),
      "Montant invalide",
    ),
  modaliteFacturation: z.string().optional(),
});

/* ── Export ─────────────────────────────────────────────────── */

const fullObject = z.object({
  ...step1Object.shape,
  ...step2Object.shape,
  ...step3Object.shape,
  ...step4Schema.shape,
  ...step5Schema.shape,
});

export type RegisterProfessionnelValues = z.infer<typeof fullObject>;

export const STEP_SCHEMAS = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
] as const;

export const REGISTER_PROFESSIONNEL_STEPS = [
  { id: "compte", title: "Créez votre compte" },
  { id: "profil", title: "Votre profil professionnel" },
  { id: "verification", title: "Vérification professionnelle" },
  { id: "localisation", title: "Localisation et disponibilité" },
  { id: "presentation", title: "Présentation et confirmation" },
] as const;
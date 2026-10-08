import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  REGISTER_PROFESSIONNEL_STEPS,
  STEP_SCHEMAS,
  type RegisterProfessionnelValues,
} from "../schema/registerProfessionnel.schema";
import { DOCUMENTS_BY_METIER } from "../lib/professionalConfig";
import { useRegisterProfessionnel } from "../hooks/useRegisterProfessionnel";
import {
  StepAccount,
  StepDocuments,
  StepLocation,
  StepPresentation,
  StepProfile,
} from "./RegisterProfessionnelSteps";

const CTA = [
  "Étape suivante",
  "Continuer vers l'étape 3",
  "Continuer vers l'étape 4",
  "Continuer vers la finalisation (Étape 5)",
  "Confirmer et soumettre mon inscription",
];

const NOTES = [
  null,
  "En continuant, vous confirmez l'exactitude des informations ordinales et acceptez les Conditions Générales Déontologiques de SOS Yoon.",
  "En continuant, vous certifiez sur l'honneur l'exactitude et l'authenticité des pièces justificatives téléversées conformément aux Conditions Générales Déontologiques de SOS Yoon.",
  "En validant votre zone d'exercice, vous attestez être habilité à exercer dans ce ressort juridique conformément aux règles de votre ordre professionnel.",
  "Votre demande fera l'objet d'une vérification de conformité auprès de l'ordre professionnel sous un délai de 24 à 48 heures.",
];

export function RegisterProfessionnelForm() {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const { submit, isSubmitting } = useRegisterProfessionnel();

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Resolver dynamique : on ne valide que le schéma de l'étape courante.
  const resolver: Resolver<RegisterProfessionnelValues> = (
    values,
    context,
    options,
  ) =>
    zodResolver(STEP_SCHEMAS[stepRef.current] as never)(
      values,
      context,
      options as never,
    ) as never;

  const form = useForm<RegisterProfessionnelValues>({
    resolver,
    defaultValues: {
      prenom: "",
      nom: "",
      telephone: "",
      email: "",
      password: "",
      confirmPassword: "",
      numeroOrdre: "",
      organisme: "",
      anneeInscription: "",
      anneesExperience: "",
      specialites: [],
      declarationHonneur: false,
      region: "",
      ville: "",
      commune: "",
      adresse: "",
      biographie: "",
      langues: [],
      tarifConsultation: "",
      modaliteFacturation: "",
    },
  });

  const isLastStep = step === REGISTER_PROFESSIONNEL_STEPS.length - 1;
  const total = REGISTER_PROFESSIONNEL_STEPS.length;
  const metier = form.watch("metier");

  const subtitles = [
    "Renseignez vos informations.",
    `Étape 2 sur ${total} — Renseignez vos habilitations et spécialités pour certifier votre compte praticien.`,
    `Étape 3 sur ${total} — Téléversez vos justificatifs officiels pour certifier votre statut de ${
      metier ? DOCUMENTS_BY_METIER[metier].statut : "professionnel du droit"
    }.`,
    `Étape 4 sur ${total} — Définissez votre zone d'exercice principal et vos modalités de réception pour être mis en relation avec les justiciables de votre ressort.`,
    `Étape 5 sur ${total} — Présentez votre profil aux justiciables et confirmez vos engagements déontologiques pour soumettre votre dossier de certification.`,
  ];

  async function handleNext() {
    const valid = await form.trigger();
    if (!valid) return;

    if (!isLastStep) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Garde-fou : on revalide toutes les étapes avant l'envoi
    const values = form.getValues();
    const firstInvalid = STEP_SCHEMAS.findIndex(
      (s) => !s.safeParse(values).success,
    );
    if (firstInvalid !== -1) {
      setStep(firstInvalid);
      return;
    }

    const ok = await submit(values);
    if (ok) {
      // TODO: rediriger vers un écran de confirmation
      // (compte en attente de vérification sous 24-48 h, pas d'accès à /pro immédiat)
    }
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`mx-auto w-full transition-[max-width] ${step === 0 ? "max-w-md" : "max-w-xl"}`}
    >
      {" "}
      <div>
        <h1 className="font-display text-3xl font-bold leading-tight text-ink">
          {REGISTER_PROFESSIONNEL_STEPS[step].title}
        </h1>
        <p className="mt-2 text-sm text-navy/50">{subtitles[step]}</p>
      </div>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
        className="mt-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepAccount form={form} />}
            {step === 1 && <StepProfile form={form} />}
            {step === 2 && <StepDocuments form={form} />}
            {step === 3 && <StepLocation form={form} />}
            {step === 4 && <StepPresentation form={form} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-10.5 shrink-0 gap-1.5 rounded-lg border-ink/10 px-4 text-sm font-medium text-ink hover:bg-ink/5"
            >
              <ArrowLeft className="size-4" />
              {isLastStep ? "Retour à l'étape 4" : "Retour"}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10.5 flex-1 gap-2 rounded-lg bg-signal text-sm font-medium text-white shadow-lg shadow-signal/25 hover:bg-signal/90 disabled:opacity-60"
          >
            {isSubmitting ? (
              "Envoi en cours…"
            ) : (
              <>
                {CTA[step]}
                {isLastStep ? (
                  <Check className="size-4" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
              </>
            )}
          </Button>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-navy/40">
          {NOTES[step] ?? (
            <>
              En continuant, vous acceptez les Conditions Générales
              d'Utilisation et la Politique de Confidentialité de SOS Yoon.
            </>
          )}
        </p>
      </form>
    </div>
  );
}

import { useEffect, useRef, useState, type ReactNode } from "react";
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
  StepProfile,
} from "./RegisterProfessionnelSteps";
import { Link, useNavigate } from "react-router-dom";
import { MentionLegale } from "@/features/legal/components/MentioLegal";

const CTA = [
  "Étape suivante",
  "Continuer vers l'étape 3",
  "Continuer vers l'étape 4",
  "Envoyer ma demande d'inscription",
];

const LIEN_LEGAL = "font-medium underline underline-offset-2 hover:text-signal";

const lienCgu = (
  <Link to="/cgu" target="_blank" rel="noopener" className={LIEN_LEGAL}>
    Conditions générales d'utilisation
  </Link>
);

const NOTES: ReactNode[] = [
  null,
  <>
    En continuant, vous confirmez l'exactitude des informations ordinales et acceptez les {lienCgu} de SOS Yoon.
  </>,
  <>
    En continuant, vous certifiez sur l'honneur l'exactitude et l'authenticité des pièces justificatives téléversées
    conformément aux {lienCgu} de SOS Yoon.
  </>,
  "En envoyant votre demande, vous attestez être habilité à exercer dans ce ressort juridique. Votre dossier fera l'objet d'une vérification de conformité auprès de l'ordre professionnel sous un délai de 24 à 48 heures.",
];

export function RegisterProfessionnelForm() {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  // Acceptation explicite des CGU, demandée à l'envoi du dossier (le serveur exige cguAcceptees = true)
  const [cguAcceptees, setCguAcceptees] = useState(false);
  const [cguErreur, setCguErreur] = useState(false);
  const navigate = useNavigate();
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
      specialites: [],
      declarationHonneur: false,
      regionId: "",
      adresse: "",
    },
  });

  const total = REGISTER_PROFESSIONNEL_STEPS.length;
  const isLastStep = step === total - 1;
  const metier = form.watch("metier");

  const subtitles = [
    "Renseignez vos informations.",
    `Étape 2 sur ${total} — Renseignez vos habilitations et spécialités pour certifier votre compte praticien.`,
    `Étape 3 sur ${total} — Téléversez vos justificatifs officiels pour certifier votre statut de ${
      metier ? DOCUMENTS_BY_METIER[metier].statut : "professionnel du droit"
    }.`,
    `Étape 4 sur ${total} — Définissez votre zone d'exercice principal pour être mis en relation avec les justiciables de votre ressort, puis envoyez votre dossier.`,
  ];

  function allerA(etape: number) {
    setStep(etape);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleNext() {
    if (isLastStep && !cguAcceptees) setCguErreur(true);
    const valid = await form.trigger();
    if (!valid || (isLastStep && !cguAcceptees)) return;

    if (!isLastStep) {
      allerA(step + 1);
      return;
    }

    // Garde-fou : on revalide toutes les étapes avant l'envoi
    const values = form.getValues();
    const firstInvalid = STEP_SCHEMAS.findIndex(
      (s) => !s.safeParse(values).success,
    );
    if (firstInvalid !== -1) {
      allerA(firstInvalid);
      return;
    }

    const resultat = await submit(values);
    if (resultat.ok) {
      // Compte créé, dossier transmis : écran « Demande envoyée » (portée DOSSIER)
      navigate("/pro/validation", { replace: true });
      return;
    }
    // Le serveur a refusé un champ précis : on ramène le professionnel dessus
    if (resultat.champ) {
      form.setError(resultat.champ, { message: resultat.message });
    }
    if (resultat.etape !== undefined) allerA(resultat.etape);
  }

  function handleBack() {
    allerA(Math.max(0, step - 1));
  }

  return (
    <div
      className={`mx-auto w-full transition-[max-width] ${step === 0 ? "max-w-md" : "max-w-xl"}`}
    >
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
          </motion.div>
        </AnimatePresence>

        {isLastStep && (
          <div className="mt-6 space-y-1.5">
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 ${
                cguErreur && !cguAcceptees ? "border-red-400" : "border-ink/10"
              }`}
            >
              <input
                type="checkbox"
                checked={cguAcceptees}
                onChange={(e) => {
                  setCguAcceptees(e.target.checked);
                  if (e.target.checked) setCguErreur(false);
                }}
                className="mt-0.5 size-4 shrink-0 accent-signal"
              />
              <span className="text-sm leading-relaxed text-ink/80">
                J'ai lu et j'accepte les{" "}
                <Link to="/cgu" target="_blank" rel="noopener" className={LIEN_LEGAL}>
                  Conditions générales d'utilisation
                </Link>{" "}
                et la{" "}
                <Link to="/confidentialite" target="_blank" rel="noopener" className={LIEN_LEGAL}>
                  Politique de confidentialité
                </Link>
                .
              </span>
            </label>
            {cguErreur && !cguAcceptees && (
              <p role="alert" className="text-xs text-red-600">
                Acceptez les conditions pour envoyer votre dossier.
              </p>
            )}
          </div>
        )}

        <div className="mt-7 flex items-center gap-3">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-10.5 shrink-0 gap-1.5 rounded-lg border-ink/10 px-4 text-sm font-medium text-ink hover:bg-ink/5"
            >
              <ArrowLeft className="size-4" />
              Retour
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
          {NOTES[step] ?? <MentionLegale />}
        </p>
      </form>
    </div>
  );
}
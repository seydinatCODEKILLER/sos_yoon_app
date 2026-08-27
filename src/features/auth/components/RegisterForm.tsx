import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { getSpaceRoute } from "@/shared/lib/getSpaceRoute";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "../schema/auth.schema";
import { getErrorMessage } from "@/shared/lib/errorHandler";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

type StepField = keyof RegisterFormValues;

interface Step {
  id: string;
  label: string;
  fields: StepField[];
}

const steps: Step[] = [
  { id: "identite", label: "Identité", fields: ["prenom", "nom"] },
  { id: "contact", label: "Contact", fields: ["email", "telephone"] },
  {
    id: "securite",
    label: "Sécurité",
    fields: ["password", "confirmPassword"],
  },
];

export function RegisterForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const goNext = async () => {
    const valid = await trigger(steps[currentStep].fields);
    if (!valid) return;

    if (isLastStep) return;
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...payload } = values;
    registerMutation.mutate(payload, {
      onSuccess: ({ user }) => {
        navigate(getSpaceRoute(user.role));
      },
    });
  };

  // Le form n'est jamais soumis directement par Enter avant la dernière
  // étape : on intercepte, on avance nous-mêmes.
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      goNext();
      return;
    }
    handleSubmit(onSubmit)(e);
  };

  const slideVariants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={container}
      className="mx-auto w-full max-w-sm"
    >
      <motion.div variants={item} className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-signal">
          SOS Yoon
        </p>
        <h1 className="font-display mt-2 text-2xl text-paper md:text-3xl">
          Créer mon compte
        </h1>
        <p className="mt-2 text-sm text-paper/60">
          Quelques informations pour vous mettre en relation avec le bon
          professionnel.
        </p>
      </motion.div>

      {/* Indicateur de progression */}
      <motion.div variants={item} className="mb-8 flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs transition-colors ${
                  i < currentStep
                    ? "border-signal bg-signal text-ink"
                    : i === currentStep
                      ? "border-signal text-signal"
                      : "border-paper/20 text-paper/40"
                }`}
              >
                {i < currentStep ? <Check size={13} /> : i + 1}
              </div>
              <span
                className={`hidden text-[10px] whitespace-nowrap sm:block ${
                  i <= currentStep ? "text-paper/70" : "text-paper/30"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 transition-colors ${
                  i < currentStep ? "bg-signal" : "bg-paper/15"
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      <motion.form
        variants={item}
        onSubmit={handleFormSubmit}
        noValidate
        className="space-y-5"
      >
        <motion.div layout className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-5"
            >
              {currentStep === 0 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="prenom" className="text-paper/80">
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      autoComplete="given-name"
                      autoFocus
                      className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
                      {...register("prenom")}
                    />
                    {errors.prenom && (
                      <p className="text-xs text-red-400">
                        {errors.prenom.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nom" className="text-paper/80">
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      autoComplete="family-name"
                      className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
                      {...register("nom")}
                    />
                    {errors.nom && (
                      <p className="text-xs text-red-400">
                        {errors.nom.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-paper/80">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      autoFocus
                      placeholder="vous@exemple.com"
                      className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="telephone" className="text-paper/80">
                      Téléphone{" "}
                      <span className="text-paper/40 normal-case">
                        (optionnel)
                      </span>
                    </Label>
                    <Input
                      id="telephone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="771234567"
                      className="border-paper/15 bg-paper/5 text-paper placeholder:text-paper/30"
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <p className="text-xs text-red-400">
                        {errors.telephone.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-paper/80">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        autoFocus
                        placeholder="••••••••"
                        className="border-paper/15 bg-paper/5 pr-10 text-paper placeholder:text-paper/30"
                        {...register("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-paper/40 hover:text-paper/70"
                        aria-label={
                          showPassword
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-paper/80">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="border-paper/15 bg-paper/5 pr-10 text-paper placeholder:text-paper/30"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-paper/40 hover:text-paper/70"
                        aria-label={
                          showConfirm
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                        }
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {registerMutation.isError && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(registerMutation.error)}
          </p>
        )}

        <div className="flex gap-3">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={registerMutation.isPending}
              className="border-paper/15 bg-transparent text-paper hover:bg-paper/5"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Retour
            </Button>
          )}

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="flex-1 bg-signal text-ink hover:bg-signal/90"
          >
            {isLastStep ? (
              registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création du compte...
                </>
              ) : (
                "Créer mon compte"
              )
            ) : (
              <>
                Suivant
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.form>

      <motion.p
        variants={item}
        className="mt-6 text-center text-sm text-paper/60"
      >
        Déjà un compte ?{" "}
        <Link
          to="/login"
          className="text-paper underline underline-offset-4 hover:text-signal"
        >
          Se connecter
        </Link>
      </motion.p>
    </motion.div>
  );
}

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Upload, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  registerProfessionnelSchema,
  REGISTER_PROFESSIONNEL_STEPS,
  type RegisterProfessionnelValues,
} from "../schema/registerProfessionnel.schema";
import { useRegisterProfessionnel } from "../hooks/useRegisterProfessionnel";
import { SENEGAL_ZONES } from "../lib/senegalZones";

export function RegisterProfessionnelForm() {
  const [step, setStep] = useState(0);
  const { submit, isSubmitting } = useRegisterProfessionnel();

  const form = useForm<RegisterProfessionnelValues>({
    resolver: zodResolver(registerProfessionnelSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      password: "",
      confirmPassword: "",
      zoneIntervention: "",
      numeroOrdre: "",
    },
  });

  const currentStep = REGISTER_PROFESSIONNEL_STEPS[step];
  const isLastStep = step === REGISTER_PROFESSIONNEL_STEPS.length - 1;
  const diplomeFiles = form.watch("diplome") as FileList | undefined;
  const diplomeFileName = diplomeFiles?.[0]?.name;

  async function handleNext() {
    const valid = await form.trigger(
      currentStep.fields as unknown as (keyof RegisterProfessionnelValues)[]
    );
    if (!valid) return;

    if (isLastStep) {
      const ok = await submit(form.getValues());
      if (ok) {
        // TODO: rediriger vers un écran de confirmation une fois disponible
      }
      return;
    }

    setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="w-full space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center">
        {REGISTER_PROFESSIONNEL_STEPS.map((s, index) => {
          const isActive = index === step;
          const isDone = index < step;
          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                  isDone
                    ? "border-signal bg-signal text-paper"
                    : isActive
                      ? "border-signal text-signal"
                      : "border-ink/15 text-ink/40"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              {index < REGISTER_PROFESSIONNEL_STEPS.length - 1 && (
                <div
                  className={`h-px w-8 transition-colors md:w-12 ${
                    isDone ? "bg-signal" : "bg-ink/15"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm font-medium text-ink/50">
        Étape {step + 1} sur {REGISTER_PROFESSIONNEL_STEPS.length} —{" "}
        {currentStep.title}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
        className="space-y-5"
      >
        {step === 0 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="prenom" className="text-sm text-ink/70">
                Prénom
              </Label>
              <Input
                id="prenom"
                type="text"
                autoComplete="given-name"
                placeholder="Fatou"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("prenom")}
              />
              {form.formState.errors.prenom && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.prenom.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nom" className="text-sm text-ink/70">
                Nom
              </Label>
              <Input
                id="nom"
                type="text"
                autoComplete="family-name"
                placeholder="Ndiaye"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("nom")}
              />
              {form.formState.errors.nom && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.nom.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telephone" className="text-sm text-ink/70">
                Numéro de téléphone
              </Label>
              <Input
                id="telephone"
                type="tel"
                autoComplete="tel"
                placeholder="77 123 45 67"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("telephone")}
              />
              {form.formState.errors.telephone && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.telephone.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-ink/70">
                Adresse email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="fatou.ndiaye@exemple.com"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-ink/70">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="8 caractères min., 1 majuscule, 1 chiffre"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm text-ink/70">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Ressaisissez votre mot de passe"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="zoneIntervention" className="text-sm text-ink/70">
                Zone d'intervention
              </Label>
              <Controller
                name="zoneIntervention"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="zoneIntervention"
                      className="h-10 w-full border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                    >
                      <SelectValue placeholder="Sélectionnez une région" />
                    </SelectTrigger>
                    <SelectContent>
                      {SENEGAL_ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.zoneIntervention && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.zoneIntervention.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="numeroOrdre" className="text-sm text-ink/70">
                Numéro d'inscription à l'ordre
              </Label>
              <Input
                id="numeroOrdre"
                type="text"
                placeholder="ex. B-2024-0456"
                className="h-10 border-ink/15 bg-white px-3.5 text-sm focus-visible:border-signal focus-visible:ring-signal/30"
                {...form.register("numeroOrdre")}
              />
              {form.formState.errors.numeroOrdre && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.numeroOrdre.message}
                </p>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <div className="space-y-1.5">
            <Label htmlFor="diplome" className="text-sm text-ink/70">
              Diplôme (PDF, JPG ou PNG)
            </Label>
            <label
              htmlFor="diplome"
              className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink/20 bg-white px-4 text-center transition-colors hover:border-signal/50"
            >
              <Upload className="h-5 w-5 text-brass" />
              <span className="text-sm font-medium text-ink/70">
                {diplomeFileName ?? "Cliquez pour importer votre diplôme"}
              </span>
              <span className="text-xs text-ink/40">Taille max. 5 Mo</span>
            </label>
            <input
              id="diplome"
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              className="sr-only"
              {...form.register("diplome")}
            />
            {form.formState.errors.diplome && (
              <p className="text-sm text-red-600">
                {form.formState.errors.diplome.message as string}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          {step > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-10 flex-1 gap-2 rounded-xl border-ink/15 text-sm text-ink hover:bg-ink/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Précédent
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 flex-1 gap-2 rounded-xl bg-signal text-sm font-medium text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
          >
            {isSubmitting ? (
              "Envoi en cours…"
            ) : isLastStep ? (
              <>
                <ShieldCheck className="h-4 w-4" />
                Envoyer ma demande
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
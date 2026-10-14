import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Lightbulb, Loader2, Send, ShieldCheck } from "lucide-react";
import {
  DESCRIPTION_MAX,
  demandeEcriteSchema,
  type DemandeEcriteValues,
} from "../schema/demandeEcrite.schema";
import { useDemandeBrouillon } from "../store/demandeBrouillon.store";
import { useMotsClesFrequents } from "../hooks/useMotsClesFrequents";
import { useSauvegarderBrouillon } from "../hooks/useSauvegarderBrouillon";
import { useLocalisationPartagee } from "../hooks/useLocalisationPartagee";
import { useEnvoyerDemande } from "../hooks/useEnvoyerDemande";
import { LocalisationCard } from "./LocalisationCard";
import { MotsClesPicker } from "./MotsClesPicker";

/** Seuil purement visuel pour afficher « Message clair et précis » */
const MESSAGE_CLAIR_MIN = 30;

export function MessageEcritForm() {
  const draftDescription = useDemandeBrouillon((s) => s.description);
  const draftMotsCles = useDemandeBrouillon((s) => s.motsCles);
  const { submit, isSubmitting } = useSauvegarderBrouillon();
  const { envoyer, isSending } = useEnvoyerDemande();
  const localisation = useLocalisationPartagee();
  const { data: motsClesFrequents, isLoading: loadingMotsCles } =
    useMotsClesFrequents();

  const form = useForm<DemandeEcriteValues>({
    resolver: zodResolver(demandeEcriteSchema),
    defaultValues: { description: draftDescription, motsCles: draftMotsCles },
  });

  const description = form.watch("description");
  const motsCles = form.watch("motsCles");
  const error = form.formState.errors.description;

  const busy = isSubmitting || isSending;
  const positionPartagee = localisation.status === "shared";
  const messageClair =
    !error && description.trim().length >= MESSAGE_CLAIR_MIN;

  const toggleMotCle = (motCle: string) => {
    const next = motsCles.includes(motCle)
      ? motsCles.filter((m) => m !== motCle)
      : [...motsCles, motCle];
    form.setValue("motsCles", next, { shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!localisation.localisation) return;
    const draft = await submit(values);
    if (draft) await envoyer(draft.id, localisation.localisation);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 md:space-y-6">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label
            htmlFor="description"
            className="text-base font-semibold text-ink md:text-sm md:font-medium"
          >
            <span className="md:hidden">Que se passe-t-il ?</span>
            <span className="hidden md:inline">
              Expliquez votre situation avec vos propres mots{" "}
              <span className="text-signal" aria-hidden>
                *
              </span>
            </span>
          </label>
          <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-ink/40 md:block">
            Urgence &amp; contentieux
          </span>
        </div>

        <div
          className={`mt-3 overflow-hidden rounded-2xl border bg-white transition-colors focus-within:border-signal/60 focus-within:ring-2 focus-within:ring-signal/20 ${
            error ? "border-red-400" : "border-ink/10"
          }`}
        >
          <textarea
            id="description"
            rows={7}
            maxLength={DESCRIPTION_MAX}
            aria-required
            aria-invalid={!!error}
            aria-describedby={
              error ? "description-erreur" : "description-compteur"
            }
            placeholder="Décrivez ce qui vous arrive…"
            className="block min-h-48 w-full resize-none bg-transparent p-5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink/30 md:resize-y"
            {...form.register("description")}
          />
          <div className="flex h-11 items-center justify-between gap-3 px-4 text-xs md:bg-ink/3 md:text-ink/50">
            {/* Mobile : message d'aide ; desktop : mention de confidentialité */}
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 md:hidden">
              {messageClair && (
                <>
                  <Check className="size-3.5" aria-hidden />
                  Message clair et précis
                </>
              )}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <ShieldCheck className="size-3.5 text-signal" aria-hidden />
              Secret professionnel &amp; Chiffrement SSL 256-bit
            </span>
            <span
              id="description-compteur"
              className="tabular-nums text-ink/50"
            >
              {description.length} / {DESCRIPTION_MAX}
              <span className="hidden md:inline"> caractères</span>
            </span>
          </div>
        </div>

        {/* Espace réservé : pas de décalage quand l'erreur apparaît */}
        <p
          id="description-erreur"
          role={error ? "alert" : undefined}
          className="mt-2 min-h-5 text-sm text-red-600"
        >
          {error?.message}
        </p>
      </div>

      <aside className="hidden gap-3 rounded-2xl bg-ink/4 p-4 md:flex">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Lightbulb className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Conseil d'assistance</p>
          <p className="mt-0.5 max-w-prose text-[13px] leading-snug text-ink/60">
            Ne vous souciez pas du jargon juridique ni du tribunal compétent :
            nos juristes qualifient précisément votre dossier pour activer le
            bon praticien.
          </p>
        </div>
      </aside>

      <div className="hidden md:block">
        <MotsClesPicker
          items={motsClesFrequents}
          loading={loadingMotsCles}
          selected={motsCles}
          onToggle={toggleMotCle}
        />
      </div>

      <LocalisationCard state={localisation} />

      <div className="border-t border-ink/8 pt-4 md:border-0 md:pt-0">
        <button
          type="submit"
          disabled={!positionPartagee || busy}
          className={`inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition md:w-auto ${
            positionPartagee
              ? "bg-signal text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] hover:brightness-105 disabled:opacity-60"
              : "bg-ink/8 text-ink/40"
          }`}
        >
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              Envoyer ma demande
            </>
          )}
        </button>
        <p className="mt-2 min-h-5 text-center text-xs text-ink/50 md:text-left">
          {!positionPartagee && "Partagez votre position pour envoyer"}
        </p>
      </div>
    </form>
  );
}
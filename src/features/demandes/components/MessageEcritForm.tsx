import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lightbulb, Loader2, ShieldCheck } from "lucide-react";
import {
  DESCRIPTION_MAX,
  demandeEcriteSchema,
  type DemandeEcriteValues,
} from "../schema/demandeEcrite.schema";
import { useDemandeBrouillon } from "../store/demandeBrouillon.store";
import { useMotsClesFrequents } from "../hooks/useMotsClesFrequents";
import { useSauvegarderBrouillon } from "../hooks/useSauvegarderBrouillon";
import { MotsClesPicker } from "./MotsClesPicker";

export function MessageEcritForm() {
  const navigate = useNavigate();
  const draftDescription = useDemandeBrouillon((s) => s.description);
  const draftMotsCles = useDemandeBrouillon((s) => s.motsCles);
  const { submit, isSubmitting } = useSauvegarderBrouillon();
  const { data: motsClesFrequents, isLoading: loadingMotsCles } = useMotsClesFrequents();

  const form = useForm<DemandeEcriteValues>({
    resolver: zodResolver(demandeEcriteSchema),
    defaultValues: { description: draftDescription, motsCles: draftMotsCles },
  });

  const description = form.watch("description");
  const motsCles = form.watch("motsCles");
  const error = form.formState.errors.description;

  const toggleMotCle = (motCle: string) => {
    const next = motsCles.includes(motCle)
      ? motsCles.filter((m) => m !== motCle)
      : [...motsCles, motCle];
    form.setValue("motsCles", next, { shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const draft = await submit(values);
    if (draft) navigate(`/app/demandes/nouvelle/${draft.id}/localisation`);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="description" className="text-sm font-medium text-ink">
            Expliquez votre situation avec vos propres mots{" "}
            <span className="text-signal" aria-hidden>*</span>
          </label>
          <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-ink/40 sm:block">
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
            aria-describedby={error ? "description-erreur" : "description-compteur"}
            placeholder="Ex. : J'ai reçu ce matin une mise en demeure signifiée par exploit d'huissier…"
            className="block min-h-48 w-full resize-y bg-transparent p-5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink/30"
            {...form.register("description")}
          />
          <div className="flex items-center justify-between gap-3 bg-ink/3 px-4 py-3 text-xs text-ink/50">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-signal" aria-hidden />
              Secret professionnel &amp; Chiffrement SSL 256-bit
            </span>
            <span id="description-compteur" className="tabular-nums">
              {description.length} / {DESCRIPTION_MAX} caractères
            </span>
          </div>
        </div>

        {error && (
          <p id="description-erreur" role="alert" className="mt-2 text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>

      <aside className="flex gap-3 rounded-2xl bg-ink/4 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
          <Lightbulb className="size-4" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Conseil d'assistance</p>
          <p className="mt-0.5 max-w-prose text-[13px] leading-snug text-ink/60">
            Ne vous souciez pas du jargon juridique ni du tribunal compétent : nos juristes
            qualifient précisément votre dossier pour activer le bon praticien.
          </p>
        </div>
      </aside>

      <MotsClesPicker
        items={motsClesFrequents}
        loading={loadingMotsCles}
        selected={motsCles}
        onToggle={toggleMotCle}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Enregistrement…
          </>
        ) : (
          <>
            Continuer vers la localisation <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
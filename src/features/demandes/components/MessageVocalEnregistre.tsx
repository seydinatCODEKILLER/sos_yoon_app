import { ArrowRight, Lightbulb, Loader2, Mic, RotateCw } from "lucide-react";
import { LecteurAudio } from "./LecteurAudio";
import type { AudioEnregistre } from "../hooks/useVoiceRecorder";
import { formatHorloge } from "../lib/formatDuration";

interface MessageVocalEnregistreProps {
  audio: AudioEnregistre;
  onReset: () => void;
  onContinue: () => void;
  isSubmitting: boolean;
}

export function MessageVocalEnregistre({
  audio,
  onReset,
  onContinue,
  isSubmitting,
}: MessageVocalEnregistreProps) {
  return (
    <div>
      <section
        aria-labelledby="vocal-enregistre-titre"
        className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal">
              <Mic className="size-4.5" aria-hidden />
            </span>
            <div>
              <h3 id="vocal-enregistre-titre" className="text-sm font-semibold text-ink">
                Message vocal enregistré
              </h3>
              <p className="text-xs text-ink/50">Prêt pour qualification juridique instantanée</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium tabular-nums text-red-600">
              <span className="size-1.5 rounded-full bg-red-500" aria-hidden />
              {formatHorloge(audio.dureeSecondes)} HD
            </span>
            <button
              type="button"
              onClick={onReset}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 bg-ink/3 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-ink/6 disabled:opacity-50"
            >
              <RotateCw className="size-3.5" aria-hidden /> Réenregistrer
            </button>
          </div>
        </div>

        <div className="mt-4">
          <LecteurAudio src={audio.url} blob={audio.blob} dureeSecondes={audio.dureeSecondes} />
        </div>

        <p className="mt-4 flex items-center gap-2 rounded-xl border border-signal/10 bg-signal/5 px-4 py-3 text-xs text-ink/70">
          <Lightbulb className="size-3.5 shrink-0 text-signal" aria-hidden />
          Écoutez votre enregistrement avant de valider pour vous assurer que tous les détails
          importants y figurent.
        </p>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal px-6 text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105 disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Envoi…
            </>
          ) : (
            <>
              Continuer vers la localisation <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
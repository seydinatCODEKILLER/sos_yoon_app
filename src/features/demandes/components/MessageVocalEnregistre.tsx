import { Loader2, Mic, RotateCw, Send } from "lucide-react";
import { LecteurAudio } from "./LecteurAudio";
import { LocalisationCard } from "./LocalisationCard";
import type { AudioEnregistre } from "../hooks/useVoiceRecorder";
import type { LocalisationPartagee } from "../hooks/useLocalisationPartagee";
import { formatHorloge } from "../lib/formatDuration";

interface MessageVocalEnregistreProps {
  audio: AudioEnregistre;
  onReset: () => void;
  onSend: () => void;
  isSubmitting: boolean;
  localisation: LocalisationPartagee;
}

export function MessageVocalEnregistre({
  audio,
  onReset,
  onSend,
  isSubmitting,
  localisation,
}: MessageVocalEnregistreProps) {
  const pret = localisation.status === "shared" && !!localisation.localisation;

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
      </section>

      <div className="mt-4">
        <LocalisationCard state={localisation} />
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onSend}
          disabled={!pret || isSubmitting}
          aria-describedby={pret ? undefined : "envoi-aide"}
          className={`inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
            pret
              ? "bg-signal text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] hover:brightness-105 disabled:opacity-60"
              : "cursor-not-allowed bg-ink/8 text-ink/40"
          }`}
        >
          {isSubmitting ? (
            <><Loader2 className="size-4 animate-spin" aria-hidden /> Envoi…</>
          ) : (
            <><Send className="size-4" aria-hidden /> Envoyer ma demande</>
          )}
        </button>

        {/* Emplacement réservé : pas de décalage quand le message disparaît */}
        <p id="envoi-aide" className="mt-3 min-h-5 text-center text-sm text-ink/50">
          {!pret && "Partagez votre position pour envoyer"}
        </p>
      </div>
    </div>
  );
}
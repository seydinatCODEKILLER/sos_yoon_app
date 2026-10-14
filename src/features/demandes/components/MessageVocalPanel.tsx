import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Loader2, Mic, Square, SquarePen } from "lucide-react";
import {
  DUREE_MAX_SECONDES,
  useAudioRecorder,
} from "../hooks/useVoiceRecorder";
import { formatDuree } from "../lib/formatDuration";
import { useEnvoyerMessageVocal } from "../hooks/useEnvoyerMessageVocal";
import { MessageVocalEnregistre } from "./MessageVocalEnregistre";
import { useLocalisationPartagee } from "../hooks/useLocalisationPartagee";
import { useEnvoyerDemande } from "../hooks/useEnvoyerDemande";

const BARS = [10, 18, 28, 20, 12, 22, 8];

function Waveform({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="flex h-8 items-center gap-1">
      {BARS.map((height, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-signal"
          style={{ height }}
          animate={
            active && !reduce
              ? { scaleY: [0.4, 1, 0.5, 0.9, 0.4] }
              : { scaleY: 1 }
          }
          transition={{
            duration: 1.1,
            repeat: active ? Infinity : 0,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function PulseRing({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-17 rounded-full border border-signal/40"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: [1, 1.9], opacity: [0.45, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

interface MessageVocalPanelProps {
  /** false quand l'onglet est masqué : un enregistrement en cours est alors annulé */
  active: boolean;
  onWrite: () => void;
}

export function MessageVocalPanel({ active, onWrite }: MessageVocalPanelProps) {
  const localisation = useLocalisationPartagee();
  const { envoyer, isSending } = useEnvoyerDemande();
  const reduceMotion = useReducedMotion();
  const { supported, status, elapsed, audio, error, start, stop, reset } =
    useAudioRecorder();
  const { submit, isSubmitting } = useEnvoyerMessageVocal();

  useEffect(() => {
    if (!active && status === "recording") reset();
  }, [active, status, reset]);

  const recording = status === "recording";
  const requesting = status === "requesting";

  const handleSend = async () => {
    if (!audio || !localisation.localisation) return;
    const id = await submit({
      fichier: audio.blob,
      dureeSecondes: audio.dureeSecondes,
    });
    if (id) await envoyer(id, localisation.localisation);
  };

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center">
        <p className="text-sm font-medium text-ink">
          Votre navigateur ne permet pas l'enregistrement vocal.
        </p>
        <button
          type="button"
          onClick={onWrite}
          className="text-sm font-medium text-signal hover:underline"
        >
          Écrire mon message
        </button>
      </div>
    );
  }

  // ── Enregistrement terminé : écoute, réenregistrement, suite ──
if (status === "recorded" && audio) {
  return (
    <MessageVocalEnregistre
      audio={audio}
      onReset={reset}
      onSend={handleSend}
      isSubmitting={isSubmitting || isSending}
      localisation={localisation}
    />
  );
}

  // ── Prêt à enregistrer / en cours ──
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <div className="relative grid size-72 place-items-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,97,13,0.22),transparent_65%)] blur-xl"
          />
          <span
            aria-hidden
            className="absolute inset-4 rounded-full border border-signal/15"
          />
          <span
            aria-hidden
            className="absolute inset-10 rounded-full border border-dashed border-signal/25"
          />
          {recording && !reduceMotion && (
            <>
              <PulseRing delay={0} />
              <PulseRing delay={1.2} />
            </>
          )}

          <motion.button
            type="button"
            onClick={recording ? stop : start}
            disabled={requesting}
            aria-label={
              recording
                ? "Arrêter l'enregistrement"
                : "Démarrer l'enregistrement"
            }
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="relative z-10 flex size-38 flex-col items-center justify-center gap-2 rounded-full bg-[radial-gradient(circle_at_50%_30%,#ff7d22,#e8580a)] text-paper shadow-[0_10px_40px_rgba(249,97,13,0.4)] outline-none ring-8 ring-signal/15 focus-visible:ring-signal/50 disabled:opacity-70"
          >
            {recording ? (
              <>
                <Square className="size-5 fill-current" />
                <span className="text-lg font-semibold tabular-nums">
                  {formatDuree(elapsed)}
                </span>
                <span className="text-[11px] opacity-90">
                  Appuyer pour arrêter
                </span>
              </>
            ) : (
              <>
                <span className="flex size-12 items-center justify-center rounded-full bg-white/20">
                  {requesting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Mic className="size-5" />
                  )}
                </span>
                <span className="text-xs font-semibold">
                  {requesting ? "Autorisation…" : "Appuyer pour parler"}
                </span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-2">
          <Waveform active={recording} />
        </div>

        <p
          aria-live="polite"
          role={error ? "alert" : undefined}
          className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs shadow-sm ${
            error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-ink/10 bg-white text-ink/70"
          }`}
        >
          {error ? (
            error
          ) : recording ? (
            <>
              <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
              <strong className="font-semibold text-ink">
                Enregistrement en cours
              </strong>
              <span aria-hidden>•</span>
              {formatDuree(elapsed)} / {formatDuree(DUREE_MAX_SECONDES)}
            </>
          ) : requesting ? (
            "Autorisez le micro dans votre navigateur…"
          ) : (
            <>
              <span className="size-2 rounded-full bg-emerald-500" />
              <strong className="font-semibold text-navy">
                Cliquez pour démarrer l'enregistrement
              </strong>
            </>
          )}
        </p>
      </div>

      {/* Basculer vers l'écrit (masqué pendant l'enregistrement) */}
      {!recording && (
        <div className="mx-auto mt-4 flex w-full max-w-md flex-col items-center gap-3 md:hidden">
          <span className="text-sm text-ink/50">ou</span>
          <button
            type="button"
            onClick={onWrite}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink/80 bg-white text-sm font-semibold text-navy transition-colors hover:bg-ink/3"
          >
            <SquarePen className="size-4" aria-hidden />
            Écrire mon message
          </button>
        </div>
      )}
    </div>
  );
}

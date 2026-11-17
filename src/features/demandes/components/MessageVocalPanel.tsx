import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronRight, Loader2, Mic, Square, SquarePen } from "lucide-react";
import {
  DUREE_MAX_SECONDES,
  useAudioRecorder,
} from "../hooks/useVoiceRecorder";
import { formatDuree } from "../lib/formatDuration";
import { useMotsClesFrequents } from "../hooks/useMotsClesFrequents";
import { MessageVocalEnregistre } from "./MessageVocalEnregistre";
import { useLocalisationPartagee } from "../hooks/useLocalisationPartagee";
import { useEnvoyerDemande } from "../hooks/useEnvoyerDemande";
import { useDemandeVisiteur } from "../hooks/useDemandeVisiteur";

const BARS = [10, 16, 24, 32, 22, 28, 14, 26, 18, 12, 8];

function Waveform({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="flex h-8 items-center gap-1">
      {BARS.map((height, i) => (
        <motion.span
          key={i}
          className={`w-1 rounded-full transition-colors duration-300 ${
            active ? "bg-signal" : "bg-ink/15"
          }`}
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

/** Anneau qui se remplit pendant l'enregistrement ; rouge sur la fin */
function ProgressRing({
  ratio,
  animate,
}: {
  ratio: number;
  animate: boolean;
}) {
  const proche = ratio >= 0.85;
  return (
    <svg
      aria-hidden
      viewBox="0 0 192 192"
      className="absolute inset-12 -rotate-90"
    >
      <circle
        cx="96"
        cy="96"
        r="92"
        fill="none"
        strokeWidth="4"
        className="stroke-signal/15"
      />
      <circle
        cx="96"
        cy="96"
        r="92"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={100 * (1 - ratio)}
        className={`${proche ? "stroke-red-500" : "stroke-signal"} ${
          animate ? "transition-[stroke-dashoffset] duration-1000 ease-linear" : ""
        }`}
      />
    </svg>
  );
}

function BoutonEcrire({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-center gap-3.5 overflow-hidden rounded-xl bg-navy p-3.5 pr-4 text-left text-paper shadow-[0_10px_30px_-12px_rgba(23,22,48,0.6)] outline-none transition focus-visible:ring-2 focus-visible:ring-signal/60 focus-visible:ring-offset-2 active:scale-[0.99]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-signal/20 blur-2xl"
      />

      <span
        aria-hidden
        className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white/10 ring-2 ring-signal/70 ring-offset-2 ring-offset-navy"
      >
        <SquarePen className="size-5" />
      </span>

      <span className="relative min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-tight">
          Écrire mon message
        </span>
        <span className="mt-1 block text-xs leading-snug text-paper/65">
          Si vous ne pouvez pas parler
        </span>
      </span>

      <span
        aria-hidden
        className="relative grid size-10 shrink-0 place-items-center rounded-full bg-signal text-paper shadow-[0_6px_16px_rgba(249,97,13,0.45)] transition-transform group-hover:scale-105"
      >
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

interface MessageVocalPanelProps {
  /** false quand l'onglet est masqué : un enregistrement en cours est alors annulé */
  active: boolean;
  onWrite: () => void;
}

export function MessageVocalPanel({ active, onWrite }: MessageVocalPanelProps) {
  const localisation = useLocalisationPartagee();
  const { envoyerVocale, isSending } = useEnvoyerDemande();
  const reduceMotion = useReducedMotion();
  const { supported, status, elapsed, audio, error, start, stop, reset } =
    useAudioRecorder();
  const [motsCles, setMotsCles] = useState<string[]>([]);
  const { data: motsClesFrequents, isLoading: loadingMotsCles } =
    useMotsClesFrequents();
  const { estVisiteur, garderVocale, isSaving } = useDemandeVisiteur();

  useEffect(() => {
    if (!active && status === "recording") reset();
  }, [active, status, reset]);

  const recording = status === "recording";
  const requesting = status === "requesting";
  const progression = Math.min(1, elapsed / DUREE_MAX_SECONDES);

  const handleSend = async () => {
    if (!audio || !localisation.localisation) return;
    if (estVisiteur) {
      await garderVocale(audio, localisation.localisation, motsCles);
      return;
    }
    // Une seule requête : audio + position + mots-clés (POST /demandes, spec 8.1)
    await envoyerVocale({
      fichier: audio.blob,
      dureeSecondes: audio.dureeSecondes,
      motsCles,
      localisation: localisation.localisation,
    });
  };

  const toggleMotCle = (motCle: string) =>
    setMotsCles((prev) =>
      prev.includes(motCle)
        ? prev.filter((m) => m !== motCle)
        : [...prev, motCle],
    );

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 px-6 py-10 text-center">
        <p className="text-sm font-medium text-ink">
          Votre navigateur ne permet pas l'enregistrement vocal.
        </p>
        <div className="w-full max-w-xs">
          <BoutonEcrire onClick={onWrite} />
        </div>
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
        isSubmitting={isSending || isSaving}
        localisation={localisation}
        motsClesFrequents={motsClesFrequents}
        loadingMotsCles={loadingMotsCles}
        motsCles={motsCles}
        onToggleMotCle={toggleMotCle}
      />
    );
  }

  // ── Prêt à enregistrer / en cours ──
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center py-4">
        <div className="relative grid size-72 place-items-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(249,97,13,0.22),transparent_65%)] blur-xl"
            animate={
              !recording && !reduceMotion
                ? { opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            aria-hidden
            className="absolute inset-4 rounded-full border border-signal/15"
          />
          <span
            aria-hidden
            className="absolute inset-10 rounded-full border border-dashed border-signal/25"
          />
          {recording && (
            <ProgressRing ratio={progression} animate={!reduceMotion} />
          )}
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
                <span className="text-2xl font-semibold tabular-nums">
                  {formatDuree(elapsed)}
                </span>
                <span className="text-[11px] opacity-90">
                  Appuyer pour arrêter
                </span>
              </>
            ) : (
              <>
                <span className="flex size-14 items-center justify-center rounded-full bg-white/20">
                  {requesting ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <Mic className="size-6" />
                  )}
                </span>
                <span className="text-[13px] font-semibold">
                  {requesting ? "Autorisation…" : "Appuyer pour parler"}
                </span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-2">
          <Waveform active={recording} />
        </div>

        <div className="mt-4 flex min-h-12 items-center justify-center">
          <div aria-live="polite">
            {(error || recording || requesting) && (
              <p
                role={error ? "alert" : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs shadow-sm ${
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
                    maximum {formatDuree(DUREE_MAX_SECONDES)}
                  </>
                ) : (
                  "Autorisez le micro dans votre navigateur…"
                )}
              </p>
            )}
          </div>
          {!(error || recording || requesting) && (
            <p className="max-w-xs text-pretty text-center text-[13px] leading-snug text-ink/55">
              Dites ce qui s'est passé, quand et où. Vous pourrez réécouter
              votre message avant de l'envoyer.
            </p>
          )}
        </div>
      </div>

      {/* Basculer vers l'écrit : l'espace reste réservé pendant l'enregistrement */}
      <div
        inert={recording}
        className={`mx-auto mt-4 w-full max-w-md space-y-3 md:hidden ${
          recording ? "invisible" : ""
        }`}
      >
        <div aria-hidden className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/10" />
          <span className="text-xs font-medium text-ink/40">ou</span>
          <span className="h-px flex-1 bg-ink/10" />
        </div>
        <BoutonEcrire onClick={onWrite} />
      </div>
    </div>
  );
}
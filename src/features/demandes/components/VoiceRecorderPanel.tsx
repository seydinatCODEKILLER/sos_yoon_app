import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Mic, Square, RotateCcw, Send } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useSubmitVoiceRequest } from "../hooks/useSubmitVoiceRequest";
import { useVoiceDraftStore } from "../store/voiceDraft.store";
import { formatDuration } from "../lib/formatDuration";

export function VoiceRecorderPanel() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { isAuthenticated } = useAuthStore();
  const setDraft = useVoiceDraftStore((s) => s.setDraft);

  const {
    status,
    duration,
    mediaBlobUrl,
    startRecording,
    stopRecording,
    reset,
  } = useVoiceRecorder();
  const { submit, isSubmitting } = useSubmitVoiceRequest();

  const isRecording = status === "recording";
  const isStopped = status === "stopped" && !!mediaBlobUrl;
  const isDenied = status === "permission_denied";

  async function handleSubmit() {
    if (!mediaBlobUrl) return;

    if (!isAuthenticated) {
      // Pas de compte : on garde le brouillon en mémoire et on route
      // vers l'étape téléphone, sans perdre l'enregistrement.
      setDraft(mediaBlobUrl, duration);
      navigate("/demande/telephone");
      return;
    }

    const ok = await submit(mediaBlobUrl);
    if (ok) navigate("/app/demandes/suivi");
  }

  if (isDenied) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-700">
          Accès au microphone refusé
        </p>
        <p className="mt-1 text-sm text-red-600">
          Autorisez l'accès au micro dans les réglages de votre navigateur
          pour enregistrer votre demande.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center">
      <div className="relative flex h-52 w-52 items-center justify-center">
        {isRecording && !reduceMotion && (
          <>
            <motion.span
              className="absolute h-44 w-44 rounded-full bg-signal/25"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute h-44 w-44 rounded-full bg-signal/25"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8,
              }}
            />
          </>
        )}

        <Button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isStopped}
          className={`relative h-36 w-36 rounded-full text-paper shadow-[0_12px_32px_-8px_rgba(240,162,2,0.55)] transition-all hover:brightness-105 active:scale-[0.97] disabled:opacity-40 ${
            isRecording ? "bg-red-500 hover:bg-red-500" : "bg-signal hover:bg-signal"
          }`}
        >
          {isRecording ? (
            <Square className="h-10 w-10" fill="currentColor" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
      </div>

      <p className="mt-6 font-display text-2xl font-semibold text-ink">
        {formatDuration(duration)}
      </p>
      <p className="mt-1 text-sm text-ink/50">
        {status === "idle" && "Appuyez pour commencer l'enregistrement"}
        {status === "acquiring_media" && "Activation du micro…"}
        {isRecording && "Enregistrement en cours…"}
        {isStopped && "Écoutez votre message avant de l'envoyer"}
      </p>

      {isStopped && (
        <div className="mt-6 w-full space-y-4">
          <audio src={mediaBlobUrl} controls className="w-full" />

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="h-12 flex-1 gap-2 rounded-full border-ink/15 text-ink hover:bg-ink/5"
            >
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 flex-1 gap-2 rounded-full bg-signal text-paper hover:bg-signal hover:brightness-105 disabled:opacity-60"
            >
              {isSubmitting ? (
                "Envoi…"
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
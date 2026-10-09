import { useCallback, useEffect, useRef, useState } from "react";

export const DUREE_MAX_SECONDES = 120;
const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;
// Formats acceptés par l'API : webm, mp4, ogg
const MIMES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

export type RecorderStatus = "idle" | "requesting" | "recording" | "recorded" | "error";

export interface AudioEnregistre {
  blob: Blob;
  url: string;
  dureeSecondes: number;
}

const isSupported = () =>
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== "undefined";

function messageErreurMicro(error: unknown): string {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Accès au micro refusé. Autorisez le micro dans votre navigateur, puis réessayez.";
  if (name === "NotFoundError" || name === "OverconstrainedError")
    return "Aucun microphone détecté sur cet appareil.";
  if (name === "NotReadableError")
    return "Le micro est utilisé par une autre application.";
  return "Impossible d'accéder au microphone.";
}

export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [audio, setAudio] = useState<AudioEnregistre | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startedAtRef = useRef(0);
  const urlRef = useRef<string | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const revokeUrl = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  /** Coupe tout sans produire de résultat (annulation ou démontage) */
  const teardown = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder) {
      recorder.onstop = null;
      if (recorder.state !== "inactive") recorder.stop();
      recorderRef.current = null;
    }
    clearTimer();
    releaseStream();
  }, [clearTimer, releaseStream]);

  useEffect(
    () => () => {
      teardown();
      revokeUrl();
    },
    [teardown, revokeUrl],
  );

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  }, []);

  const reset = useCallback(() => {
    teardown();
    revokeUrl();
    setAudio(null);
    setError(null);
    setElapsed(0);
    setStatus("idle");
  }, [teardown, revokeUrl]);

  const start = useCallback(async () => {
    if (!isSupported()) return;
    revokeUrl();
    setAudio(null);
    setError(null);
    setElapsed(0);
    setStatus("requesting");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      setError(messageErreurMicro(e));
      setStatus("error");
      return;
    }
    streamRef.current = stream;

    const mimeType = MIMES.find((m) => MediaRecorder.isTypeSupported(m));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      clearTimer();
      releaseStream();
      recorderRef.current = null;

      const secondes = Math.min((performance.now() - startedAtRef.current) / 1000, DUREE_MAX_SECONDES);
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || "audio/webm" });

      if (blob.size === 0 || secondes < 1) {
        setError("Enregistrement trop court. Réessayez en parlant un peu plus longtemps.");
        setStatus("error");
        return;
      }
      if (blob.size > TAILLE_MAX_OCTETS) {
        setError("Enregistrement trop volumineux (5 Mo maximum). Réessayez plus brièvement.");
        setStatus("error");
        return;
      }
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setAudio({ blob, url, dureeSecondes: Math.max(1, Math.round(secondes)) });
      setStatus("recorded");
    };

    recorderRef.current = recorder;
    startedAtRef.current = performance.now();
    recorder.start();
    setStatus("recording");

    timerRef.current = window.setInterval(() => {
      const secondes = (performance.now() - startedAtRef.current) / 1000;
      setElapsed(secondes);
      if (secondes >= DUREE_MAX_SECONDES) stop();
    }, 250);
  }, [clearTimer, releaseStream, revokeUrl, stop]);

  return { supported: isSupported(), status, elapsed, audio, error, start, stop, reset };
}
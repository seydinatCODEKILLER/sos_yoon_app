import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export function useVoiceRecorder() {
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ audio: true, video: false });

  useEffect(() => {
    if (status === "recording") {
      intervalRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  function reset() {
    clearBlobUrl();
    setDuration(0);
  }

  function handleStart() {
    setDuration(0);
    startRecording();
  }

  return {
    status, // "idle" | "acquiring_media" | "recording" | "stopped" | "permission_denied"
    duration,
    mediaBlobUrl,
    startRecording: handleStart,
    stopRecording,
    reset,
  };
}
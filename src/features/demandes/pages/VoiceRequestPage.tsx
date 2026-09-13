import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { VoiceRecorderPanel } from "../components/VoiceRecorderPanel";

export function VoiceRequestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col bg-paper px-6 py-8 md:px-12 md:py-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Retour
      </button>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">
            Décrivez votre urgence à l'oral
          </h1>
          <p className="mt-2 text-ink/60">
            Parlez librement, en français ou dans votre langue locale.
          </p>
        </div>

        <div className="mt-10">
          <VoiceRecorderPanel />
        </div>
      </div>
    </div>
  );
}
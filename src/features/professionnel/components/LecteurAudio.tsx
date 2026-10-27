import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { formaterMmSs } from "../lib/formatDashboard";

const BARRES = Array.from({ length: 40 }, (_, i) =>
  Math.round(25 + Math.abs(Math.sin(i * 1.7) * 55 + Math.cos(i * 0.6) * 20)),
);
const VITESSES = [1, 1.2] as const;

interface LecteurAudioProps {
  url: string;
  dureeSecondes: number;
}

export function LecteurAudio({ url, dureeSecondes }: LecteurAudioProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [lecture, setLecture] = useState(false);
  const [temps, setTemps] = useState(0);
  const [vitesse, setVitesse] = useState<(typeof VITESSES)[number]>(1);

  const part = Math.min(1, temps / Math.max(1, dureeSecondes));

  async function basculer() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) await a.play().catch(() => {});
    else a.pause();
  }

  function changerVitesse(v: (typeof VITESSES)[number]) {
    setVitesse(v);
    if (audio.current) audio.current.playbackRate = v;
  }

  function positionner(secondes: number) {
    if (audio.current) audio.current.currentTime = secondes;
    setTemps(secondes);
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-3">
      <audio
        ref={audio}
        src={url}
        preload="metadata"
        onPlay={() => setLecture(true)}
        onPause={() => setLecture(false)}
        onEnded={() => {
          setLecture(false);
          setTemps(0);
        }}
        onTimeUpdate={(e) => setTemps(e.currentTarget.currentTime)}
      />

      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          onClick={basculer}
          aria-label={lecture ? "Mettre en pause" : "Écouter le message vocal"}
          className="size-11 shrink-0 rounded-full bg-signal text-white hover:bg-signal/90"
        >
          {lecture ? <Pause className="size-5" /> : <Play className="size-5" />}
        </Button>

        <div className="relative h-11 flex-1">
          <div aria-hidden className="flex h-full items-center gap-0.5">
            {BARRES.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-full ${
                  i / BARRES.length < part ? "bg-signal" : "bg-ink/20"
                }`}
              />
            ))}
          </div>
          {/* Curseur invisible : clic et clavier pour se déplacer dans l'audio */}
          <input
            type="range"
            min={0}
            max={dureeSecondes}
            step={0.1}
            value={temps}
            onChange={(e) => positionner(Number(e.target.value))}
            aria-label="Position de lecture"
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-signal">{formaterMmSs(Math.floor(temps))}</span>
        <div className="flex items-center gap-1">
          {VITESSES.map((v) => (
            <Button
              key={v}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={vitesse === v}
              onClick={() => changerVitesse(v)}
              className={`h-6 rounded-md px-2 text-[11px] font-semibold ${
                vitesse === v ? "bg-signal/15 text-signal" : "text-ink/55"
              }`}
            >
              x{v.toFixed(1)}
            </Button>
          ))}
        </div>
        <span className="text-ink/50">{formaterMmSs(dureeSecondes)}</span>
      </div>
    </div>
  );
}
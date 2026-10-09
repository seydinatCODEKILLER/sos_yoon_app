import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { Download, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useWaveform } from "../hooks/useWaveform";
import { formatHorloge } from "../lib/formatDuration";

interface LecteurAudioProps {
  src: string;
  blob: Blob;
  dureeSecondes: number;
}

export function LecteurAudio({ src, blob, dureeSecondes }: LecteurAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const correctionEnCours = useRef(false);
  const [lecture, setLecture] = useState(false);
  const [muet, setMuet] = useState(false);
  const [courant, setCourant] = useState(0);
  const barres = useWaveform(blob, dureeSecondes);

  const ratio = dureeSecondes > 0 ? Math.min(1, courant / dureeSecondes) : 0;
  const extension = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";

  // Les enregistrements MediaRecorder n'ont pas de durée dans leurs métadonnées (Infinity) :
  // on force le navigateur à la calculer, puis on revient au début.
  const handleLoadedMetadata = () => {
    const el = audioRef.current;
    if (!el || Number.isFinite(el.duration)) return;
    correctionEnCours.current = true;
    const terminer = () => {
      el.removeEventListener("timeupdate", terminer);
      el.currentTime = 0;
      correctionEnCours.current = false;
    };
    el.addEventListener("timeupdate", terminer);
    el.currentTime = 1e6;
  };

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (el && !correctionEnCours.current) setCourant(Math.min(el.currentTime, dureeSecondes));
  };

  const basculerLecture = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      if (el.ended || courant >= dureeSecondes - 0.05) el.currentTime = 0;
      void el.play();
    } else {
      el.pause();
    }
  };

  const basculerMuet = () => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuet(el.muted);
  };

  const aller = (r: number) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Math.max(0, Math.min(1, r)) * dureeSecondes;
    el.currentTime = t;
    setCourant(t);
  };

  const handleClickOnde = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    aller((e.clientX - rect.left) / rect.width);
  };

  const handleKeyOnde = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") aller((courant + 5) / dureeSecondes);
    else if (e.key === "ArrowLeft") aller((courant - 5) / dureeSecondes);
    else return;
    e.preventDefault();
  };

  return (
    <div className="rounded-2xl bg-navy p-5 text-paper">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setLecture(true)}
        onPause={() => setLecture(false)}
        onEnded={() => setLecture(false)}
      />

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={basculerLecture}
          aria-label={lecture ? "Mettre en pause" : "Écouter l'enregistrement"}
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-signal text-paper shadow-[0_4px_14px_rgba(249,97,13,0.4)] outline-none transition hover:brightness-110 focus-visible:ring-4 focus-visible:ring-signal/40"
        >
          {lecture ? <Pause className="size-5 fill-current" /> : <Play className="size-5 translate-x-px fill-current" />}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/50">
            Qualité optimale
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums">
            {formatHorloge(courant)} / {formatHorloge(dureeSecondes)}
          </p>
        </div>

        <div className="flex items-center gap-1 text-paper/60">
          <button
            type="button"
            onClick={basculerMuet}
            aria-label={muet ? "Activer le son" : "Couper le son"}
            className="rounded-md p-2 outline-none transition-colors hover:bg-paper/10 hover:text-paper focus-visible:ring-2 focus-visible:ring-signal"
          >
            {muet ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <a
            href={src}
            download={`message-vocal.${extension}`}
            aria-label="Télécharger l'enregistrement"
            className="rounded-md p-2 outline-none transition-colors hover:bg-paper/10 hover:text-paper focus-visible:ring-2 focus-visible:ring-signal"
          >
            <Download className="size-4" />
          </a>
        </div>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Position de lecture"
        aria-valuemin={0}
        aria-valuemax={dureeSecondes}
        aria-valuenow={Math.round(courant)}
        aria-valuetext={`${formatHorloge(courant)} sur ${formatHorloge(dureeSecondes)}`}
        onClick={handleClickOnde}
        onKeyDown={handleKeyOnde}
        className="mt-5 flex h-16 cursor-pointer items-center justify-between rounded-md outline-none focus-visible:ring-2 focus-visible:ring-signal"
      >
        {barres.map((h, i) => (
          <span
            key={i}
            aria-hidden
            style={{ height: `${h * 100}%` }}
            className={`w-0.75 shrink-0 rounded-full transition-colors ${
              (i + 0.5) / barres.length <= ratio ? "bg-signal" : "bg-paper/20"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-paper/10 pt-3 font-mono text-[10px] text-paper/40">
        <span>00:00</span>
        <span>Position de lecture : {Math.round(ratio * 100)}%</span>
        <span>{formatHorloge(dureeSecondes)}</span>
      </div>
    </div>
  );
}
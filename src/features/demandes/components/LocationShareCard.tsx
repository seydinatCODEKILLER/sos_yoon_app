import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Check,
  AlertCircle,
  Loader2,
  Navigation,
  MapPinOff,
} from "lucide-react";
import type { useGeolocation } from "@/shared/hooks/useGeolocation";

interface LocationShareCardProps {
  geolocation: ReturnType<typeof useGeolocation>;
}

const STYLES = {
  idle: { border: "border-border", bg: "bg-paper" },
  requesting: { border: "border-border", bg: "bg-paper" },
  granted: { border: "border-signal/30", bg: "bg-signal/5" },
  denied: { border: "border-red-200", bg: "bg-red-50/60" },
  unsupported: { border: "border-border", bg: "bg-paper" },
} as const;

export function LocationShareCard({ geolocation }: LocationShareCardProps) {
  const { status, request } = geolocation;
  const style = STYLES[status];

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${style.border} ${style.bg}`}
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Icône statut */}
        <div
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            status === "granted"
              ? "bg-signal/15"
              : status === "denied"
                ? "bg-red-100"
                : status === "unsupported"
                  ? "bg-muted-foreground/10"
                  : "bg-ink/5"
          }`}
        >
          {status === "granted" && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/30" />
          )}
          {status === "requesting" ? (
            <Loader2
              size={16}
              className="relative animate-spin text-muted-foreground"
            />
          ) : status === "granted" ? (
            <Navigation size={15} className="relative text-signal" />
          ) : status === "denied" ? (
            <AlertCircle size={16} className="relative text-red-500" />
          ) : status === "unsupported" ? (
            <MapPinOff size={16} className="relative text-muted-foreground" />
          ) : (
            <MapPin size={16} className="relative text-muted-foreground" />
          )}
        </div>

        {/* Texte */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium ${
              status === "denied" ? "text-red-700" : "text-ink"
            }`}
          >
            {status === "granted"
              ? "Position partagée"
              : status === "denied"
                ? "Position refusée"
                : status === "requesting"
                  ? "Localisation en cours..."
                  : status === "unsupported"
                    ? "Géolocalisation indisponible"
                    : "Partager ma position"}
          </p>
          <p className="text-xs text-muted-foreground">
            {status === "granted"
              ? "Utilisée pour trouver un professionnel proche"
              : status === "denied"
                ? "Autorisez la géolocalisation dans les réglages de votre navigateur, puis réessayez"
                : status === "unsupported"
                  ? "Votre navigateur ne permet pas de partager votre position"
                  : "Optionnel — améliore la précision du dispatch"}
          </p>
        </div>

        {/* Action */}
        {status === "idle" && (
          <button
            type="button"
            onClick={request}
            className="shrink-0 rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-signal hover:text-signal"
          >
            Autoriser
          </button>
        )}
        {status === "denied" && (
          <button
            type="button"
            onClick={request}
            className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-300"
          >
            Réessayer
          </button>
        )}
        {status === "granted" && (
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/15"
          >
            <Check size={13} className="text-signal" />
          </motion.span>
        )}
      </div>

      {/* Mini radar de confirmation */}
      <AnimatePresence>
        {status === "granted" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="border-t border-signal/20 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-ink/5">
                <motion.div
                  className="absolute -inset-1/2"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, rgba(240,162,2,0.4) 40deg, transparent 100deg)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal" />
              </div>
              <p className="text-xs text-muted-foreground">
                Le rayon de recherche autour de vous sera pris en compte lors
                du dispatch.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
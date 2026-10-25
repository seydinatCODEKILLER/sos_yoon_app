import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
  Square,
} from "lucide-react";
import { toast } from "@/shared/lib/toast";
import { AlerteMicro } from "../components/AlerteMicro";
import { AvatarSoxna } from "../components/AvatarSoxna";
import { Onde } from "../components/Onde";
import { useAssistantVocal } from "../hooks/useAssistantVocal";
import { useMicrophone } from "../hooks/useMicrophone";
import type { EcranAssistant } from "../types/assistant.types";

interface Texte {
  titre: string;
  sousTitre?: string;
  onde: "aucune" | "repos" | "active";
}

const TEXTES: Record<EcranAssistant, Texte> = {
  indisponible: {
    titre: "Mode vocal indisponible",
    sousTitre: "Vous pouvez poser toutes vos questions juridiques par écrit.",
    onde: "aucune",
  },
  pret: { titre: "", onde: "aucune" },
  // Provisoires : pas encore de maquette pour ces deux états
  ecoute: { titre: "Je vous écoute", onde: "active" },
  reflexion: { titre: "Soxna réfléchit…", onde: "repos" },
  reponse: { titre: "Soxna vous répond", onde: "active" },
};

function PulseMicro({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full border border-signal/50"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

interface BoutonMicroProps {
  ecran: EcranAssistant;
  occupe: boolean;
  onClick: () => void;
}

function BoutonMicro({ ecran, occupe, onClick }: BoutonMicroProps) {
  const reduce = useReducedMotion();

  if (ecran === "indisponible") {
    return (
      <button
        type="button"
        disabled
        aria-label="Micro indisponible"
        className="grid size-20 place-items-center rounded-full border-2 border-red-400/40 bg-red-500/10 text-red-300"
      >
        <MicOff className="size-8" aria-hidden />
      </button>
    );
  }

  // Pendant la réflexion et la réponse : l'espace reste réservé (pas de décalage)
  if (ecran === "reflexion" || ecran === "reponse") {
    return <div aria-hidden className="size-20" />;
  }

  const ecoute = ecran === "ecoute";

  return (
    <div className="relative size-20">
      {ecoute && !reduce && (
        <>
          <PulseMicro delay={0} />
          <PulseMicro delay={1.1} />
        </>
      )}
      <motion.button
        type="button"
        onClick={onClick}
        disabled={occupe}
        aria-label={ecoute ? "Terminer ma question" : "Parler à Soxna Yoon"}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className="relative grid size-20 place-items-center rounded-full bg-signal text-paper shadow-[0_0_40px_rgba(249,97,13,0.55)] outline-none focus-visible:ring-4 focus-visible:ring-signal/40 disabled:opacity-70"
      >
        {occupe ? (
          <Loader2 className="size-8 animate-spin" aria-hidden />
        ) : ecoute ? (
          <Square className="size-6 fill-current" aria-hidden />
        ) : (
          <Mic className="size-8" aria-hidden />
        )}
      </motion.button>
    </div>
  );
}

export function AssistantPage() {
  const navigate = useNavigate();
  const { etat: etatMicro, pret: microVerifie, demander } = useMicrophone();
  const { etat, parler, terminer } = useAssistantVocal();
  const [occupe, setOccupe] = useState(false);

  const vocalIndisponible =
    etatMicro === "bloque" || etatMicro === "indisponible";
  const ecran: EcranAssistant = vocalIndisponible ? "indisponible" : etat;
  const texte = TEXTES[ecran];

  async function autoriser() {
    setOccupe(true);
    const resultat = await demander();
    setOccupe(false);
    if (resultat === "bloque") {
      toast.error(
        "Le micro est toujours bloqué. Autorisez-le dans les réglages de votre navigateur.",
      );
    }
  }

  async function surMicro() {
    if (ecran === "ecoute") {
      terminer();
      return;
    }
    // Première utilisation : on demande d'abord l'accès au micro
    if (etatMicro !== "autorise") {
      setOccupe(true);
      const resultat = await demander();
      setOccupe(false);
      if (resultat !== "autorise") {
        if (resultat === "bloque") {
          toast.error(
            "Le micro est bloqué. Autorisez-le dans les réglages de votre navigateur.",
          );
        }
        return;
      }
    }
    await parler();
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-navy text-paper">
      {/* Halo discret quand Soxna répond */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-10 -right-20 size-96 rounded-full bg-signal/15 blur-3xl transition-opacity duration-500 ${
          ecran === "reponse" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Retour à l'accueil"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 transition hover:bg-white/15"
          >
            <ArrowLeft className="size-6" aria-hidden />
          </button>
          <div>
            <h1 className="text-xl leading-tight font-bold">Soxna Yoon</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-paper/70">
              <Sparkles className="size-3.5 text-signal" aria-hidden />
              Assistante IA
            </p>
          </div>
        </header>

        {/* Invisible tant que l'état réel du micro n'est pas connu : aucun clignotement */}
        {/* Invisible tant que l'état réel du micro n'est pas connu : aucun clignotement */}
        <div
          className={`flex flex-1 flex-col ${microVerifie ? "" : "invisible"}`}
        >
          {vocalIndisponible && (
            <div className="mt-5">
              <AlerteMicro
                etat={etatMicro}
                onAutoriser={autoriser}
                occupe={occupe}
              />
            </div>
          )}

          {/* Avatar au centre : ligne du milieu, le texte vit dans la ligne du bas */}
          <main className="grid flex-1 grid-rows-[1fr_auto_1fr] justify-items-center py-4 text-center">
            <div aria-hidden />

            <AvatarSoxna ecran={ecran} />

            <div
              role="status"
              aria-live="polite"
              className="mt-6 flex min-h-24 flex-col items-center self-start"
            >
              {texte.titre ? (
                <h2 className="text-[22px] leading-tight font-bold">
                  {texte.titre}
                </h2>
              ) : (
                <span className="sr-only">
                  Appuyez sur le micro pour parler à Soxna Yoon.
                </span>
              )}
              {texte.sousTitre && (
                <p className="mt-1.5 max-w-xs text-[15px] leading-snug text-paper/65">
                  {texte.sousTitre}
                </p>
              )}
              {texte.onde !== "aucune" && (
                <div className="mt-4">
                  <Onde active={texte.onde === "active"} />
                </div>
              )}
            </div>
          </main>

          <footer className="flex flex-col items-center gap-5 pt-2">
            <BoutonMicro ecran={ecran} occupe={occupe} onClick={surMicro} />
            <p className="text-center text-[15px] leading-snug text-paper/70">
              Information juridique générale, pas un conseil d'avocat.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

function Beacon({ onClick }: { onClick: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-52 w-52 items-center justify-center md:h-60 md:w-60">
      {!reduceMotion && (
        <>
          <motion.span
            className="absolute h-40 w-40 rounded-full bg-signal/30 md:h-44 md:w-44"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute h-40 w-40 rounded-full bg-signal/30 md:h-44 md:w-44"
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.1,
            }}
          />
        </>
      )}

      <Button
        type="button"
        onClick={onClick}
        className="relative h-40 w-40 flex-col gap-1 whitespace-normal rounded-full bg-signal px-4 text-paper shadow-[0_12px_32px_-8px_rgba(240,162,2,0.55)] hover:bg-signal hover:brightness-105 active:scale-[0.97] md:h-44 md:w-44"
      >
        <span className="font-display text-3xl font-semibold tracking-wide md:text-4xl">
          SOS
        </span>
        <span className="max-w-30 text-center text-[11px] font-normal leading-tight text-paper/85 md:text-xs">
          Trouver un professionnel du droit
        </span>
      </Button>
    </div>
  );
}

function HeaderChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group hidden items-center gap-2 rounded-full px-1 py-1 pr-4 text-sm font-medium text-ink/70 transition-colors hover:text-ink md:inline-flex"
    >
      <MessageCircleQuestion className="h-4 w-4 text-brass transition-transform group-hover:-rotate-6" />
      <span className="underline decoration-ink/20 decoration-dashed underline-offset-4 group-hover:decoration-brass/60">
        Je ne sais pas de qui j'ai besoin
      </span>
    </button>
  );
}

function MobileChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-dashed border-brass/40 bg-brass/5 px-5 py-4 text-left transition-colors hover:border-brass/60 hover:bg-brass/10 active:scale-[0.98]"
    >
      <MessageCircleQuestion className="h-5 w-5 shrink-0 text-brass" />
      <span className="font-medium text-ink/80">
        Je ne sais pas de qui j'ai besoin
      </span>
    </button>
  );
}

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-paper">
      <header className="flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <span className="font-display text-2xl font-bold text-ink">
          <span className="text-signal">SOS</span> Yoon
        </span>
        <HeaderChatButton onClick={() => navigate("/chatbot")} />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-6 text-center md:px-12">
        <div className="flex w-full max-w-md flex-col items-center md:max-w-xl">
          <p className="text-ink/60">Bonjour 👋</p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
            Quelle est votre urgence aujourd'hui ?
          </h1>
          <p className="mt-4 text-sm text-ink/60 md:text-base">
            Décrivez votre situation, on s'occupe de vous mettre en relation
            avec le bon professionnel du droit — avocat, huissier, notaire ou
            juriste-conseil.
          </p>

          <div className="mt-8 md:mt-10">
            <Beacon onClick={() => navigate("/demande")} />
          </div>
        </div>

        {/* Actions secondaires — mobile uniquement */}
        <div className="mt-8 w-full max-w-md space-y-3 md:hidden">
          <MobileChatButton onClick={() => navigate("/chatbot")} />

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/register")}
            className="group h-auto w-full items-center justify-between gap-0.5 rounded-2xl border-brass/40 bg-white px-5 py-4 text-left hover:border-brass hover:bg-white"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-display font-semibold text-ink">
                Pas encore de compte ? Inscrivez-vous !
              </span>
              <span className="text-sm font-normal text-ink/50">
                Particulier ou professionnel du droit
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-brass transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Inscription — desktop, sous le radar */}
        <div className="mt-8 hidden w-full max-w-md md:block">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/register")}
            className="group h-auto w-full items-center justify-between gap-0.5 rounded-2xl border-brass/40 bg-white px-5 py-4 text-left hover:border-brass hover:bg-white"
          >
            <span className="flex flex-col gap-0.5">
              <span className="font-display font-semibold text-ink">
                Pas encore de compte ? Inscrivez-vous !
              </span>
              <span className="text-sm font-normal text-ink/50">
                Particulier ou professionnel du droit
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-brass transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </main>
    </div>
  );
}
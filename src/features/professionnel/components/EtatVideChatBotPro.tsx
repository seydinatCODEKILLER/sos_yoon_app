import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Briefcase, Clock, Gavel, Inbox, Scale } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface Suggestion {
  question: string;
  icone: ReactNode;
}

const SUGGESTIONS: readonly Suggestion[] = [
  {
    question:
      "Quel est le délai de prescription de l'action publique pour un délit\u00A0?",
    icone: <Clock className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />,
  },
  {
    question: "Quelles peines encourt l'auteur d'un abus de confiance\u00A0?",
    icone: <Gavel className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />,
  },
  {
    question:
      "Quel préavis doit respecter un employeur qui licencie un salarié\u00A0?",
    icone: <Briefcase className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />,
  },
  {
    question: "Quelles demandes ai-je reçues récemment\u00A0?",
    icone: <Inbox className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden />,
  },
];

interface EtatVideChatbotProProps {
  onChoisir: (question: string) => void;
  /** La zone de saisie, placée au centre sous le titre */
  children: ReactNode;
}

/** Écran d'accueil : titre, saisie au centre, puis des questions pour démarrer */
export function EtatVideChatbotPro({
  onChoisir,
  children,
}: EtatVideChatbotProProps) {
  const reduire = useReducedMotion();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6 sm:py-8">
      <motion.div
        initial={reduire ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="m-auto w-full max-w-2xl space-y-6 sm:space-y-8"
      >
        <div className="space-y-3 text-center">
          <span
            aria-hidden
            className="mx-auto grid size-11 place-items-center rounded-2xl bg-navy text-paper sm:size-12"
          >
            <Scale className="size-6" />
          </span>
          <p className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Posez une question juridique
          </p>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-ink/60">
            Le chatbot cherche dans les textes sénégalais (pénal, procédure
            pénale, famille, travail, obligations civiles et commerciales) et
            cite chaque article. Il lit vos dossiers et vos demandes, mais ne
            modifie rien.
          </p>
        </div>

        <div className="space-y-2">
          {children}
          <p className="text-center text-xs text-ink/50">
            Assistant de recherche. Vérifiez toujours les sources avant usage.
          </p>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map(({ question, icone }) => (
            <li key={question}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onChoisir(question)}
                className="h-full w-full items-start justify-start gap-3 rounded-2xl px-4 py-3 text-left text-[13px] leading-snug font-medium whitespace-normal text-ink/80"
              >
                {icone}
                {question}
              </Button>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
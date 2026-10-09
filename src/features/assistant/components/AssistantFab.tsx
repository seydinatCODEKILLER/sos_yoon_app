import { Link } from "react-router-dom";
import { Bot, MessageSquare } from "lucide-react";

/** Bouton flottant d'accès à l'assistant. Sur mobile : bulle seule, au-dessus de la tab bar. */
export function AssistantFab() {
  return (
    <Link
      to="/app/assistant"
      aria-label="Assistant IA — posez votre question"
      className="fixed bottom-24 right-4 z-20 flex items-center gap-3 rounded-full bg-navy p-1.5 text-paper shadow-[0_8px_30px_rgba(23,22,48,0.35)] ring-1 ring-signal/30 transition-transform hover:-translate-y-0.5 sm:pr-4 md:bottom-6 md:right-6"
    >
      <span className="relative flex size-11 items-center justify-center rounded-full bg-signal">
        <Bot className="size-5" />
        <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-navy bg-emerald-500" />
      </span>
      <span className="hidden text-left leading-tight sm:block">
        <span className="flex items-center gap-2 text-sm font-semibold">
          Assistant IA
          <span className="rounded bg-signal/15 px-1.5 py-0.5 text-[10px] font-semibold text-signal">
            24/7
          </span>
        </span>
        <span className="text-xs text-paper/60">Posez votre question</span>
      </span>
      <MessageSquare className="hidden size-4 text-signal sm:block" />
    </Link>
  );
}
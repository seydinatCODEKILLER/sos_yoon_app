import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Bot, Check, Copy, Scale, TriangleAlert } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { apparition } from "@/shared/lib/animationsPage";
import { toast } from "@/shared/lib/toast";
import { analyserReponse, segmenterGras } from "../lib/reponsechatbot";
import type {
  MessageChatbot,
  SourceJuridique,
} from "../types/chatBotPro.types";

function TexteGras({ texte }: { texte: string }) {
  return segmenterGras(texte).map((s, i) =>
    s.gras ? (
      <strong key={i} className="font-semibold">
        {s.texte}
      </strong>
    ) : (
      <span key={i}>{s.texte}</span>
    ),
  );
}

function BoutonCopier({ texte }: { texte: string }) {
  const [copie, setCopie] = useState(false);

  async function copier() {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      window.setTimeout(() => setCopie(false), 1500);
    } catch {
      toast.error("Impossible de copier la réponse.");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void copier()}
      className="-ml-2 h-8 gap-1.5 px-2 text-xs text-ink/60 hover:text-ink"
    >
      {copie ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
      {copie ? "Copié" : "Copier"}
    </Button>
  );
}

function libelleSource(s: SourceJuridique): string {
  return `${s.document}, art. ${s.numero}`;
}

function detailSource(s: SourceJuridique): string {
  const parties = [s.source, s.edition ? `édition ${s.edition}` : null];
  return parties.filter(Boolean).join(" · ");
}

function ReponseAssistant({ message }: { message: MessageChatbot }) {
  const { blocs, aVerifier, corpus } = analyserReponse(message.texte);
  const sources = message.sources ?? [];

  return (
    <div className="min-w-0 flex-1 space-y-4 pt-0.5">
      <span className="sr-only">Réponse du chatbot : </span>

      <div className="space-y-3 text-[15px] leading-7 text-ink">
        {blocs.map((bloc, i) =>
          bloc.type === "paragraphe" ? (
            <p key={i} className="whitespace-pre-line">
              <TexteGras texte={bloc.texte} />
            </p>
          ) : bloc.ordonnee ? (
            <ol
              key={i}
              start={bloc.debut}
              className="list-decimal space-y-1.5 pl-6 marker:text-ink/50"
            >
              {bloc.elements.map((el, j) => (
                <li key={j}>
                  <TexteGras texte={el} />
                </li>
              ))}
            </ol>
          ) : (
            <ul
              key={i}
              className="list-disc space-y-1.5 pl-6 marker:text-ink/40"
            >
              {bloc.elements.map((el, j) => (
                <li key={j}>
                  <TexteGras texte={el} />
                </li>
              ))}
            </ul>
          ),
        )}
      </div>

      {aVerifier.length > 0 && (
        <div
          role="note"
          className="space-y-1.5 rounded-xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900"
        >
          <p className="flex items-center gap-1.5 font-semibold">
            <TriangleAlert className="size-4" aria-hidden />À vérifier
          </p>
          <ul className="list-disc space-y-0.5 pl-5">
            {aVerifier.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {sources.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-ink/60">Sources</p>
          <ul className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <li key={s.reference}>
                <Badge
                  variant="secondary"
                  title={detailSource(s) || undefined}
                  className="h-auto gap-1.5 rounded-full bg-ink/6 px-3 py-1.5 text-xs font-medium text-ink/80"
                >
                  <Scale className="size-3.5 text-signal" aria-hidden />
                  {libelleSource(s)}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      )}

      {message.fonctionIndisponible && (
        <p className="text-xs text-ink/55 italic">
          Le chatbot a proposé une action ou un document, qui ne sont pas
          disponibles dans cette version.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <BoutonCopier texte={message.texte} />
        {corpus && (
          <p className="text-xs text-ink/50">
            {corpus.charAt(0).toUpperCase() + corpus.slice(1)}
          </p>
        )}
      </div>
    </div>
  );
}

export function MessageChatbotPro({ message }: { message: MessageChatbot }) {
  const reduire = useReducedMotion();
  const animation = reduire
    ? {}
    : { variants: apparition, initial: "cache", animate: "visible" };

  if (message.role === "utilisateur") {
    return (
      <motion.li
        {...animation}
        data-role="utilisateur"
        className="flex list-none justify-end"
      >
        <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-navy px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-paper sm:max-w-[75%]">
          <span className="sr-only">Vous : </span>
          {message.texte}
        </p>
      </motion.li>
    );
  }

  return (
    <motion.li {...animation} className="flex list-none items-start gap-3.5">
      <span
        aria-hidden
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-navy text-paper"
      >
        <Bot className="size-4" />
      </span>
      <ReponseAssistant message={message} />
    </motion.li>
  );
}
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

interface ZoneSaisieChatbotProProps {
  /** Une réponse est attendue : l'envoi est suspendu, l'arrêt est proposé */
  enCours: boolean;
  onEnvoyer: (question: string) => void;
  onArreter: () => void;
  /** Place le curseur dans le champ dès l'affichage (pas sur l'écran d'accueil : le clavier mobile s'ouvrirait) */
  focusAuMontage?: boolean;
}

/** Saisie arrondie, bouton d'envoi à l'intérieur (comme une messagerie) */
export function ZoneSaisieChatbotPro({
  enCours,
  onEnvoyer,
  onArreter,
  focusAuMontage = false,
}: ZoneSaisieChatbotProProps) {
  const [texte, setTexte] = useState("");
  const champ = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (focusAuMontage) champ.current?.focus();
  }, [focusAuMontage]);

  function soumettre() {
    const question = texte.trim();
    if (!question || enCours) return;
    onEnvoyer(question);
    setTexte("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        soumettre();
      }}
      className="flex items-end gap-2 rounded-3xl border border-ink/15 bg-white py-2 pr-2 pl-5 shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition-colors focus-within:border-signal/60 focus-within:ring-4 focus-within:ring-signal/10"
    >
      <Textarea
        ref={champ}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        onKeyDown={(e) => {
          // Entrée envoie, Maj+Entrée passe à la ligne (sauf pendant une saisie composée)
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            soumettre();
          }
        }}
        rows={1}
        maxLength={2000}
        aria-label="Votre question"
        placeholder="Posez votre question juridique…"
        className="max-h-48 min-h-10 flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-2 text-[15px] shadow-none focus-visible:border-0 focus-visible:ring-0"
      />
      {enCours ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onArreter}
          aria-label="Arrêter la recherche"
          className="size-10 shrink-0 rounded-full"
        >
          <Square className="size-4 fill-current" aria-hidden />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={!texte.trim()}
          aria-label="Envoyer la question"
          className="size-10 shrink-0 rounded-full bg-signal text-paper hover:bg-signal/90 disabled:bg-ink/10 disabled:text-ink/35 disabled:opacity-100"
        >
          <ArrowUp className="size-5" strokeWidth={2.5} aria-hidden />
        </Button>
      )}
    </form>
  );
}
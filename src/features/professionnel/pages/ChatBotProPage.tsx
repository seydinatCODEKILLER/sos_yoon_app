import { useEffect, useRef } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { EtatVideChatbotPro } from "../components/EtatVideChatBotPro";
import { IndicateurRechercheChatbotPro } from "../components/IndicateurRechercheChatBotPro";
import { MessageChatbotPro } from "../components/MessageChatBotPro";
import { ZoneSaisieChatbotPro } from "../components/ZoneSaisieChatBotPro";
import { useChatbotPro } from "../hooks/useChatBotPro";
import { useHauteurDisponible } from "../hooks/useHauteurDisponible";

/**
 * Chatbot pro : assistant de recherche juridique pour les professionnels.
 * Lecture seule : il cite des articles et consulte dossiers et demandes.
 *
 * La page occupe tout l'espace sous l'en-tête : pas de cadre, la conversation
 * défile sur le fond de la page et la saisie reste en bas. La hauteur est
 * mesurée (useHauteurDisponible) pour que seule la liste des messages défile.
 */
export function ChatbotProPage() {
  const { messages, etat, erreur, envoyer, reessayer, arreter, reinitialiser } =
    useChatbotPro();
  const liste = useRef<HTMLDivElement>(null);
  const racine = useHauteurDisponible<HTMLDivElement>();
  const recherche = etat === "recherche";
  const vide = messages.length === 0 && !recherche && !erreur;

  // Défilement : en attente ou en erreur, le bas de la conversation ; quand une
  // réponse arrive, la question est calée en haut pour lire la réponse depuis son
  // début (sans dépasser le bas si elle est courte)
  useEffect(() => {
    const zone = liste.current;
    if (!zone) return;
    const bas = zone.scrollHeight - zone.clientHeight;
    const derniere = messages.at(-1);
    if (derniere?.role !== "assistant" || recherche || erreur) {
      zone.scrollTop = bas;
      return;
    }
    const questions = zone.querySelectorAll('[data-role="utilisateur"]');
    const question = questions[questions.length - 1];
    if (!question) {
      zone.scrollTop = bas;
      return;
    }
    const decalage =
      question.getBoundingClientRect().top -
      zone.getBoundingClientRect().top +
      zone.scrollTop -
      24;
    zone.scrollTop = Math.min(Math.max(decalage, 0), bas);
  }, [messages, recherche, erreur]);

  // Au centre de l'accueil, puis en bas dès la première question : le champ
  // est recréé à ce moment-là, on y remet donc le curseur
  const saisie = (
    <ZoneSaisieChatbotPro
      enCours={recherche}
      onEnvoyer={envoyer}
      onArreter={arreter}
      focusAuMontage={!vide}
    />
  );

  return (
    <div ref={racine} className="flex min-h-112 flex-col">
      <h2 className="sr-only">Chatbot pro</h2>

      {vide ? (
        <EtatVideChatbotPro onChoisir={envoyer}>{saisie}</EtatVideChatbotPro>
      ) : (
        <>
          <div className="flex shrink-0 justify-end px-4 pt-3 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={reinitialiser}
              className="gap-1.5 text-ink/60 hover:text-ink"
            >
              <RotateCcw className="size-4" aria-hidden />
              Nouvelle conversation
            </Button>
          </div>

          <div
            ref={liste}
            role="log"
            aria-label="Messages"
            className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6"
          >
            <div className="mx-auto w-full max-w-3xl space-y-8 py-6">
              <ol className="space-y-8">
                {messages.map((message) => (
                  <MessageChatbotPro key={message.id} message={message} />
                ))}
              </ol>

              {recherche && <IndicateurRechercheChatbotPro />}

              {erreur && (
                <div
                  role="alert"
                  className="flex flex-col gap-2 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm font-medium text-red-700">{erreur}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={reessayer}
                    className="self-start bg-white sm:self-auto"
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 px-4 pt-2 pb-4 sm:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-2">
              {saisie}
              <p className="text-center text-xs text-ink/50">
                Assistant de recherche. Vérifiez toujours les sources avant
                usage.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
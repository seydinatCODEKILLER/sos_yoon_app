import { useCallback, useEffect, useRef, useState } from "react";
import { chatbotProApi, ErreurChatbot } from "../api/chtaBotProApi";
import type {
  EtatChatbot,
  MessageChatbot,
  SourceJuridique,
} from "../types/chatBotPro.types";

let compteur = 0;
const nouvelId = () => `chatbot-${++compteur}`;

const MESSAGE_PAR_DEFAUT = "Une erreur est survenue. Réessayez.";

/**
 * Conversation avec le chatbot pro. Elle vit dans la page : quitter l'écran
 * l'efface, ce qui évite de garder en mémoire des extraits de dossiers.
 */
export function useChatbotPro() {
  const [messages, setMessages] = useState<MessageChatbot[]>([]);
  const [etat, setEtat] = useState<EtatChatbot>("pret");
  const [erreur, setErreur] = useState<string | null>(null);

  const session = useRef<string | null>(null);
  const controleur = useRef<AbortController | null>(null);
  const derniereQuestion = useRef("");

  // Quitter la page interrompt la question en cours
  useEffect(() => {
    return () => controleur.current?.abort();
  }, []);

  const poser = useCallback(async (question: string, afficher: boolean) => {
    controleur.current?.abort();
    const ctrl = new AbortController();
    controleur.current = ctrl;
    derniereQuestion.current = question;
    setErreur(null);
    setEtat("recherche");
    if (afficher) {
      setMessages((precedents) => [
        ...precedents,
        { id: nouvelId(), role: "utilisateur", texte: question },
      ]);
    }

    const reponse = {
      texte: "",
      sources: undefined as SourceJuridique[] | undefined,
      fonctionIndisponible: false,
    };
    const rappels = {
      onTexte: (texte: string) => {
        reponse.texte = texte;
      },
      onSources: (sources: SourceJuridique[]) => {
        reponse.sources = sources;
      },
      onFonctionIndisponible: () => {
        reponse.fonctionIndisponible = true;
      },
    };

    async function unTour() {
      let id = session.current;
      if (!id) {
        id = await chatbotProApi.ouvrirSession(ctrl.signal);
        session.current = id;
      }
      await chatbotProApi.poserQuestion(id, question, rappels, ctrl.signal);
    }

    try {
      try {
        await unTour();
      } catch (e) {
        // Le service oublie les conversations quand il redémarre : on en rouvre une
        if (!(e instanceof ErreurChatbot) || e.code !== "session") throw e;
        session.current = null;
        reponse.texte = "";
        reponse.sources = undefined;
        reponse.fonctionIndisponible = false;
        await unTour();
      }

      // Une réponse qui arrive juste après un arrêt ou une nouvelle conversation est jetée
      if (ctrl.signal.aborted) return;
      if (!reponse.texte) {
        throw new ErreurChatbot(
          "serveur",
          "Le chatbot n'a pas renvoyé de réponse. Réessayez.",
        );
      }
      setMessages((precedents) => [
        ...precedents,
        {
          id: nouvelId(),
          role: "assistant",
          texte: reponse.texte,
          sources: reponse.sources,
          fonctionIndisponible: reponse.fonctionIndisponible || undefined,
        },
      ]);
    } catch (e) {
      // Arrêt demandé, nouvelle conversation ou page quittée : pas une erreur
      if (ctrl.signal.aborted) return;
      setErreur(e instanceof ErreurChatbot ? e.message : MESSAGE_PAR_DEFAUT);
    } finally {
      if (controleur.current === ctrl) {
        controleur.current = null;
        setEtat("pret");
      }
    }
  }, []);

  /** Envoie une question (ignorée si vide ou si une réponse est attendue) */
  const envoyer = useCallback(
    (question: string) => {
      const texte = question.trim();
      if (!texte || controleur.current) return;
      void poser(texte, true);
    },
    [poser],
  );

  /** Renvoie la dernière question sans la réafficher */
  const reessayer = useCallback(() => {
    if (!derniereQuestion.current || controleur.current) return;
    void poser(derniereQuestion.current, false);
  }, [poser]);

  const arreter = useCallback(() => {
    controleur.current?.abort();
  }, []);

  /** Efface la conversation : la suivante repart d'une session neuve */
  const reinitialiser = useCallback(() => {
    controleur.current?.abort();
    controleur.current = null;
    session.current = null;
    derniereQuestion.current = "";
    setMessages([]);
    setErreur(null);
    setEtat("pret");
  }, []);

  return { messages, etat, erreur, envoyer, reessayer, arreter, reinitialiser };
}
import { refreshAccessToken } from "@/shared/lib/refreshToken";
import { tokenManager } from "@/shared/lib/tokenManager";
import { lireFluxSse } from "../lib/fluxsse";
import type {
  CodeErreurChatbot,
  SourceJuridique,
} from "../types/chatbotpro.types";

/**
 * Seule frontière avec le chatbot pro (service IA, FastAPI, réponses en SSE).
 * Le reste de la feature ne connaît ni l'URL, ni le format des événements :
 * quand le service changera de contrat (identité par le jeton, plus de session),
 * seul ce fichier bouge.
 */

/** Erreur dont le message est prêt à être montré au professionnel */
export class ErreurChatbot extends Error {
  code: CodeErreurChatbot;

  constructor(code: CodeErreurChatbot, message: string) {
    super(message);
    this.name = "ErreurChatbot";
    this.code = code;
  }
}

function urlBase(): string {
  const url: string | undefined =
    import.meta.env.VITE_CHATBOT_PRO_URL || undefined;
  if (!url) {
    throw new ErreurChatbot(
      "non-configure",
      "Le chatbot pro n'est pas configuré pour le moment.",
    );
  }
  return url.replace(/\/+$/, "");
}

function estAnnulation(erreur: unknown): boolean {
  return erreur instanceof DOMException && erreur.name === "AbortError";
}

/**
 * POST JSON avec le jeton du professionnel. Sur 401, un seul renouvellement du
 * jeton puis un seul nouvel essai, comme le fait `apiClient` pour le back-end.
 */
async function appeler(
  chemin: string,
  corps: object,
  signal: AbortSignal,
): Promise<Response> {
  const url = `${urlBase()}${chemin}`;
  const envoyer = (jeton: string | null) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: JSON.stringify(corps),
      signal,
    });

  let reponse: Response;
  try {
    reponse = await envoyer(tokenManager.getAccessToken());
  } catch (erreur) {
    if (estAnnulation(erreur)) throw erreur;
    throw new ErreurChatbot(
      "reseau",
      "Impossible de joindre le chatbot. Vérifiez votre connexion puis réessayez.",
    );
  }

  if (reponse.status === 401) {
    try {
      reponse = await envoyer(await refreshAccessToken());
    } catch (erreur) {
      if (estAnnulation(erreur)) throw erreur;
      throw new ErreurChatbot(
        "auth",
        "Votre session a expiré. Reconnectez-vous pour utiliser le chatbot.",
      );
    }
  }
  return reponse;
}

async function erreurHttp(reponse: Response): Promise<ErreurChatbot> {
  let detail = "";
  try {
    const corps: unknown = await reponse.json();
    if (typeof corps === "object" && corps !== null && "error" in corps) {
      detail = typeof corps.error === "string" ? corps.error : "";
    }
  } catch {
    // corps vide ou illisible : le code HTTP suffit
  }

  if (reponse.status === 400 && detail.includes("session_id")) {
    return new ErreurChatbot("session", "La conversation a expiré.");
  }
  if (reponse.status === 401) {
    return new ErreurChatbot(
      "auth",
      "Votre session a expiré. Reconnectez-vous pour utiliser le chatbot.",
    );
  }
  if (reponse.status === 403) {
    return new ErreurChatbot(
      "auth",
      "Votre compte n'a pas accès au chatbot pour le moment.",
    );
  }
  if (reponse.status === 429) {
    return new ErreurChatbot(
      "limite",
      "Vous avez posé beaucoup de questions en peu de temps. Patientez un instant.",
    );
  }
  if (reponse.status >= 400 && reponse.status < 500 && detail) {
    return new ErreurChatbot("serveur", detail);
  }
  return new ErreurChatbot(
    "serveur",
    "Le chatbot rencontre un problème. Réessayez dans un instant.",
  );
}

function estSource(valeur: unknown): valeur is SourceJuridique {
  return (
    typeof valeur === "object" &&
    valeur !== null &&
    "document" in valeur &&
    typeof valeur.document === "string" &&
    "numero" in valeur &&
    (typeof valeur.numero === "string" || typeof valeur.numero === "number")
  );
}

export interface RappelsQuestion {
  /** Texte complet de la réponse (il remplace le précédent s'il y en a un) */
  onTexte: (texte: string) => void;
  onSources: (sources: SourceJuridique[]) => void;
  /** Le chatbot propose une écriture ou un document : hors MVP, on le signale */
  onFonctionIndisponible: () => void;
}

export const chatbotProApi = {
  /**
   * Ouvre une conversation et rend son identifiant.
   *
   * MODE TEST : tant que le chatbot lit les cabinets fictifs, il exige un
   * `cabinet` (VITE_CHATBOT_PRO_CABINET, par exemple cab-diallo). Quand
   * l'identité viendra du jeton, `/api/session` disparaît : cette méthode ne
   * fera plus qu'attribuer un identifiant local, rien d'autre ne change.
   */
  async ouvrirSession(signal: AbortSignal): Promise<string> {
    const cabinet: string | undefined =
      import.meta.env.VITE_CHATBOT_PRO_CABINET || undefined;
    const reponse = await appeler(
      "/api/session",
      cabinet ? { cabinet } : {},
      signal,
    );
    if (!reponse.ok) throw await erreurHttp(reponse);

    let corps: unknown;
    try {
      corps = await reponse.json();
    } catch {
      corps = null;
    }
    if (
      typeof corps === "object" &&
      corps !== null &&
      "session_id" in corps &&
      typeof corps.session_id === "string"
    ) {
      return corps.session_id;
    }
    throw new ErreurChatbot(
      "serveur",
      "Le chatbot rencontre un problème. Réessayez dans un instant.",
    );
  },

  /** Pose une question ; la promesse se résout quand le flux est terminé */
  async poserQuestion(
    sessionId: string,
    question: string,
    rappels: RappelsQuestion,
    signal: AbortSignal,
  ): Promise<void> {
    const reponse = await appeler(
      "/api/chat",
      { session_id: sessionId, question },
      signal,
    );
    if (!reponse.ok) throw await erreurHttp(reponse);
    if (!reponse.body) {
      throw new ErreurChatbot(
        "serveur",
        "Le chatbot rencontre un problème. Réessayez dans un instant.",
      );
    }

    try {
      await lireFluxSse(reponse.body, ({ evenement, donnees }) => {
        let valeur: unknown;
        try {
          valeur = JSON.parse(donnees);
        } catch {
          return;
        }
        switch (evenement) {
          case "text":
            if (
              typeof valeur === "object" &&
              valeur !== null &&
              "texte" in valeur &&
              typeof valeur.texte === "string"
            ) {
              rappels.onTexte(valeur.texte);
            }
            break;
          case "sources":
            if (Array.isArray(valeur)) rappels.onSources(valeur.filter(estSource));
            break;
          case "action":
          case "documents":
            rappels.onFonctionIndisponible();
            break;
        }
      });
    } catch (erreur) {
      if (estAnnulation(erreur)) throw erreur;
      throw new ErreurChatbot(
        "reseau",
        "La connexion avec le chatbot s'est interrompue. Réessayez.",
      );
    }
  },
};
import type { EtatAssistant } from "../types/assistant.types";

export interface RappelsSession {
  onEtat: (etat: EtatAssistant) => void;
  onErreur: (message: string) => void;
}

export interface SessionVocale {
  /** L'utilisateur commence à parler */
  demarrer: () => Promise<void>;
  /** L'utilisateur a fini de parler (le vrai moteur le détectera tout seul) */
  terminerTour: () => void;
  /** Ferme la session (retour, fermeture de la page) */
  arreter: () => void;
}

export type CreerSession = (rappels: RappelsSession) => SessionVocale;

/** Session simulée : écoute, puis réflexion (1,5 s), puis réponse (5 s). */
export function creerSessionMock(rappels: RappelsSession): SessionVocale {
  const minuteries: number[] = [];

  const planifier = (action: () => void, delaiMs: number) => {
    minuteries.push(window.setTimeout(action, delaiMs));
  };
  const annuler = () => {
    minuteries.splice(0).forEach((id) => window.clearTimeout(id));
  };

  return {
    async demarrer() {
      annuler();
      rappels.onEtat("ecoute");
    },
    terminerTour() {
      annuler();
      rappels.onEtat("reflexion");
      planifier(() => {
        rappels.onEtat("reponse");
        planifier(() => rappels.onEtat("pret"), 5000);
      }, 1500);
    },
    arreter() {
      annuler();
    },
  };
}

/** À remplacer par la vraie session (WebRTC / WebSocket) quand le fournisseur vocal sera choisi. */
export const creerSession: CreerSession = creerSessionMock;
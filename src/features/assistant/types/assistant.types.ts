/** États de la conversation vocale */
export type EtatAssistant = "pret" | "ecoute" | "reflexion" | "reponse";

/** Ce que l'écran affiche : un état de conversation, ou le mode vocal indisponible */
export type EcranAssistant = EtatAssistant | "indisponible";

/**
 * Action demandée par Soxna pendant la conversation (outil appelé côté serveur).
 * Valeurs connues : TRIGGER_EMERGENCY_HUISSIER, TRIGGER_EMERGENCY_POLICE,
 * NEED_LAWYER, NEED_NOTARY, NEED_LEGAL_ADVISOR, SEARCHING_LAWS.
 */
export interface ActionAssistant {
  action: string;
  payload: Record<string, unknown>;
}
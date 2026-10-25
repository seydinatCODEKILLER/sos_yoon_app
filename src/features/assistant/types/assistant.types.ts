/** États de la conversation vocale */
export type EtatAssistant = "pret" | "ecoute" | "reflexion" | "reponse";

/** Ce que l'écran affiche : un état de conversation, ou le mode vocal indisponible */
export type EcranAssistant = EtatAssistant | "indisponible";
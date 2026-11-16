/** Article du corpus cité par une réponse (événement `sources` du chatbot) */
export interface SourceJuridique {
  reference: string;
  document: string;
  numero: string | number;
  source?: string;
  edition?: string | number | null;
  statut_article?: string | null;
}

export type RoleMessage = "utilisateur" | "assistant";

export interface MessageChatbot {
  id: string;
  role: RoleMessage;
  texte: string;
  sources?: SourceJuridique[];
  /** Le chatbot a proposé une écriture ou un document : pas disponible dans le MVP */
  fonctionIndisponible?: boolean;
}

/** « recherche » : la question est partie, la réponse n'est pas encore arrivée */
export type EtatChatbot = "pret" | "recherche";

export type CodeErreurChatbot =
  | "non-configure"
  | "reseau"
  | "session"
  | "auth"
  | "limite"
  | "serveur";

/** Bloc de texte d'une réponse, prêt à afficher */
export type BlocReponse =
  | { type: "paragraphe"; texte: string }
  | {
      type: "liste";
      ordonnee: boolean;
      /** Numéro du premier élément d'une liste numérotée */
      debut: number;
      elements: string[];
    };

/** Morceau de texte, en gras ou non */
export interface SegmentTexte {
  texte: string;
  gras: boolean;
}

export interface ReponseAnalysee {
  blocs: BlocReponse[];
  /** Points signalés « à vérifier » par le contrôle des citations */
  aVerifier: string[];
  /** Pied de réponse : « corpus SOS Yoon, mis à jour le … » */
  corpus: string | null;
}
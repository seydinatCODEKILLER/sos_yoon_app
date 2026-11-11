/**
 * Les textes peuvent contenir : **gras**, [libellé](/chemin-interne), [libellé](mailto:…)
 * et [valeur à compléter] (affichée surlignée).
 */
export type Bloc =
  | { type: "p"; texte: string }
  | { type: "liste"; items: string[] }
  | { type: "sous-titre"; texte: string }
  | { type: "note"; texte: string };

export interface SectionJuridique {
  id: string;
  titre: string;
  blocs: Bloc[];
}

export interface DocumentJuridique {
  titre: string;
  version: string;
  dateMiseAJour: string;
  introduction: string;
  /** L'essentiel en langage courant, avant le texte complet. */
  resume: string[];
  sections: SectionJuridique[];
}
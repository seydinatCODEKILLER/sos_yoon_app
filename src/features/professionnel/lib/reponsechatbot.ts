import type {
  BlocReponse,
  ReponseAnalysee,
  SegmentTexte,
} from "../types/chatBotPro.types";

/**
 * Le serveur ajoute lui-même, en fin de réponse, deux blocs fixes (voir
 * `mise_en_forme` côté chatbot) :
 *   « À vérifier : » suivi d'une liste à tirets
 *   « Sources : corpus SOS Yoon, mis à jour le … »
 * On les sépare du texte pour les afficher à part. Si le format ne correspond
 * pas, rien n'est retiré : le texte reste affiché tel quel.
 */
const RE_CORPUS = /\n*Sources : (corpus SOS Yoon, mis à jour le [^\n]+?)\.?\s*$/;
const RE_A_VERIFIER = /\n*À vérifier :\n((?:- [^\n]*\n?)+)$/;
const RE_ELEMENT = /^\s*(?:([-*•])|(\d+)[.)])\s+(.+)$/;

interface ElementListe {
  ordonnee: boolean;
  numero: number;
  texte: string;
}

function lireElement(ligne: string): ElementListe | null {
  const m = RE_ELEMENT.exec(ligne);
  if (!m) return null;
  return m[1]
    ? { ordonnee: false, numero: 1, texte: m[3] }
    : { ordonnee: true, numero: Number(m[2]), texte: m[3] };
}

function decouperEnBlocs(texte: string): BlocReponse[] {
  const blocs: BlocReponse[] = [];
  let enCours: BlocReponse | null = null;

  for (const ligne of texte.split("\n")) {
    if (ligne.trim() === "") {
      if (enCours) blocs.push(enCours);
      enCours = null;
      continue;
    }
    const element = lireElement(ligne);
    if (element) {
      if (enCours?.type === "liste" && enCours.ordonnee === element.ordonnee) {
        enCours.elements.push(element.texte);
        continue;
      }
      if (enCours) blocs.push(enCours);
      enCours = {
        type: "liste",
        ordonnee: element.ordonnee,
        debut: element.numero,
        elements: [element.texte],
      };
    } else if (enCours?.type === "paragraphe") {
      enCours.texte += `\n${ligne.trim()}`;
    } else {
      if (enCours) blocs.push(enCours);
      enCours = { type: "paragraphe", texte: ligne.trim() };
    }
  }
  if (enCours) blocs.push(enCours);
  return blocs;
}

/** Sépare le texte d'une réponse de ses blocs « à vérifier » et « corpus » */
export function analyserReponse(brut: string): ReponseAnalysee {
  let reste = brut.trim();

  let corpus: string | null = null;
  const pied = RE_CORPUS.exec(reste);
  if (pied) {
    corpus = pied[1];
    reste = reste.slice(0, pied.index).trimEnd();
  }

  let aVerifier: string[] = [];
  const points = RE_A_VERIFIER.exec(reste);
  if (points) {
    aVerifier = points[1]
      .split("\n")
      .map((l) => l.replace(/^- /, "").trim())
      .filter(Boolean);
    reste = reste.slice(0, points.index).trimEnd();
  }

  return { blocs: decouperEnBlocs(reste), aVerifier, corpus };
}

/** Repère le gras écrit en **Markdown** ; tout le reste est du texte brut */
export function segmenterGras(texte: string): SegmentTexte[] {
  const segments: SegmentTexte[] = [];
  let dernier = 0;
  for (const m of texte.matchAll(/\*\*(.+?)\*\*/g)) {
    if (m.index > dernier) {
      segments.push({ texte: texte.slice(dernier, m.index), gras: false });
    }
    segments.push({ texte: m[1], gras: true });
    dernier = m.index + m[0].length;
  }
  if (dernier < texte.length) {
    segments.push({ texte: texte.slice(dernier), gras: false });
  }
  return segments;
}
/** Un événement Server-Sent Events : « event: … » + « data: … » */
export interface EvenementSse {
  evenement: string;
  donnees: string;
}

/**
 * Analyseur du format text/event-stream, indifférent à la façon dont le réseau
 * découpe les morceaux : on peut lui donner le flux octet par octet.
 */
export function creerAnalyseurSse(
  surEvenement: (evenement: EvenementSse) => void,
) {
  let tampon = "";
  let evenement = "";
  let donnees: string[] = [];
  // Un « \r\n » coupé entre deux morceaux ne doit compter que pour une fin de ligne
  let sauterLf = false;

  function envoyer() {
    if (donnees.length > 0) {
      surEvenement({
        evenement: evenement || "message",
        donnees: donnees.join("\n"),
      });
    }
    evenement = "";
    donnees = [];
  }

  function traiterLigne(ligne: string) {
    if (ligne === "") {
      envoyer();
      return;
    }
    if (ligne.startsWith(":")) return; // commentaire (« keep-alive »)
    const i = ligne.indexOf(":");
    const champ = i === -1 ? ligne : ligne.slice(0, i);
    let valeur = i === -1 ? "" : ligne.slice(i + 1);
    if (valeur.startsWith(" ")) valeur = valeur.slice(1);
    if (champ === "event") evenement = valeur;
    else if (champ === "data") donnees.push(valeur);
  }

  return {
    pousser(morceau: string) {
      if (morceau === "") return;
      let texte = morceau;
      if (sauterLf && texte.startsWith("\n")) texte = texte.slice(1);
      sauterLf = texte.endsWith("\r");
      if (texte === "") return;
      tampon += texte.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const lignes = tampon.split("\n");
      tampon = lignes.pop() ?? "";
      for (const ligne of lignes) traiterLigne(ligne);
    },
    /** Fin du flux : traite ce qui reste, même sans ligne vide finale */
    terminer() {
      if (tampon !== "") traiterLigne(tampon);
      tampon = "";
      envoyer();
    },
  };
}

/** Lit un corps de réponse HTTP en continu et rend chaque événement dès qu'il est complet */
export async function lireFluxSse(
  corps: ReadableStream<Uint8Array>,
  surEvenement: (evenement: EvenementSse) => void,
): Promise<void> {
  const lecteur = corps.getReader();
  const decodeur = new TextDecoder();
  const analyseur = creerAnalyseurSse(surEvenement);
  try {
    for (;;) {
      const { done, value } = await lecteur.read();
      if (done) break;
      analyseur.pousser(decodeur.decode(value, { stream: true }));
    }
    analyseur.pousser(decodeur.decode());
    analyseur.terminer();
  } finally {
    try {
      lecteur.releaseLock();
    } catch {
      // une lecture annulée peut encore être en cours : sans importance
    }
  }
}
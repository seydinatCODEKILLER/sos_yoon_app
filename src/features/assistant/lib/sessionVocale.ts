import type { ActionAssistant, EtatAssistant } from "../types/assistant.types";

/**
 * Session vocale en direct avec Soxna Yoon (WebSocket du serveur IA, mode live).
 *
 * Protocole (voir adk/server.py, route /ws) :
 *   navigateur -> serveur : audio brut, PCM 16 bits mono 16 kHz (trames binaires)
 *   serveur -> navigateur : audio brut, PCM 16 bits mono 24 kHz (trames binaires)
 *                           + messages JSON : transcript | action | interrupted | error
 *
 * Le serveur détecte tout seul quand l'utilisateur a fini de parler : il n'y a
 * donc pas de « fin de question » à envoyer. La conversation reste ouverte
 * jusqu'à ce que l'utilisateur la termine.
 */

export interface RappelsSession {
  onEtat: (etat: EtatAssistant) => void;
  onErreur: (message: string) => void;
  /** Soxna a déclenché une action (urgence, orientation, recherche de loi…) */
  onAction?: (action: ActionAssistant) => void;
}

export interface SessionVocale {
  /** Ouvre le micro et la connexion. Résout quand la conversation est prête. */
  demarrer: () => Promise<void>;
  /** Termine la conversation (bouton « Terminer ») et revient à l'état « prêt » */
  terminer: () => void;
  /** Libère tout sans notifier (fermeture de la page) */
  arreter: () => void;
}

export type CreerSession = (rappels: RappelsSession) => SessionVocale;

// ─── Réglages ────────────────────────────────────────────────────────────────

/** Adresse du WebSocket du serveur IA, ex. ws://localhost:8000/ws ou wss://ia.exemple.sn/ws */
const URL_SERVEUR: string | undefined =
  import.meta.env.VITE_SOXNA_WS_URL || undefined;

/** Fréquence de l'audio renvoyé par le serveur */
const FREQUENCE_SORTIE = 24000;
/** Volume (RMS) au-delà duquel l'utilisateur coupe la voix de Soxna en parlant par-dessus */
const SEUIL_INTERRUPTION = 0.08;
/** Volume (RMS) à partir duquel on considère que l'utilisateur parle */
const SEUIL_PAROLE = 0.02;
/** Silence après la dernière transcription avant d'afficher « Soxna réfléchit » */
const DELAI_REFLEXION_MS = 900;
/** Si Soxna ne répond jamais, retour à l'écoute après ce délai */
const DELAI_SECOURS_MS = 15000;
/** Pause tolérée entre deux morceaux d'audio avant de considérer la réponse terminée */
const DELAI_FIN_REPONSE_MS = 350;
/** Temps maximum pour ouvrir la connexion */
const DELAI_CONNEXION_MS = 10000;
/** Marge de lecture pour absorber les à-coups du réseau */
const ANTICIPATION_S = 0.08;

const MESSAGE_GENERIQUE =
  "Impossible de démarrer la conversation. Réessayez dans un instant.";

// ─── Types internes ──────────────────────────────────────────────────────────

class ErreurSession extends Error {}

type MessageServeur =
  | { type: "transcript"; role: "user" | "soxna"; text: string }
  | { type: "action"; action: string; payload?: Record<string, unknown> }
  | { type: "interrupted" }
  | { type: "error"; message: string };

interface RappelsAppel extends RappelsSession {
  /** Connexion perdue ou erreur du serveur en pleine conversation */
  onCoupure: (message: string | null) => void;
}

interface Appel {
  ouvrir: () => Promise<void>;
  fermer: () => void;
}

const ContexteAudio: typeof AudioContext | undefined =
  typeof window === "undefined"
    ? undefined
    : (window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext);

function lireMessage(brut: string): MessageServeur | null {
  try {
    const m: unknown = JSON.parse(brut);
    if (typeof m === "object" && m !== null && "type" in m) {
      return m as MessageServeur;
    }
  } catch {
    // message illisible : ignoré
  }
  return null;
}

function erreurMicro(e: unknown): ErreurSession {
  if (e instanceof DOMException && e.name === "NotFoundError") {
    return new ErreurSession("Aucun micro détecté sur cet appareil.");
  }
  return new ErreurSession(
    "Le micro est bloqué. Autorisez-le dans les réglages de votre navigateur.",
  );
}

// ─── Un appel = une conversation ─────────────────────────────────────────────

function creerAppel(rappels: RappelsAppel): Appel {
  let ferme = false;
  let etat: EtatAssistant = "pret";

  let contexte: AudioContext | null = null;
  let micro: MediaStream | null = null;
  let source: MediaStreamAudioSourceNode | null = null;
  let noeud: AudioWorkletNode | null = null;
  let ws: WebSocket | null = null;
  let annulerConnexion: (() => void) | null = null;

  // Lecture de la voix de Soxna
  let sources: AudioBufferSourceNode[] = [];
  let prochainDebut = 0;

  let minuteurReflexion: number | undefined;
  let minuteurSecours: number | undefined;
  let minuteurFinReponse: number | undefined;
  let derniereParole = 0;

  function changer(suivant: EtatAssistant) {
    if (ferme || etat === suivant) return;
    etat = suivant;
    rappels.onEtat(suivant);
  }

  function effacerMinuteurs() {
    window.clearTimeout(minuteurReflexion);
    window.clearTimeout(minuteurSecours);
    window.clearTimeout(minuteurFinReponse);
  }

  // ── Lecture de la voix ────────────────────────────────────────────────────

  function couperVoix() {
    for (const s of sources) {
      s.onended = null;
      try {
        s.stop();
      } catch {
        // déjà arrêtée
      }
    }
    sources = [];
    prochainDebut = 0;
    window.clearTimeout(minuteurFinReponse);
  }

  function jouer(donnees: ArrayBuffer) {
    if (!contexte || ferme) return;
    // Un nombre impair d'octets ferait échouer Int16Array : on ignore l'octet en trop
    const octets = donnees.byteLength - (donnees.byteLength % 2);
    if (octets === 0) return;

    const int16 = new Int16Array(donnees, 0, octets / 2);
    const f32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) f32[i] = int16[i] / 0x8000;

    const tampon = contexte.createBuffer(1, f32.length, FREQUENCE_SORTIE);
    tampon.copyToChannel(f32, 0);

    const lecture = contexte.createBufferSource();
    lecture.buffer = tampon;
    lecture.connect(contexte.destination);

    // Les morceaux sont planifiés bout à bout pour éviter les craquements
    const maintenant = contexte.currentTime;
    if (prochainDebut < maintenant) prochainDebut = maintenant + ANTICIPATION_S;
    lecture.start(prochainDebut);
    prochainDebut += tampon.duration;

    sources.push(lecture);
    lecture.onended = () => {
      sources = sources.filter((s) => s !== lecture);
      if (sources.length === 0) {
        // Petite tolérance : le morceau suivant peut arriver juste après
        window.clearTimeout(minuteurFinReponse);
        minuteurFinReponse = window.setTimeout(() => {
          if (sources.length === 0) changer("ecoute");
        }, DELAI_FIN_REPONSE_MS);
      }
    };

    effacerMinuteurs();
    changer("reponse");
  }

  // ── Messages du serveur ───────────────────────────────────────────────────

  function planifierReflexion() {
    window.clearTimeout(minuteurReflexion);
    minuteurReflexion = window.setTimeout(() => {
      if (etat !== "ecoute") return;
      changer("reflexion");
      // Garde-fou : si Soxna ne répond jamais, on ne reste pas bloqué
      window.clearTimeout(minuteurSecours);
      minuteurSecours = window.setTimeout(() => {
        if (etat === "reflexion") changer("ecoute");
      }, DELAI_SECOURS_MS);
    }, DELAI_REFLEXION_MS);
  }

  function surMessage(evt: MessageEvent) {
    if (ferme) return;

    // Trame binaire : voix de Soxna
    if (typeof evt.data !== "string") {
      jouer(evt.data as ArrayBuffer);
      return;
    }

    const m = lireMessage(evt.data);
    if (!m) return;

    switch (m.type) {
      case "transcript":
        if (import.meta.env.DEV) console.debug("[soxna]", m.role, m.text);
        if (m.role !== "user") break;
        if (etat === "ecoute") {
          planifierReflexion();
        } else if (
          etat === "reflexion" &&
          performance.now() - derniereParole < 500
        ) {
          // L'utilisateur reprend la parole : on revient à l'écoute
          window.clearTimeout(minuteurSecours);
          changer("ecoute");
          planifierReflexion();
        }
        break;

      case "action":
        rappels.onAction?.({ action: m.action, payload: m.payload ?? {} });
        break;

      case "interrupted":
        // L'utilisateur a coupé la parole à Soxna
        couperVoix();
        effacerMinuteurs();
        changer("ecoute");
        break;

      case "error":
        console.error("[soxna] erreur serveur :", m.message);
        rappels.onCoupure(
          "Soxna Yoon rencontre un problème. Réessayez dans un instant.",
        );
        break;
    }
  }

  // ── Ouverture : audio, micro, connexion ───────────────────────────────────

  async function ouvrir() {
    if (!URL_SERVEUR) {
      throw new ErreurSession(
        "Le mode vocal n'est pas disponible pour le moment.",
      );
    }
    if (!ContexteAudio || !navigator.mediaDevices?.getUserMedia) {
      throw new ErreurSession(
        "Le micro n'est pas disponible sur cet appareil ou dans ce navigateur.",
      );
    }

    // Créé en premier, au plus près du clic (Safari exige un geste de l'utilisateur)
    const audio = new ContexteAudio();
    contexte = audio;
    audio.resume().catch(() => undefined);

    // Le processeur audio vit dans public/pcm-processor.js
    await audio.audioWorklet.addModule(
      `${import.meta.env.BASE_URL}pcm-processor.js`,
    );
    if (ferme) return;

    let flux: MediaStream;
    try {
      flux = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (e) {
      throw erreurMicro(e);
    }
    micro = flux;
    if (ferme) {
      flux.getTracks().forEach((t) => t.stop());
      return;
    }

    // Connexion au serveur IA
    await new Promise<void>((resolve, reject) => {
      const prise = new WebSocket(URL_SERVEUR);
      prise.binaryType = "arraybuffer";
      ws = prise;

      const echec = (message: string) => {
        window.clearTimeout(delai);
        annulerConnexion = null;
        reject(new ErreurSession(message));
      };
      const delai = window.setTimeout(
        () => echec("Soxna Yoon met trop de temps à répondre. Réessayez."),
        DELAI_CONNEXION_MS,
      );
      const injoignable = () =>
        echec("Impossible de joindre Soxna Yoon. Vérifiez votre connexion.");

      annulerConnexion = () => echec("Connexion annulée.");
      prise.onopen = () => {
        window.clearTimeout(delai);
        annulerConnexion = null;
        resolve();
      };
      prise.onerror = injoignable;
      prise.onclose = injoignable;
    });
    if (ferme || !ws) return;

    const prise: WebSocket = ws;
    prise.onmessage = surMessage;
    prise.onerror = null;
    prise.onclose = () => {
      if (!ferme) {
        rappels.onCoupure(
          "La conversation s'est interrompue. Vous pouvez la reprendre.",
        );
      }
    };

    // Micro -> worklet -> WebSocket
    source = audio.createMediaStreamSource(flux);
    noeud = new AudioWorkletNode(audio, "pcm-processor");
    noeud.port.onmessage = (e: MessageEvent<{ pcm: ArrayBuffer; rms: number }>) => {
      if (prise.readyState === WebSocket.OPEN) prise.send(e.data.pcm);

      const { rms } = e.data;
      if (rms >= SEUIL_PAROLE) derniereParole = performance.now();
      // L'utilisateur parle par-dessus Soxna : on coupe sa voix tout de suite
      if (rms >= SEUIL_INTERRUPTION && etat === "reponse") {
        couperVoix();
        effacerMinuteurs();
        changer("ecoute");
      }
    };
    source.connect(noeud);

    // Gain à zéro : garde le graphe audio actif (process() est appelé)
    // sans renvoyer le micro dans les haut-parleurs
    const muet = audio.createGain();
    muet.gain.value = 0;
    noeud.connect(muet);
    muet.connect(audio.destination);

    changer("ecoute");
  }

  function fermer() {
    if (ferme) return;
    ferme = true;
    effacerMinuteurs();
    couperVoix();
    annulerConnexion?.();

    if (noeud) {
      noeud.port.onmessage = null;
      noeud.disconnect();
    }
    source?.disconnect();
    micro?.getTracks().forEach((t) => t.stop());

    if (ws) {
      ws.onmessage = null;
      ws.onclose = null;
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close(1000);
      }
    }
    contexte?.close().catch(() => undefined);
  }

  return { ouvrir, fermer };
}

// ─── Session : une conversation à la fois ────────────────────────────────────

export function creerSessionLive(rappels: RappelsSession): SessionVocale {
  let actif: Appel | null = null;

  async function demarrer() {
    if (actif) return;

    const appel: Appel = creerAppel({
      ...rappels,
      onCoupure: (message) => {
        if (actif !== appel) return;
        actif = null;
        appel.fermer();
        rappels.onEtat("pret");
        if (message) rappels.onErreur(message);
      },
    });
    actif = appel;

    try {
      await appel.ouvrir();
    } catch (e) {
      // Conversation déjà terminée par l'utilisateur : rien à signaler
      if (actif !== appel) return;
      actif = null;
      appel.fermer();
      rappels.onEtat("pret");
      if (e instanceof ErreurSession) {
        rappels.onErreur(e.message);
      } else {
        console.error("[soxna] démarrage impossible :", e);
        rappels.onErreur(MESSAGE_GENERIQUE);
      }
    }
  }

  function terminer() {
    const appel = actif;
    if (!appel) return;
    actif = null;
    appel.fermer();
    rappels.onEtat("pret");
  }

  function arreter() {
    const appel = actif;
    actif = null;
    appel?.fermer();
  }

  return { demarrer, terminer, arreter };
}

/** Session utilisée par l'application */
export const creerSession: CreerSession = creerSessionLive;
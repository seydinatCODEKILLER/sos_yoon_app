// AudioWorklet de Soxna Yoon : tourne sur un thread audio dédié.
// 1. Rééchantillonne le micro (48 kHz en général) vers 16 kHz
// 2. Convertit Float32 -> Int16 (PCM 16 bits, ce qu'attend le serveur)
// 3. Regroupe les échantillons par paquets de 32 ms avant de les envoyer
// 4. Calcule le volume (RMS) de chaque paquet, pour couper la voix de Soxna
//    quand l'utilisateur lui parle par-dessus

const TAILLE_PAQUET = 512; // 512 échantillons à 16 kHz = 32 ms

class PcmProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    // Rapport de décimation : 48 kHz / 16 kHz = 3 (on garde 1 échantillon sur 3)
    this.ratio = sampleRate / 16000;
    this.frac = 0; // position fractionnaire reportée d'un bloc à l'autre
    this.paquet = new Int16Array(TAILLE_PAQUET);
    this.n = 0;
    this.somme = 0;
  }

  process(inputs) {
    const canal = inputs[0] && inputs[0][0];
    if (!canal) return true;

    let idx = this.frac;
    while (idx < canal.length) {
      const s = Math.max(-1, Math.min(1, canal[Math.floor(idx)]));
      this.paquet[this.n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      this.somme += s * s;

      if (this.n === TAILLE_PAQUET) {
        const rms = Math.sqrt(this.somme / TAILLE_PAQUET);
        const pcm = this.paquet.buffer;
        // Transfert sans copie vers le thread principal
        this.port.postMessage({ pcm, rms }, [pcm]);
        this.paquet = new Int16Array(TAILLE_PAQUET);
        this.n = 0;
        this.somme = 0;
      }
      idx += this.ratio;
    }
    this.frac = idx - canal.length;
    return true;
  }
}

registerProcessor("pcm-processor", PcmProcessor);
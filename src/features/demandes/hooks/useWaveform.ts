import { useEffect, useState } from "react";

const NB_BARRES = 48;

/** Barres de repli, déterministes pour une durée donnée */
function barresDeRepli(graine: number, nombre: number): number[] {
  let s = (Math.floor(graine * 1000) % 2147483646) + 1;
  return Array.from({ length: nombre }, () => {
    s = (s * 16807) % 2147483647;
    return 0.25 + 0.75 * ((s % 1000) / 1000);
  });
}

/** Renvoie des hauteurs normalisées (0.12 → 1) représentant le volume de l'enregistrement. */
export function useWaveform(blob: Blob, dureeSecondes: number, nombre = NB_BARRES): number[] {
  const [barres, setBarres] = useState<number[]>(() => barresDeRepli(dureeSecondes, nombre));

  useEffect(() => {
    let annule = false;

    (async () => {
      try {
        const Ctx =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const buffer = await ctx.decodeAudioData(await blob.arrayBuffer());
        void ctx.close();

        const donnees = buffer.getChannelData(0);
        const taille = Math.floor(donnees.length / nombre);
        if (taille === 0) return;

        const niveaux = Array.from({ length: nombre }, (_, i) => {
          let somme = 0;
          for (let j = i * taille; j < (i + 1) * taille; j++) somme += donnees[j] * donnees[j];
          return Math.sqrt(somme / taille);
        });
        const max = Math.max(...niveaux) || 1;
        if (!annule) setBarres(niveaux.map((n) => Math.max(0.12, n / max)));
      } catch {
        /* décodage impossible : on garde les barres de repli */
      }
    })();

    return () => {
      annule = true;
    };
  }, [blob, nombre]);

  return barres;
}
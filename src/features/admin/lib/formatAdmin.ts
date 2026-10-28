export const formaterNombre = (n: number) => n.toLocaleString("fr-FR");

/** « il y a 5 min », « il y a 3 h », « il y a 2 j ». `maintenant` en ms. */
export function ilYa(iso: string, maintenant: number) {
  const min = Math.max(0, Math.floor((maintenant - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

/** « Me Abdou Diop » → « AD » */
export function initiales(nomComplet: string) {
  const mots = nomComplet.replace(/^(Me|Mme|M\.|Maître)\s+/i, "").split(/\s+/).filter(Boolean);
  return mots
    .slice(0, 2)
    .map((m) => m.charAt(0))
    .join("")
    .toUpperCase();
}
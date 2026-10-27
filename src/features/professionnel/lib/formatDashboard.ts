export const DUREE_ESSAI_JOURS = 30;

export function formaterDuree(secondes: number) {
  const minutes = Math.round(secondes / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

/** `maintenant` vient de dataUpdatedAt : pas de Date.now() dans le rendu. */
export function ilYa(iso: string, maintenant: number) {
  const min = Math.max(0, Math.round((maintenant - new Date(iso).getTime()) / 60_000));
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

export function initiales(affichage: string) {
  const mots = affichage.replace(/\./g, "").split(" ").filter(Boolean);
  return ((mots[0]?.[0] ?? "") + (mots[1]?.[0] ?? "")).toUpperCase();
}

function enDate(iso: string) {
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
}

export function formaterDateLongue(iso: string) {
  return enDate(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function libelleJour(date: string) {
  const d = enDate(date);
  const j = d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");
  return `${j.charAt(0).toUpperCase()}${j.slice(1)} (${d.getDate()})`;
}

export function formaterMontant(montant: number, devise: string) {
  const unite = devise === "XOF" ? "FCFA" : devise;
  return `${new Intl.NumberFormat("fr-FR").format(montant)} ${unite}`;
}

/** Courbe lissée (Catmull-Rom → Bézier) passant par tous les points. */
export function courbeLissee(p: { x: number; y: number }[]) {
  if (p.length === 0) return "";
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    d += ` C${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  return d;
}

export function formaterCompteARebours(secondes: number) {
  if (secondes >= 3600) return formaterDuree(secondes);
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  // Au-delà de 10 min, les secondes n'apportent rien
  return secondes >= 600 ? `${m} min` : `${m} min ${String(s).padStart(2, "0")} s`;
}

export function formaterMmSs(secondes: number) {
  return `${Math.floor(secondes / 60)}:${String(secondes % 60).padStart(2, "0")}`;
}

export function formaterDateCourte(iso: string) {
  return enDate(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}
const chiffres = (tel: string) => tel.replace(/\D/g, "");

export const lienAppel = (telephone: string) => `tel:+${chiffres(telephone)}`;

/** Ouvre WhatsApp (app ou web) avec un message déjà rédigé */
export function lienWhatsApp(
  telephone: string,
  nomProfessionnel: string,
  reference: string,
) {
  const message = `Bonjour ${nomProfessionnel}, je vous contacte via SOS Yoon au sujet de ma demande ${reference}.`;
  return `https://wa.me/${chiffres(telephone)}?text=${encodeURIComponent(message)}`;
}

const TITRES = new Set(["me", "maître", "maitre", "dr", "pr"]);

export function initiales(nomComplet: string) {
  const mots = nomComplet
    .split(/\s+/)
    .filter((m) => m && !TITRES.has(m.toLowerCase()));
  if (mots.length === 0) return "?";
  const premier = mots[0][0];
  const dernier = mots.length > 1 ? mots[mots.length - 1][0] : "";
  return (premier + dernier).toUpperCase();
}

/** "Me Mamadou Diallo" → "Me Diallo" */
export function nomCourt(nomComplet: string) {
  const mots = nomComplet.split(/\s+/).filter(Boolean);
  if (mots.length >= 3 && TITRES.has(mots[0].toLowerCase())) {
    return `${mots[0]} ${mots[mots.length - 1]}`;
  }
  return nomComplet;
}
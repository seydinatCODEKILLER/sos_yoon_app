export type ProfilConnexion = "particulier" | "professionnel";

const CLE = "sosyoon.dernierProfilConnexion";

export function lireDernierProfil(): ProfilConnexion | null {
  try {
    const v = localStorage.getItem(CLE);
    return v === "particulier" || v === "professionnel" ? v : null;
  } catch {
    return null;
  }
}

export function memoriserProfil(profil: ProfilConnexion) {
  try {
    localStorage.setItem(CLE, profil);
  } catch {
    /* stockage indisponible : on ignore */
  }
}
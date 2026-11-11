/**
 * Informations légales de l'éditeur. À REMPLIR AVANT LA MISE EN LIGNE : tant qu'une valeur reste
 * entre crochets, elle s'affiche surlignée sur les pages /cgu et /confidentialite pour ne pas être oubliée.
 */
export const INFOS_LEGALES = {
  editeur: "[Raison sociale de l'éditeur de SOS Yoon]",
  formeJuridique: "[Forme juridique]",
  adresse: "[Adresse du siège social, Sénégal]",
  immatriculation: "[NINEA / RCCM]",
  emailContact: "[adresse e-mail de contact]",
  emailDonnees: "[adresse e-mail pour les données personnelles]",
  hebergeur: "[Hébergeur et pays d'hébergement]",
  tribunal: "[tribunaux de Dakar]",
} as const;

/** Version envoyée au serveur à l'inscription (`versionCgu`) : à changer à chaque évolution des CGU. */
export const VERSION_CGU = "1.0";
export const VERSION_CONFIDENTIALITE = "1.0";

/** yyyy-MM-dd */
export const DATE_MISE_A_JOUR = "2026-11-11";

export function formaterDateLegale(jour: string): string {
  const [a, m, j] = jour.split("-").map(Number);
  return new Date(a, m - 1, j).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Lien cliquable si l'adresse est renseignée, sinon le texte entre crochets (surligné à l'affichage). */
export function lienMail(email: string): string {
  return email.startsWith("[") ? email : `[${email}](mailto:${email})`;
}
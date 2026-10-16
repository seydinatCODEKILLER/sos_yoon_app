/** "+221771234513" → "+221 77 ••• •• 13" */
export function masquerTelephone(telephone: string) {
  const chiffres = telephone.replace(/\D/g, "");
  if (chiffres.startsWith("221") && chiffres.length === 12) {
    const local = chiffres.slice(3);
    return `+221 ${local.slice(0, 2)} ••• •• ${local.slice(-2)}`;
  }
  // Format inattendu : on ne garde que les 2 derniers chiffres
  return `${telephone.slice(0, 4)} ••• ${telephone.slice(-2)}`;
}

/** "Inscrit en septembre 2026" */
export function libelleInscription(iso: string) {
  const mois = new Date(iso).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  return `Inscrit en ${mois}`;
}
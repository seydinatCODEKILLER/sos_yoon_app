/**
 * Le backend envoie des dates sans fuseau ("2026-11-09T16:44:12.123456").
 * Sans correctif, le navigateur les lirait en heure locale : on les traite comme de l'UTC,
 * comme le montre la spécification ("…Z").
 */
export function parseDateServeur(iso: string): Date {
  const aFuseau = /(Z|[+-]\d{2}:?\d{2})$/i.test(iso);
  return new Date(aFuseau ? iso : `${iso}Z`);
}

const debutDeJour = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function formatDateDemande(iso: string) {
  const date = parseDateServeur(iso);
  const jours = Math.round(
    (debutDeJour(new Date()) - debutDeJour(date)) / (24 * 3600 * 1000),
  );

  if (jours <= 0) {
    const heure = date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `Aujourd'hui, ${heure}`;
  }
  if (jours === 1) return "Hier";
  if (jours < 30) return `Il y a ${jours} jours`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "9 novembre 2026 à 18:20" */
export function formatDateComplete(iso: string) {
  const date = parseDateServeur(iso);
  const jour = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const heure = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${jour} à ${heure}`;
}

/** "14:32" */
export function formatHeure(iso: string) {
  return parseDateServeur(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
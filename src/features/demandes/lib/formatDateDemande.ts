const debutDeJour = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function formatDateDemande(iso: string) {
  const date = new Date(iso);
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

/** "14:32" */
export function formatHeure(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
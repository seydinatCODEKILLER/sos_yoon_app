import type { Notification } from "../types/notification.types";

export interface GroupeNotifications {
  libelle: string;
  notifications: Notification[];
}

const debutDeJour = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function libelleJour(date: Date) {
  const jours = Math.round(
    (debutDeJour(new Date()) - debutDeJour(date)) / (24 * 3600 * 1000),
  );
  if (jours <= 0) return "Aujourd'hui";
  if (jours === 1) return "Hier";
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/** Suppose les notifications déjà triées de la plus récente à la plus ancienne */
export function groupeParJour(
  notifications: Notification[],
): GroupeNotifications[] {
  const groupes: GroupeNotifications[] = [];
  for (const n of notifications) {
    const libelle = libelleJour(new Date(n.date));
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.libelle === libelle) dernier.notifications.push(n);
    else groupes.push({ libelle, notifications: [n] });
  }
  return groupes;
}
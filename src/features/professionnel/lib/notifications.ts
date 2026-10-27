import type { Notification } from "../types/notification.types";
import { ajouterJours, cleJour } from "./agenda";

export const TAILLE_NOTIFICATIONS = 10;

export function estAbonnement(n: Notification) {
  return n.type.startsWith("ABONNEMENT");
}

/** Destination dans l'espace pro ; null = pas de navigation */
export function cibleDe(n: Notification): string | null {
  switch (n.action?.cible) {
    case "SOLLICITATION":
      return "/pro/demandes";
    case "ABONNEMENT":
      return "/pro/abonnement";
    default:
      return null;
  }
}

/** "À l'instant", "Il y a 4 min", "Il y a 3 h", "Hier", puis date courte. `maintenant` en ms. */
export function ilYaNotification(iso: string, maintenant: number) {
  const ecart = Math.max(0, maintenant - new Date(iso).getTime());
  const min = Math.floor(ecart / 60_000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  const j = Math.floor(h / 24);
  if (j === 1) return "Hier";
  if (j < 7) return `Il y a ${j} jours`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export interface GroupeNotifications {
  cle: string;
  titre: string;
  date: string;
  notifications: Notification[];
}

/** Regroupe par jour (liste déjà triée du plus récent au plus ancien) */
export function grouperParJour(liste: Notification[], maintenant: number): GroupeNotifications[] {
  const auj = cleJour(new Date(maintenant));
  const hier = cleJour(ajouterJours(new Date(maintenant), -1));
  const groupes: GroupeNotifications[] = [];

  for (const n of liste) {
    const d = new Date(n.dateCreation);
    const cle = cleJour(d);
    let groupe = groupes.find((g) => g.cle === cle);
    if (!groupe) {
      groupe = {
        cle,
        titre:
          cle === auj
            ? "Aujourd'hui"
            : cle === hier
              ? "Hier"
              : d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
        date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        notifications: [],
      };
      groupes.push(groupe);
    }
    groupe.notifications.push(n);
  }
  return groupes;
}
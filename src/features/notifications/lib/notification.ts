import { demandeRoutes } from "@/features/demandes/lib/demandeRoutes";
import { parseDateServeur } from "@/features/demandes/lib/formatDateDemande";
import type { Notification } from "../types/notification.types";

export type TonNotification =
  | "succes"
  | "attention"
  | "alerte"
  | "info"
  | "neutre";

/**
 * Ton visuel d'une notification. Le backend émet aussi des SYSTEME pour la recherche
 * (« Recherche en cours ») et l'annulation (« Demande annulée ») : seul le titre les distingue.
 */
export function tonDe(n: Notification): TonNotification {
  switch (n.type) {
    case "DEMANDE_ACCEPTEE":
    case "COMPTE_RENDU_DISPONIBLE":
      return "succes";
    case "DEMANDE_TERMINEE":
      return "neutre";
    case "COMPTE_SUSPENDU":
      return "alerte";
    case "SYSTEME":
      if (/annul/i.test(n.titre)) return "alerte";
      if (/recherche/i.test(n.titre)) return "attention";
      return "info";
    default:
      return "info";
  }
}

/** Le bouton d'action est mis en avant quand la bonne nouvelle appelle une réaction. */
export function actionMiseEnAvant(n: Notification) {
  return (
    n.type === "DEMANDE_ACCEPTEE" ||
    n.action?.cible === "TELECHARGER_COMPTE_RENDU"
  );
}

/**
 * Destination d'un clic. Le particulier suit tout depuis la page de la demande :
 * acceptation, clôture (compte-rendu à télécharger) et conversation y sont regroupés.
 */
export function cibleDe(n: Notification): string | null {
  return n.demandeId ? demandeRoutes.suivi(n.demandeId) : null;
}

/** Date lisible ou null : jamais d'« Invalid Date » à l'écran. */
function dateValide(iso: string | null): Date | null {
  if (!iso) return null;
  const d = parseDateServeur(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const MIN = 60_000;
const JOUR = 24 * 3600 * 1000;

const debutDeJour = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** « À l'instant », « Il y a 12 min », puis l'heure (« 14:32 ») : le jour figure déjà dans l'en-tête du groupe. */
export function heureNotification(iso: string | null, maintenant: number) {
  const date = dateValide(iso);
  if (!date) return "";
  const ecart = maintenant - date.getTime();
  if (ecart < MIN) return "À l'instant";
  if (ecart < 60 * MIN) return `Il y a ${Math.floor(ecart / MIN)} min`;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function dateCompleteNotification(iso: string | null) {
  return (
    dateValide(iso)?.toLocaleString("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
    }) ?? "Date inconnue"
  );
}

export interface GroupeNotifications {
  cle: string;
  libelle: string;
  notifications: Notification[];
}

function libelleJour(date: Date, maintenant: number) {
  const jours = Math.round(
    (debutDeJour(new Date(maintenant)) - debutDeJour(date)) / JOUR,
  );
  if (jours <= 0) return "Aujourd'hui";
  if (jours === 1) return "Hier";
  const texte = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(date.getFullYear() !== new Date(maintenant).getFullYear() && {
      year: "numeric",
    }),
  });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Regroupe par jour calendaire local en conservant l'ordre du serveur (récent → ancien). */
export function groupeParJour(
  notifications: Notification[],
  maintenant: number,
): GroupeNotifications[] {
  const groupes: GroupeNotifications[] = [];
  for (const n of notifications) {
    const date = dateValide(n.dateCreation);
    const cle = date ? String(debutDeJour(date)) : "sans-date";
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.cle === cle) {
      dernier.notifications.push(n);
    } else {
      groupes.push({
        cle,
        libelle: date ? libelleJour(date, maintenant) : "Date inconnue",
        notifications: [n],
      });
    }
  }
  return groupes;
}
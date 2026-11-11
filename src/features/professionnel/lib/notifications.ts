import { parseDateServeur } from "@/features/demandes/lib/formatDateDemande";
import type { Notification } from "../types/notification.types";

export const TAILLE_NOTIFICATIONS = 15;

export type TonNotification = "action" | "alerte" | "succes" | "info";

export type CategorieNotification =
  | "SOLLICITATION"
  | "ABONNEMENT"
  | "DOSSIER"
  | "COMPTE"
  | "SYSTEME";

const cibleAction = (n: Notification) => n.action?.cible ?? null;

/** Rappels d'échéance et paiements : le backend les émet en type SYSTEME avec la cible ABONNEMENT. */
export function estAbonnement(n: Notification) {
  return cibleAction(n) === "ABONNEMENT" || n.type.startsWith("ABONNEMENT_");
}

export function estSollicitation(n: Notification) {
  return (
    cibleAction(n) === "SOLLICITATION" ||
    n.type === "SOLLICITATION_NOUVELLE" ||
    n.type === "SOLLICITATION_RECUE"
  );
}

export function categorieDe(n: Notification): CategorieNotification {
  if (estSollicitation(n)) return "SOLLICITATION";
  if (estAbonnement(n)) return "ABONNEMENT";
  if (n.type === "COMPTE_SUSPENDU") return "COMPTE";
  if (
    n.type === "DOSSIER_APPROUVE" ||
    n.type === "DOSSIER_REJETE" ||
    n.type === "DEMANDE_ACCEPTEE" ||
    n.type === "DEMANDE_TERMINEE" ||
    n.type === "COMPTE_RENDU_DISPONIBLE"
  )
    return "DOSSIER";
  return "SYSTEME";
}

export function tonDe(n: Notification): TonNotification {
  if (estSollicitation(n)) return "action";
  if (
    n.type === "ABONNEMENT_EXPIRE" ||
    n.type === "ABONNEMENT_ESSAI_BIENTOT_FIN" ||
    n.type === "COMPTE_SUSPENDU" ||
    n.type === "DOSSIER_REJETE"
  )
    return "alerte";
  if (
    n.type === "DEMANDE_ACCEPTEE" ||
    n.type === "DOSSIER_APPROUVE" ||
    n.type === "DEMANDE_TERMINEE"
  )
    return "succes";
  // Rappel d'échéance émis en SYSTEME : le titre est le seul indice fiable.
  if (estAbonnement(n) && /bient[oô]t|arrive à échéance|expir/i.test(n.titre))
    return "alerte";
  return "info";
}

/**
 * Destination d'un clic dans l'espace professionnel.
 * - SOLLICITATION → liste des demandes entrantes
 * - ABONNEMENT    → onglet abonnement du profil
 * - DEMANDE       → le dossier (dans le backend, un dossier EST la demande : même identifiant)
 */
export function cibleDe(n: Notification): string | null {
  switch (n.action?.cible) {
    case "SOLLICITATION":
      return "/pro/demandes";
    case "ABONNEMENT":
      return "/pro/abonnement";
    case "DEMANDE":
      return n.demandeId ? `/pro/dossiers/${n.demandeId}` : "/pro/dossiers";
    default:
      break;
  }
  if (estSollicitation(n)) return "/pro/demandes";
  if (estAbonnement(n)) return "/pro/abonnement";
  return null;
}

/** Date lisible ou null : jamais d'« Invalid Date » à l'écran, même si le serveur n'envoie rien. */
function dateValide(iso: string | null): Date | null {
  if (!iso) return null;
  const d = parseDateServeur(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

const MIN = 60_000;
const JOUR = 24 * 3600 * 1000;

const debutDeJour = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** « À l'instant », « Il y a 12 min », puis l'heure ("14:32") : le jour est déjà dans l'en-tête du groupe. */
export function heureNotification(iso: string | null, maintenant: number) {
  const date = dateValide(iso);
  if (!date) return "";
  const ecart = maintenant - date.getTime();
  if (ecart < MIN) return "À l'instant";
  if (ecart < 60 * MIN) return `Il y a ${Math.floor(ecart / MIN)} min`;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/** Version longue pour l'attribut title / lecteurs d'écran. */
export function dateCompleteNotification(iso: string | null) {
  return dateValide(iso)?.toLocaleString("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }) ?? "Date inconnue";
}

export interface GroupeNotifications {
  cle: string;
  titre: string;
  notifications: Notification[];
}

const TITRE_SANS_DATE = "Date inconnue";

function titreDuJour(date: Date, maintenant: number) {
  const jours = Math.round((debutDeJour(new Date(maintenant)) - debutDeJour(date)) / JOUR);
  if (jours <= 0) return "Aujourd'hui";
  if (jours === 1) return "Hier";
  const texte = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(date.getFullYear() !== new Date(maintenant).getFullYear() && { year: "numeric" }),
  });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

/** Regroupe par jour calendaire local en conservant l'ordre du serveur (récent → ancien). */
export function grouperParJour(
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
        titre: date ? titreDuJour(date, maintenant) : TITRE_SANS_DATE,
        notifications: [n],
      });
    }
  }
  return groupes;
}
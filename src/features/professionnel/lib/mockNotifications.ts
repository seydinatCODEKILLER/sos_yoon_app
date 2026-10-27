import type { NotificationsApi } from "../api/notificationsApi";
import type { Notification } from "../types/notification.types";

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const il = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const JOUR = 60 * 24;

let notifications: Notification[] = [
  {
    id: "n1",
    type: "SOLLICITATION_NOUVELLE",
    titre: "Nouvelle demande urgente reçue",
    message: "Amadou Sylla · Droit des affaires & Pacte d'actionnaires (Fintech Dakar)",
    lue: false,
    dateCreation: il(4),
    referenceDemande: "SY-00251",
    lieu: "Plateau, Dakar",
    delaiReponseMinutes: 20,
    action: { libelle: "Examiner la demande", cible: "SOLLICITATION" },
  },
  {
    id: "n2",
    type: "SOLLICITATION_NOUVELLE",
    titre: "Nouvelle demande reçue",
    message: "Fatou Ba · Litige de bail commercial",
    lue: true,
    dateCreation: il(JOUR + 90),
    referenceDemande: "SY-00247",
    lieu: "Médina, Dakar",
    delaiReponseMinutes: null,
    action: { libelle: "Examiner la demande", cible: "SOLLICITATION" },
  },
  {
    id: "n3",
    type: "ABONNEMENT_ESSAI_BIENTOT_FIN",
    titre: "Votre essai gratuit se termine bientôt",
    message: "Il vous reste 5 jours d'essai gratuit. L'abonnement est de 50 000 FCFA par mois.",
    lue: true,
    dateCreation: il(2 * JOUR),
    referenceDemande: null,
    lieu: null,
    delaiReponseMinutes: null,
    action: { libelle: "Voir l'abonnement", cible: "ABONNEMENT" },
  },
  {
    id: "n4",
    type: "SOLLICITATION_NOUVELLE",
    titre: "Nouvelle demande reçue",
    message: "Moussa Diallo · Succession et partage de biens",
    lue: true,
    dateCreation: il(3 * JOUR),
    referenceDemande: "SY-00240",
    lieu: "Pikine",
    delaiReponseMinutes: null,
    action: { libelle: "Examiner la demande", cible: "SOLLICITATION" },
  },
  {
    id: "n5",
    type: "ABONNEMENT_ESSAI_DEBUTE",
    titre: "Votre essai gratuit a commencé",
    message: "Profitez de 30 jours d'essai gratuit sur SOS Yoon.",
    lue: true,
    dateCreation: il(25 * JOUR),
    referenceDemande: null,
    lieu: null,
    delaiReponseMinutes: null,
    action: null,
  },
];

export const mockNotificationsApi: NotificationsApi = {
  async lister(filtre, page, taille) {
    await wait();
    const filtrees = notifications.filter((n) => (filtre === "NON_LUES" ? !n.lue : true));
    const debut = page * taille;
    return {
      contenu: filtrees.slice(debut, debut + taille),
      page,
      taille,
      totalElements: filtrees.length,
      totalPages: Math.max(1, Math.ceil(filtrees.length / taille)),
    };
  },

  async compteurs() {
    await wait(150);
    return {
      toutes: notifications.length,
      nonLues: notifications.filter((n) => !n.lue).length,
    };
  },

  async marquerLue(id) {
    await wait(150);
    notifications = notifications.map((n) => (n.id === id ? { ...n, lue: true } : n));
  },

  async toutLire() {
    await wait(200);
    notifications = notifications.map((n) => ({ ...n, lue: true }));
  },
};
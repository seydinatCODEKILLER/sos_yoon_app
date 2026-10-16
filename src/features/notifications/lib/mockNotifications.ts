import type { Notification } from "../types/notification.types";
import type { NotificationsApi } from "../api/notificationsApi";

const wait = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/** MOCK : true pour afficher des notifications, false pour tester l'état vide */
const AVEC_NOTIFICATIONS = true;

const il = (heures: number) =>
  new Date(Date.now() - heures * 3600 * 1000).toISOString();

let notifications: Notification[] = AVEC_NOTIFICATIONS
  ? [
      {
        id: "n1",
        type: "DEMANDE_ACCEPTEE",
        titre: "Me Diallo a accepté",
        message:
          "Votre dossier pour un constat d'huissier est désormais pris en charge.",
        date: il(0.5),
        lue: false,
        demandeId: "hist-1",
      },
      {
        id: "n2",
        type: "DEMANDE_SANS_REPONSE",
        titre: "Aucune réponse à votre demande",
        message:
          "Nous avons élargi la recherche, mais aucun professionnel n'a répondu.",
        date: il(3),
        lue: false,
        demandeId: "hist-2",
      },
      {
        id: "n3",
        type: "DEMANDE_TERMINEE",
        titre: "Orientation juriste terminée",
        message:
          "La consultation avec votre conseiller s'est achevée. Vous pouvez évaluer l'échange.",
        date: il(26),
        lue: true,
        demandeId: "hist-1",
      },
    ]
  : [];

export const mockNotificationsApi: NotificationsApi = {
  async lister() {
    await wait();
    return [...notifications].sort((a, b) => b.date.localeCompare(a.date));
  },

  async marquerLue(id) {
    await wait(150);
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, lue: true } : n,
    );
  },

  async toutMarquerLu() {
    await wait(300);
    notifications = notifications.map((n) => ({ ...n, lue: true }));
  },
};
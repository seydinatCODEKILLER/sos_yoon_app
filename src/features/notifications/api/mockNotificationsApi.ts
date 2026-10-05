import type { AppNotification } from "@/features/notifications/types/notification.types";

/**
 * TODO: à remplacer par un vrai appel API une fois le back-end connecté.
 */
export async function getRecentNotifications(): Promise<{
  items: AppNotification[];
  nonLues: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const items: AppNotification[] = [
    {
      id: "notif-1",
      userId: "mock-user",
      type: "DEMANDE_RECHERCHE_PROFESSIONNEL",
      titre: "Recherche en cours",
      message: "Nous recherchons un avocat disponible près de vous.",
      demandeId: "demande-1",
      lu: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: "notif-2",
      userId: "mock-user",
      type: "DEMANDE_CONFIRMATION",
      titre: "Demande reçue",
      message: "Votre demande vocale a bien été enregistrée.",
      demandeId: "demande-2",
      lu: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];

  return { items, nonLues: items.filter((n) => !n.lu).length };
}
import type { Demande } from "@/features/demandes/types/demande.types";

/**
 * TODO: à remplacer par un vrai appel API une fois le back-end connecté.
 * Retourne les demandes les plus récentes de l'utilisateur, triées par date.
 */
export async function getRecentDemandes(): Promise<Demande[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const mock: Demande[] = [
    {
      id: "demande-1",
      userId: "mock-user",
      descriptionTexte: "Litige avec mon propriétaire concernant le dépôt de garantie.",
      audioUrl: null,
      latitude: 14.7167,
      longitude: -17.4677,
      statut: "RECHERCHE_PROFESSIONNEL",
      metierIdentifie: "AVOCAT",
      urgence: "MOYENNE",
      professionnelId: null,
      professionnel: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "demande-2",
      userId: "mock-user",
      descriptionTexte: null,
      audioUrl: "blob:mock-audio",
      latitude: 14.7167,
      longitude: -17.4677,
      statut: "ANALYSE_EN_COURS",
      metierIdentifie: null,
      urgence: null,
      professionnelId: null,
      professionnel: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];

  return mock;
}
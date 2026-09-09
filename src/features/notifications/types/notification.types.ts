import type { PaginatedApiResponse } from "@/types/api.types";

export type NotificationType =
  | "DEMANDE_CONFIRMATION"
  | "DEMANDE_ANALYSE_EN_COURS"
  | "DEMANDE_RECHERCHE_PROFESSIONNEL"
  | "DEMANDE_PROFESSIONNEL_TROUVE"
  | "DEMANDE_ACCEPTEE"
  | "DEMANDE_REFUSEE"
  | "NOUVELLE_DEMANDE";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  titre: string;
  message: string;
  demandeId: string | null;
  lu: boolean;
  createdAt: string;
}

export interface ListNotificationsFilters {
  lu?: boolean;
  page?: number;
  limit?: number;
}

// Réponse spécifique : nonLues est au même niveau que data/pagination,
// pas imbriqué dans data comme pourrait le laisser penser PaginatedApiResponse seul.
export interface NotificationsListResponse
  extends PaginatedApiResponse<AppNotification> {
  nonLues: number;
}
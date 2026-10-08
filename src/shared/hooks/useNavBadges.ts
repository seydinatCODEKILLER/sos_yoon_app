import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import type { UserRole } from "@/types/user.types";
import type { NavBadgeKey } from "@/config/navigation";

type Badges = Partial<Record<NavBadgeKey, number>>;

const MOCK: Record<UserRole, Badges> = {
  PARTICULIER: { demandes: 2, notifications: 1 },
  PRO: { demandes: 3, dossiers: 12, agenda: 2, messages: 2, notifications: 1 },
  ADMIN: { professionnelsEnAttente: 6 },
};

export function useNavBadges(role: UserRole): Badges {
  if (USE_MOCK_API) return MOCK[role];
  return {}; // TODO : requêtes réelles quand les endpoints seront connus
}
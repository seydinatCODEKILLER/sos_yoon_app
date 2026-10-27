import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import type { UserRole } from "@/types/user.types";
import type { NavBadgeKey } from "@/config/navigation";
import { useCompteursDossiers } from "@/features/professionnel/hooks/useDossiers";
import { useTableauDeBord } from "@/features/professionnel/hooks/useTableauDeBord";
import { useCompteursNotifications } from "@/features/professionnel/hooks/useNotifications";

type Badges = Partial<Record<NavBadgeKey, number>>;

const MOCK: Record<Exclude<UserRole, "PRO">, Badges> = {
  PARTICULIER: { demandes: 2, notifications: 1 },
  ADMIN: { professionnelsEnAttente: 6 },
};

export function useNavBadges(role: UserRole): Badges {
  // Les hooks s'appellent toujours, mais ne font de requête que pour le pro
  const pro = role === "PRO";
  const { data: tableau } = useTableauDeBord("7j", pro);
  const { data: compteurs } = useCompteursDossiers(pro);
const { data: compteursNotifs } = useCompteursNotifications(pro);

  if (role === "PRO") {
    return {
      demandes: tableau?.sollicitationsEnAttente,
      dossiers: compteurs?.enCours,
      notifications: compteursNotifs?.nonLues || undefined,
      // TODO : GET /notifications/compteurs quand l'écran sera branché
      ...(USE_MOCK_API ? { notifications: 1 } : {}),
    };
  }

  if (USE_MOCK_API) return MOCK[role];
  return {}; // TODO : requêtes réelles côté particulier et admin
}
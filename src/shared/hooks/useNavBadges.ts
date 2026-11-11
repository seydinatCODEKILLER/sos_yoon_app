import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import type { UserRole } from "@/types/user.types";
import type { NavBadgeKey } from "@/config/navigation";
import { useCompteursDossiers } from "@/features/professionnel/hooks/useDossiers";
import { useTableauDeBord } from "@/features/professionnel/hooks/useTableauDeBord";
import { useCompteursNotifications } from "@/features/professionnel/hooks/useNotifications";
import { useTableauDeBordAdmin } from "@/features/admin/hooks/useDashboardAdmin";

type Badges = Partial<Record<NavBadgeKey, number>>;

const MOCK: Record<Exclude<UserRole, "PRO">, Badges> = {
  PARTICULIER: { demandes: 2, notifications: 1 },
  ADMIN: { professionnelsEnAttente: 6, demandesAQualifier: 2 },
};

export function useNavBadges(role: UserRole): Badges {
  const pro = role === "PRO";
  const admin = role === "ADMIN";
  const { data: tableau } = useTableauDeBord("7j", pro);
  const { data: compteurs } = useCompteursDossiers(pro);
  const { data: compteursNotifs } = useCompteursNotifications(pro);
  const { data: tableauAdmin } = useTableauDeBordAdmin(admin);

  if (role === "PRO") {
    return {
      demandes: tableau?.sollicitationsEnAttente,
      dossiers: compteurs?.enCours,
      notifications: compteursNotifs?.nonLues || undefined,
      ...(USE_MOCK_API ? { notifications: 1 } : {}),
    };
  }

  if (USE_MOCK_API) return MOCK[role];

  if (role === "ADMIN") {
    return {
      professionnelsEnAttente: tableauAdmin?.professionnels.enAttente || undefined,
      demandesAQualifier: tableauAdmin?.demandes.aQualifier || undefined,
    };
  }

  return {};
}
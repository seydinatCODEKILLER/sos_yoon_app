import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { authApi } from "../api/authApi";
import { mockAuthApi } from "../lib/mockAuth";

/**
 * Ce que les hooks utilisent aujourd'hui. À étendre au fur et à mesure.
 * La connexion par code SMS n'existe plus : seule la connexion par code secret reste.
 */
type AuthService = {
  particulier: Omit<
    typeof authApi.particulier,
    "demanderCodeConnexion" | "verifierCodeConnexion"
  >;
  pro: Pick<typeof authApi.pro, "connexion">;
};

export const authService: AuthService = USE_MOCK_API ? mockAuthApi : authApi;
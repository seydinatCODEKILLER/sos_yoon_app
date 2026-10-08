import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { authApi } from "../api/authApi";
import { mockAuthApi } from "../lib/mockAuth";

/** Ce que les hooks utilisent aujourd'hui. À étendre au fur et à mesure. */
type AuthService = {
  particulier: typeof authApi.particulier;
  pro: Pick<typeof authApi.pro, "connexion">;
};

export const authService: AuthService = USE_MOCK_API ? mockAuthApi : authApi;
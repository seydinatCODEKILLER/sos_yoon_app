import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { utilisateursAdminApi } from "../api/utilisateursAdminApi";
import { mockUtilisateursAdminApi } from "./mockUtilisateursAdmin";

export const utilisateursAdminService = USE_MOCK_API ? mockUtilisateursAdminApi : utilisateursAdminApi;
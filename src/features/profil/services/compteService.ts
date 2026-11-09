import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { mockCompteApi } from "../lib/mockCompte";
import { compteApi } from "../api/compteApi";

export const compteService = USE_MOCK_API ? mockCompteApi : compteApi;
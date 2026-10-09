import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { mockDemandesApi } from "../lib/mockDemandes";
import { demandesApi, type DemandesApi } from "../api/demandeApi";

export const demandesService: DemandesApi = USE_MOCK_API ? mockDemandesApi : demandesApi;
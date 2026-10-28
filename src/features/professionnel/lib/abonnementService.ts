import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { abonnementApi, type AbonnementApi } from "../api/abonnementApi";
import { mockAbonnementApi } from "./mockAbonnement";

export const abonnementService: AbonnementApi = USE_MOCK_API ? mockAbonnementApi : abonnementApi;
import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { motDePasseApi, type MotDePasseApi } from "../api/motDePasseApi";
import { mockMotDePasseApi } from "../lib/mockMotDePasse";

export const motDePasseService: MotDePasseApi = USE_MOCK_API ? mockMotDePasseApi : motDePasseApi;
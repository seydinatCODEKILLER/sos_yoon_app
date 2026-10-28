import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { profilApi, type ProfilApi } from "../api/profilApi";
import { mockProfilApi } from "./mockProfil";

export const profilService: ProfilApi = USE_MOCK_API ? mockProfilApi : profilApi;
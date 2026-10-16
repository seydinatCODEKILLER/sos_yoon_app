
import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { mockProfilApi } from "../lib/mockProfil";
import { profilApi } from "../api/profilApi";

export const profilService = USE_MOCK_API ? mockProfilApi : profilApi;
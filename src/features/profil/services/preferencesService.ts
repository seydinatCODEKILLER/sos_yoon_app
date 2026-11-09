import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { mockPreferencesApi } from "../lib/mockPreferences";
import { preferencesApi } from "../api/preferencesApi";

export const preferencesService = USE_MOCK_API ? mockPreferencesApi : preferencesApi;
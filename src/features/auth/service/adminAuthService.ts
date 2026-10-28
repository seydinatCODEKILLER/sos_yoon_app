import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { adminAuthApi } from "../api/adminAuthApi";
import { mockAuthApi } from "../lib/mockAuth";

export const adminAuthService = USE_MOCK_API ? mockAuthApi.admin : adminAuthApi;
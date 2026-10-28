import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { professionnelsAdminApi } from "../api/professionnelsAdminApi";
import { mockProfessionnelsAdminApi } from "./mockProfessionnelsAdmin";

export const professionnelsAdminService = USE_MOCK_API ? mockProfessionnelsAdminApi : professionnelsAdminApi;
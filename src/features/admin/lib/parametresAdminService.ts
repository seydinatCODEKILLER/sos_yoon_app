import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { parametresAdminApi } from "../api/parametresAdminApi";
import { mockParametresAdminApi } from "./mockParametresAdmin";

export const parametresAdminService = USE_MOCK_API ? mockParametresAdminApi : parametresAdminApi;
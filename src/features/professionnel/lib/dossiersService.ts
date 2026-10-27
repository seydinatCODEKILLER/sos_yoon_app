import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { dossiersApi, type DossiersApi } from "../api/dossiersApi";
import { mockDossiersApi } from "./mockDossiers";

export const dossiersService: DossiersApi = USE_MOCK_API ? mockDossiersApi : dossiersApi;
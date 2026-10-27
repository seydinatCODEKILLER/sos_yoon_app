import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { sollicitationsApi, type SollicitationsApi } from "../api/sollicitationsApi";
import { mockSollicitationsApi } from "./mockSollicitations";

export const sollicitationsService: SollicitationsApi = USE_MOCK_API
  ? mockSollicitationsApi
  : sollicitationsApi;
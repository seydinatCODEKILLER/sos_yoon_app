import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { dashboardAdminApi, type DashboardAdminApi } from "../api/dashboardAdminApi";
import { mockDashboardAdminApi } from "./mockDashboardAdmin";

export const dashboardAdminService: DashboardAdminApi = USE_MOCK_API
  ? mockDashboardAdminApi
  : dashboardAdminApi;
import { USE_MOCK_API } from "@/shared/lib/featureFlags";
import { dashboardApi, type DashboardApi } from "../api/dashboardApi";
import { mockDashboardApi } from "./mockDashboard";

export const dashboardService: DashboardApi = USE_MOCK_API
  ? mockDashboardApi
  : dashboardApi;
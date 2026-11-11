import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { auditAdminApi } from "../api/auditAdminApi";
import type { ParamsAudit } from "../types/audit.types";

export const AUDIT_ADMIN_KEY = ["admin", "audit"] as const;

export function useAuditAdmin(params: ParamsAudit) {
  return useQuery({
    queryKey: [...AUDIT_ADMIN_KEY, params],
    queryFn: () => auditAdminApi.lister(params),
    placeholderData: keepPreviousData,
  });
}
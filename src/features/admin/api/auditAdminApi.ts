import { apiClient } from "@/shared/lib/apiClient";
import type { PageAudit, ParamsAudit } from "../types/audit.types";

/** Spec 13.34. */
export const auditAdminApi = {
  async lister(p: ParamsAudit): Promise<PageAudit> {
    const { data } = await apiClient.get<PageAudit>("/admin/audit", {
      params: {
        action: p.action === "TOUTES" ? undefined : p.action,
        typeCible: p.typeCible === "TOUS" ? undefined : p.typeCible,
        du: p.du || undefined,
        au: p.au || undefined,
        page: p.page,
        taille: p.taille,
      },
    });
    return data;
  },
};
import type { UserRole } from "@/types/user.types";

export const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Utilisateur",
  PROFESSIONNEL: "Professionnel",
  ADMIN: "Administrateur",
};
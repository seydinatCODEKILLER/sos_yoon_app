import type { UserRole } from "@/types/user.types";

export function getSpaceRoute(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard";
    case "PROFESSIONNEL":
      return "/dashboard";
    case "USER":
    default:
      return "/dashboard";
  }
}

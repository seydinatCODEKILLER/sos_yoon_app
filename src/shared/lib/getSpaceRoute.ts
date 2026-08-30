import type { UserRole } from "@/types/user.types";

export function getSpaceRoute(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PROFESSIONNEL":
      return "/pro";
    case "USER":
    default:
      return "/app";
  }
}
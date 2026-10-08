import type { UserRole } from "@/types/user.types";

export function getSpaceRoute(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "PRO":
      return "/pro";
    case "PARTICULIER":
    default:
      return "/app";
  }
}
import type { Portee, UserRole } from "@/types/user.types";
import { getSpaceRoute } from "./getSpaceRoute";
import type { TokenResponse } from "@/features/auth/types/types";

/** Destination d'une session selon le rôle et la portée du token. */
export function getRouteForSession(role: UserRole, portee: Portee): string {
  switch (portee) {
    case "COMPLET":
      return getSpaceRoute(role);
    case "INSCRIPTION":
      return "/register/professionnel";
    case "DOSSIER":
      return "/pro/dossier";
    case "PAIEMENT":
      return "/pro/abonnement";
    case "AUCUNE":
    default:
      return "/login";
  }
}

/** Utilisé juste après une connexion / vérification OTP. */
export function getPostLoginRoute(response: TokenResponse): string {
  return getRouteForSession(response.utilisateur.role, response.portee);
}
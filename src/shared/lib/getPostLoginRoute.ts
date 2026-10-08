import type { TokenResponse } from "@/features/auth/types/types";
import { getSpaceRoute } from "./getSpaceRoute";

/** La portée décide de l'écran ; le rôle seulement de l'espace. */
export function getPostLoginRoute({ portee, utilisateur }: TokenResponse): string {
  switch (portee) {
    case "COMPLET":
      return getSpaceRoute(utilisateur.role);
    case "INSCRIPTION":
      return "/register/professionnel"; // reprise de l'inscription (à construire)
    case "DOSSIER":
      return "/pro/dossier"; // à créer : « Demande envoyée / non approuvée »
    case "PAIEMENT":
      return "/pro/abonnement"; // à créer
    case "AUCUNE":
      return "/login";
  }
}
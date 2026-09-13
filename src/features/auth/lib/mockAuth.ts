import type { User } from "@/types/user.types";

/**
 * TODO: à supprimer une fois le back-end connecté.
 * Fabrique un utilisateur + des tokens factices pour permettre de tester
 * le parcours complet (OTP → compte → suivi de demande) sans API réelle.
 */
export function createMockParticulierUser(telephone: string): User {
  const now = new Date().toISOString();

  return {
    id: `mock-${Date.now()}`,
    nom: "",
    prenom: "",
    email: "",
    telephone,
    role: "USER",
    isActive: true,
    createdAt: now,
    lastLoginAt: now,
    professionnel: null,
  };
}

export function issueMockTokens() {
  return {
    accessToken: `mock-access-${Date.now()}`,
    refreshToken: `mock-refresh-${Date.now()}`,
  };
}
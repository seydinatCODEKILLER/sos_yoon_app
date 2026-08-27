export type UserRole = "USER" | "PROFESSIONNEL" | "ADMIN";

export type Metier = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

export interface ProfessionnelProfile {
  id: string;
  metier: Metier;
  specialite?: string | null;
  disponible: boolean;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  professionnel?: ProfessionnelProfile | null;
}

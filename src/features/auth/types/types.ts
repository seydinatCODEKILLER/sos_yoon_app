import type { User } from "@/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
}

export interface UpdateProfilePayload {
  nom?: string;
  prenom?: string;
  telephone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Enveloppe générique vue dans vos schémas Swagger (Success + data)
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

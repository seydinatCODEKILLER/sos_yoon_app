import type { User } from "@/types/user.types";

export function getDisplayName(user: User | null): string {
  if (!user) return "Utilisateur";
  const name = [user.prenom, user.nom].filter(Boolean).join(" ");
  return name || user.telephone;
}

export function getInitials(user: User | null): string {
  const initials = `${user?.prenom?.[0] ?? ""}${user?.nom?.[0] ?? ""}`;
  return initials ? initials.toUpperCase() : "?";
}
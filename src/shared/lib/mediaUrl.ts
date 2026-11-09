import { API_CONFIG } from "@/config/api.config";

/**
 * Le backend renvoie parfois une URL relative ("/uploads/photos/ab12-photo.jpg").
 * Dans le navigateur elle serait résolue contre le front (localhost:5173) : image cassée.
 * On la rattache à l'adresse du backend. Une URL absolue (Cloudinary plus tard) passe telle quelle.
 */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  const origin = new URL(String(API_CONFIG.BASE_URL), window.location.origin).origin;
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}
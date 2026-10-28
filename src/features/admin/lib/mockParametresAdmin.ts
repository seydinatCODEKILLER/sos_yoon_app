import type { ApiErreur } from "@/types/api.types";
import type { ParametresAdminApi } from "../api/parametresAdminApi";
import type {
  ChangerMotDePassePayload,
  ProfilAdmin,
  ProfilAdminPayload,
  SessionAdmin,
} from "../types/parametres.types";

const attendre = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const MOT_DE_PASSE_ACTUEL = "Motdepasse1!";

let profil: ProfilAdmin = {
  id: "adm-1",
  prenom: "Amadou",
  nom: "Diallo",
  email: "amadou.diallo@sosyoon.sn",
  telephone: "+221776543210",
  niveau: "SUPER_ADMIN",
  dateAffectation: "2025-01-12",
  photoUrl: null,
  mfaActive: false,
};

const il = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
let sessions: SessionAdmin[] = [
  { id: "ses-1", appareil: "Chrome 128, macOS", adresseIp: "196.115.42.18", dernierAcces: il(2), courante: true },
  { id: "ses-2", appareil: "SOS Yoon Admin App, iPhone 15 Pro", adresseIp: "154.68.89.21", dernierAcces: il(120), courante: false },
  { id: "ses-3", appareil: "Safari 17.5, iPad Air", adresseIp: "197.234.12.9", dernierAcces: il(60 * 24 * 4), courante: false },
];

const erreur = (code: string, message: string): ApiErreur => ({
  code,
  message,
  horodatage: new Date().toISOString(),
});

export const mockParametresAdminApi: ParametresAdminApi = {
  async profil() {
    await attendre(250);
    return profil;
  },
  async modifierProfil(payload: ProfilAdminPayload) {
    await attendre();
    profil = { ...profil, ...payload };
    return profil;
  },
  async sessions() {
    await attendre(250);
    return sessions;
  },
  async deconnecterSession(id: string) {
    await attendre(300);
    const s = sessions.find((x) => x.id === id);
    if (!s) throw erreur("SESSION_INTROUVABLE", "Session introuvable.");
    if (s.courante) throw erreur("SESSION_COURANTE", "Impossible de déconnecter la session en cours.");
    sessions = sessions.filter((x) => x.id !== id);
  },
  async deconnecterAutresSessions() {
    await attendre(300);
    sessions = sessions.filter((x) => x.courante);
  },
  async changerMotDePasse(payload: ChangerMotDePassePayload) {
    await attendre(500);
    if (payload.ancienMotDePasse !== MOT_DE_PASSE_ACTUEL)
      throw erreur("ANCIEN_MOT_DE_PASSE_INCORRECT", "Le mot de passe actuel est incorrect.");
  },
};
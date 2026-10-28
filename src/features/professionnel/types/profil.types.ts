export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

export interface SpecialitePro {
  id: string;
  libelle: string;
  dominante: boolean;
}

export interface ZoneIntervention {
  region: string;
  /** null si la position n'a pas été enregistrée à l'inscription */
  latitude: number | null;
  longitude: number | null;
  rayonKm: number;
}

export interface ProfilPro {
  id: string;
  prenom: string;
  nom: string;
  nomComplet: string;
  titre: string;
  typeProfession: TypeProfession;
  /** null pour un juriste-conseil */
  matricule: string | null;
  adresseCabinet: string | null;
  telephone: string;
  email: string;
  photoUrl: string | null;
  specialites: SpecialitePro[];
  zone: ZoneIntervention | null;
  disponible: boolean;
  statutCompte: string;
  statistiques: {
    noteMoyenne: number;
    nombreAvis: number;
    tauxAcceptation: number;
    delaiMoyenReponseSecondes: number;
  };
}

export interface ProfilPayload {
  prenom: string;
  nom: string;
  telephone: string;
  adresseCabinet: string;
}
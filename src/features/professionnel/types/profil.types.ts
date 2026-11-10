export type TypeProfession = "AVOCAT" | "HUISSIER" | "NOTAIRE" | "JURISTE_CONSEIL";

export interface SpecialitePro {
  id: string;
  libelle: string;
  dominante: boolean;
}

/** L'objet est toujours renvoyé ; ses champs valent null tant qu'ils ne sont pas renseignés */
export interface ZoneIntervention {
  region: string | null;
  /** null si la position n'a pas été enregistrée */
  latitude: number | null;
  longitude: number | null;
  rayonKm: number | null;
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
  /** Souvent relative (/uploads/...) : passer par mediaUrl() pour l'afficher */
  photoUrl: string | null;
  specialites: SpecialitePro[];
  zone: ZoneIntervention | null;
  disponible: boolean;
  statutCompte: string;
  statistiques: {
    /** null tant qu'aucun avis n'a été déposé */
    noteMoyenne: number | null;
    nombreAvis: number;
    tauxAcceptation: number | null;
    delaiMoyenReponseSecondes: number | null;
  };
}

export interface ProfilPayload {
  prenom: string;
  nom: string;
  telephone: string;
  adresseCabinet: string;
}

/** PUT /pro/profil/specialites (spec 11.3) */
export interface SpecialitesPayload {
  specialiteIds: string[];
  specialiteDominanteId: string | null;
}

/** PUT /pro/profil/zone (spec 11.4) : latitude et longitude vont ensemble */
export interface ZonePayload {
  regionId: string;
  rayonKm: number;
  latitude?: number;
  longitude?: number;
}
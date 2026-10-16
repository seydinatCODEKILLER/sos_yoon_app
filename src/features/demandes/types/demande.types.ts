export type TypeSaisie = "TEXTE" | "VOCAL";

export interface MotCleFrequent {
  motCle: string;
  libelle: string;
}

export interface CreerDemandePayload {
  typeSaisie: TypeSaisie;
  /** Obligatoire pour TEXTE, 1 000 caractères max. Omise pour VOCAL. */
  description?: string;
  motsCles: string[];
}

export interface ModifierDemandePayload {
  description?: string;
  motsCles?: string[];
}

export interface EnvoyerAudioPayload {
  fichier: Blob;
  dureeSecondes: number;
}

export interface DemandeAudio {
  url: string;
  dureeSecondes: number;
}

export interface DemandeLocalisation {
  libelle: string;
  rayonKm: number;
  latitudeApprox: number | null;
  longitudeApprox: number | null;
}

/** <DemandeDetail> du document (section 2) */
export interface DemandeDetail {
  id: string;
  reference: string;
  titre: string | null;
  typeSaisie: TypeSaisie;
  description: string | null;
  motsCles: string[];
  audio: DemandeAudio | null;
  transcription: string | null;
  /** BROUILLON, EN_ATTENTE_ACCEPTATION, EN_COURS… (liste complète non fixée par le document) */
  statut: string;
  niveauUrgence: string | null;
  matiere: { id: string; libelle: string } | null;
  metiersRequis: string[];
  localisation: DemandeLocalisation | null;
  dateCreation: string;
  dateEnvoi: string | null;
  professionnel: Record<string, unknown> | null;
  conversationId: string | null;
  compteRenduDisponible: boolean;
  avisDonne: boolean;
}

export interface LocalisationPayload {
  latitude: number | null;   // null si le GPS est refusé
  longitude: number | null;
  libelle: string;
  communeId?: number | null; // obligatoire si latitude/longitude sont null
}

export interface LocalisationResultat {
  libelle: string;
  rayonKm: number;
  secteur: string;
  professionnelsDisponiblesDansZone: boolean;
}

export interface Commune {
  id: number;
  nom: string;
}

export type EtapeSuivi =
  | "ENREGISTREE"
  | "ANALYSEE"
  | "NOTIFIES"
  | "ACCEPTEE"
  /** Délai écoulé sans qu'aucun professionnel n'accepte */
  | "AUCUN_PROFESSIONNEL";

export interface ProfessionnelAccepte {
  id: string;
  /** "Me Mamadou Diallo" */
  nomComplet: string;
  /** "huissier de justice" */
  metier: string;
  /** "Chambre Nationale des Huissiers de Justice" */
  organisme: string;
  verifie: boolean;
  disponibleImmediatement: boolean;
  distanceKm: number;
  /** "Dakar-Plateau" */
  communeLibelle: string;
  delaiContactMinutes: number;
  photoUrl: string | null;
  /** Format international, chiffres seulement : "221771234567" (sert à tel: et wa.me) */
  telephone: string;
    /** "Ordre des Huissiers du Sénégal" ; null si le métier n'a pas d'ordre */
  ordre: string | null;
}

export interface SuiviDemande {
  demandeId: string;
  statut: string;
  etape: EtapeSuivi;
  /** "constat d'huissier" */
  matiereLibelle: string | null;
    /** "huissiers", "avocats"… ; null si plusieurs métiers ou inconnu */
  metierPluriel: string | null;
  nbProfessionnelsNotifies: number;
  /** true quand la recherche s'est étendue aux secteurs mitoyens */
  zoneElargie: boolean;
  dateEnvoi: string;
  dateAcceptation: string | null;
  professionnel: ProfessionnelAccepte | null;
    /** Étapes franchies, avec leur heure (sert au détail de la demande) */
  jalons: JalonDemande[];

    /** Renseigné dès que la recherche a été élargie, sinon null */
  perimetreElargi: PerimetreElargi | null;
  professionnelsContactes: ProfessionnelContacte[];
    /** "SY-00249", sert au message WhatsApp pré-rempli */
  reference: string;
    /** false une fois la recherche déjà élargie au maximum */
  elargissementPossible: boolean;
}

/** Où en est la demande, pour la mini-progression de la liste */
export type PhaseDemande =
  | "ENVOYEE"
  | "PROS_NOTIFIES"
  | "ACCEPTEE"
  | "CONTACT_ETABLI";

/** Statut simplifié pour l'affichage de la liste */
export type StatutListe = "EN_COURS" | "TERMINEE" | "SANS_REPONSE" | "ANNULEE";

export interface DemandeResume {
  id: string;
  reference: string;
  /** "Constat d'huissier" */
  titre: string;
  dateCreation: string;
  statut: StatutListe;
  phase: PhaseDemande;
  /** "Me Mamadou Diallo" une fois un professionnel assigné */
  professionnelNom: string | null;
}

/** Date à laquelle une étape du parcours a été franchie */
export interface JalonDemande {
  phase: PhaseDemande;
  date: string;
}

export interface PerimetreElargi {
  /** "Grand Dakar" */
  zone: string;
  /** ["Médina", "Fann", "Almadies"] */
  secteurs: string[];
}

export interface ProfessionnelContacte {
  id: string;
  /** Nom abrégé par le backend : "Me Birane T." */
  nom: string;
  statut: "NOTIFIE" | "VU";
}
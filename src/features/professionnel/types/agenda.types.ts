export type TypeRendezVous = "CABINET" | "VISIO" | "APPEL" | "AUDIENCE";

export interface RendezVous {
  id: string;
  titre: string;
  type: TypeRendezVous;
  /** ISO 8601 */
  debut: string;
  fin: string;
  lieu: string | null;
  dossierDemandeId: string | null;
  /** Référence du dossier lié, résolue par le serveur */
  dossierReference: string | null;
}

export interface RendezVousPayload {
  titre: string;
  type: TypeRendezVous;
  debut: string;
  fin: string;
  lieu: string | null;
  dossierDemandeId: string | null;
}
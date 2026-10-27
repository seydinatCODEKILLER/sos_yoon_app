import type { AgendaApi } from "../api/agendaApi";
import type { RendezVous } from "../types/agenda.types";
import { ajouterJours, cleJour, lundiDe, versIso } from "./agenda";

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const lundi = lundiDe(new Date());
/** décalage en jours depuis le lundi de la semaine en cours */
const au = (decalage: number, hhmm: string) =>
  versIso(cleJour(ajouterJours(lundi, decalage)), hhmm);

let rendezVous: RendezVous[] = [
  {
    id: "r1",
    titre: "Audience : conseil d'actionnaires",
    type: "AUDIENCE",
    debut: au(3, "09:00"),
    fin: au(3, "11:30"),
    lieu: "Tribunal de Grande Instance de Dakar",
    dossierDemandeId: "dos2",
    dossierReference: "SY-00235",
  },
  {
    id: "r2",
    titre: "Appel : litige sur bail",
    type: "APPEL",
    debut: au(3, "10:00"),
    fin: au(3, "10:30"),
    lieu: null,
    dossierDemandeId: "dos3",
    dossierReference: "SY-00230",
  },
  {
    id: "r3",
    titre: "RDV cabinet : clôture du dossier",
    type: "CABINET",
    debut: au(1, "14:00"),
    fin: au(1, "15:00"),
    lieu: "Cabinet, Plateau",
    dossierDemandeId: "dos4",
    dossierReference: "SY-00225",
  },
  {
    id: "r4",
    titre: "Entretien de cadrage succession",
    type: "VISIO",
    debut: au(2, "15:30"),
    fin: au(2, "16:15"),
    lieu: "Lien visio SOS Yoon",
    dossierDemandeId: "dos1",
    dossierReference: "SY-00240",
  },
];

const REFERENCES_DOSSIERS: Record<string, string> = {
  dos1: "SY-00240",
  dos2: "SY-00235",
  dos3: "SY-00230",
  dos4: "SY-00225",
};

function referenceDe(demandeId: string | null) {
  if (!demandeId) return null;
  return REFERENCES_DOSSIERS[demandeId] ?? null;
}

export const mockAgendaApi: AgendaApi = {
  async lister(debut, fin) {
    await wait();
    return rendezVous
      .filter((r) => {
        const jour = cleJour(new Date(r.debut));
        return jour >= debut && jour <= fin;
      })
      .sort((a, b) => a.debut.localeCompare(b.debut));
  },

  async creer(payload) {
    await wait();
    const r: RendezVous = {
      ...payload,
      id: crypto.randomUUID(),
      dossierReference: referenceDe(payload.dossierDemandeId),
    };
    rendezVous = [...rendezVous, r];
    return r;
  },

  async modifier(id, payload) {
    await wait();
    const r: RendezVous = {
      ...payload,
      id,
      dossierReference: referenceDe(payload.dossierDemandeId),
    };
    rendezVous = rendezVous.map((x) => (x.id === id ? r : x));
    return r;
  },

  async supprimer(id) {
    await wait();
    rendezVous = rendezVous.filter((x) => x.id !== id);
  },
};
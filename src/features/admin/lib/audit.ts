import type { TonStatut } from "./demande";
import type { EntreeAudit } from "../types/audit.types";

export const ACTIONS_AUDIT: Record<string, { libelle: string; ton: TonStatut }> = {
  APPROBATION_PRO: { libelle: "Dossier approuvé", ton: "fin" },
  REJET_PRO: { libelle: "Dossier refusé", ton: "refus" },
  DESACTIVATION_USER: { libelle: "Compte citoyen désactivé", ton: "refus" },
  REACTIVATION_USER: { libelle: "Compte citoyen réactivé", ton: "fin" },
  DESACTIVATION_PRO: { libelle: "Compte professionnel désactivé", ton: "refus" },
  REACTIVATION_PRO: { libelle: "Compte professionnel réactivé", ton: "fin" },
  CONSULTATION_DOCUMENT: { libelle: "Document consulté", ton: "neutre" },
  ENREGISTREMENT_PAIEMENT: { libelle: "Paiement enregistré", ton: "cours" },
  MODIFICATION_PARAMETRE: { libelle: "Paramètre modifié", ton: "recherche" },
  ANNULATION_DEMANDE: { libelle: "Demande annulée", ton: "refus" },
  REAFFECTATION_DEMANDE: { libelle: "Demande réaffectée", ton: "cours" },
  QUALIFICATION_DEMANDE: { libelle: "Demande qualifiée", ton: "cours" },
  REVOQUATION_SESSION: { libelle: "Sessions révoquées", ton: "recherche" },
  CONNEXION_ADMIN: { libelle: "Connexion administrateur", ton: "neutre" },
};

export function infoActionAudit(action: string | null): { libelle: string; ton: TonStatut } {
  if (action && action in ACTIONS_AUDIT) return ACTIONS_AUDIT[action];
  return { libelle: action ? humaniser(action) : "Action inconnue", ton: "neutre" };
}

function humaniser(code: string): string {
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Valeurs de `typeCible` envoyées par le backend, avec leur libellé pour le filtre. */
export const TYPES_CIBLE: { value: string; label: string }[] = [
  { value: "TOUS", label: "Toutes les cibles" },
  { value: "UTILISATEUR", label: "Citoyen" },
  { value: "PROFESSIONNEL", label: "Professionnel" },
  { value: "DOSSIER", label: "Dossier d'inscription" },
  { value: "DOCUMENT", label: "Document" },
  { value: "DEMANDE", label: "Demande" },
  { value: "SESSION", label: "Session" },
  { value: "PARAMETRE", label: "Paramètre" },
];

export const ITEMS_ACTION: { value: string; label: string }[] = [
  { value: "TOUTES", label: "Toutes les actions" },
  ...Object.entries(ACTIONS_AUDIT).map(([value, { libelle }]) => ({ value, label: libelle })),
];

/** La connexion d'un administrateur vise son propre compte : ce n'est pas un citoyen. */
export function libelleTypeCible(e: Pick<EntreeAudit, "action" | "typeCible">): string {
  if (e.action === "CONNEXION_ADMIN") return "Administrateur";
  const t = TYPES_CIBLE.find((x) => x.value === e.typeCible);
  return t && t.value !== "TOUS" ? t.label : (e.typeCible ?? "—");
}

/** Texte principal de la colonne « Cible » : le nom si le serveur l'a trouvé, sinon l'identifiant. */
export function libelleCible(e: EntreeAudit): string {
  if (e.cibleLibelle) return e.cibleLibelle;
  if (e.typeCible === "PARAMETRE" && e.cibleId) return e.cibleId;
  return e.cibleId ? `n° ${e.cibleId.length > 12 ? e.cibleId.slice(0, 8) + "…" : e.cibleId}` : "—";
}

/** Écran admin de la cible quand il existe (sinon null). */
export function lienCible(e: EntreeAudit): string | null {
  if (!e.cibleId) return null;
  switch (e.typeCible) {
    case "PROFESSIONNEL":
      return `/admin/professionnels/${e.cibleId}`;
    case "DEMANDE":
      return `/admin/demandes/${e.cibleId}`;
    case "UTILISATEUR":
      return e.action === "CONNEXION_ADMIN" ? null : `/admin/utilisateurs/${e.cibleId}`;
    default:
      return null;
  }
}
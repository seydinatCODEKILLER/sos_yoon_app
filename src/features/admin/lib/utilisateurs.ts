import type { CibleUtilisateur, UtilisateurAdmin } from "../types/utilisateurs.types";
import { formaterDateHeure } from "./demande";

/** Famille d'un compte : ce qui décide de l'action proposée et de la couleur du badge. */
export type EtatCompte = "ACTIF" | "DESACTIVE" | "AUTRE";

export interface InfoCompte {
  etat: EtatCompte;
  libelle: string;
}

function humaniser(code: string): string {
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/**
 * Le backend range tout compte non suspendu parmi les « actifs » (filtre et compteurs). On fait
 * pareil : seuls SUSPENDU_ADMIN et CLOTURE sont affichés comme désactivés, une valeur inconnue
 * s'affiche telle quelle sans bloquer l'écran.
 */
export function infoCompte(statut: string | null | undefined): InfoCompte {
  const s = (statut ?? "").toUpperCase();
  if (s === "" || s === "ACTIF") return { etat: "ACTIF", libelle: "Actif" };
  if (s === "SUSPENDU_ADMIN") return { etat: "DESACTIVE", libelle: "Désactivé" };
  if (s === "CLOTURE") return { etat: "DESACTIVE", libelle: "Clôturé" };
  return { etat: "AUTRE", libelle: humaniser(s) };
}

export function estDesactive(statut: string | null | undefined): boolean {
  return infoCompte(statut).etat === "DESACTIVE";
}

/** Le backend ne réactive que ce qu'il a lui-même suspendu : un compte clôturé reste clôturé. */
export function peutReactiver(statut: string | null | undefined): boolean {
  return (statut ?? "").toUpperCase() === "SUSPENDU_ADMIN";
}

export function peutDesactiver(statut: string | null | undefined): boolean {
  return !estDesactive(statut);
}

export function nomUtilisateur(u: { prenom: string | null; nom: string | null }): string {
  return [u.prenom, u.nom].filter(Boolean).join(" ").trim() || "Citoyen sans nom";
}

/** Ce que le dialogue de changement de statut doit savoir d'une ligne de la liste. */
export function cibleDe(u: UtilisateurAdmin): CibleUtilisateur {
  return {
    id: u.id,
    nomComplet: nomUtilisateur(u),
    telephone: u.telephone,
    desactive: !peutDesactiver(u.statutCompte),
  };
}

/** 14 sept. 2026 */
export function formaterDateInscription(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export { formaterDateHeure };

/** Seuil à partir duquel le nombre de demandes est mis en avant. */
export const SEUIL_DEMANDES_ELEVE = 5;

export const LIBELLE_DEMANDES = (n: number) => (n === 0 ? "0 demande" : `${n} demande${n > 1 ? "s" : ""}`);

export const FILTRES_HISTORIQUE = [
  { value: "TOUTES", label: "Toutes" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEES", label: "Terminées" },
  { value: "ANNULEES_EXPIREES", label: "Annulées" },
] as const;
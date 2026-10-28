import { useState } from "react";
import { CircleAlert, CircleCheck, CreditCard, Gift } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAbonnementDetail, usePaiements } from "../hooks/useAbonnement";
import {
  LIBELLE_MOYEN,
  PLANS,
  formaterDateIso,
  formaterFcfa,
} from "../lib/abonnement";
import { DUREE_ESSAI_JOURS } from "../lib/formatDashboard";
import { DialogPaiement } from "./DialogPaiement";

const carte = "rounded-xl border border-ink/10 bg-white p-5";

export function PanneauAbonnement() {
  const { data: abo, isError } = useAbonnementDetail();
  const { data: paiements } = usePaiements();
  const [paiementOuvert, setPaiementOuvert] = useState(false);

  if (isError) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        Impossible de charger votre abonnement. Réessayez dans un instant.
      </p>
    );
  }
  if (!abo) return <div className="h-64 animate-pulse rounded-xl bg-ink/5" />;

  const progression =
    abo.statut === "ESSAI"
      ? Math.min(100, Math.round(((DUREE_ESSAI_JOURS - abo.joursRestants) / DUREE_ESSAI_JOURS) * 100))
      : 0;

  const etat =
    abo.statut === "ESSAI"
      ? {
          Icone: Gift,
          classe: "border-signal/30 bg-signal/5",
          iconeClasse: "text-signal",
          titre: `Essai gratuit : ${abo.joursRestants} jour${abo.joursRestants > 1 ? "s" : ""} restant${abo.joursRestants > 1 ? "s" : ""}`,
          texte: `Votre essai se termine le ${formaterDateIso(abo.finEssai)}. Ensuite, l'abonnement est de ${formaterFcfa(abo.montantMensuel)} par mois.`,
        }
      : abo.statut === "ACTIF"
        ? {
            Icone: CircleCheck,
            classe: "border-emerald-200 bg-emerald-50",
            iconeClasse: "text-emerald-600",
            titre: "Abonnement actif",
            texte: abo.finPeriode
              ? `Valable jusqu'au ${formaterDateIso(abo.finPeriode)} (${abo.joursRestants} jour${abo.joursRestants > 1 ? "s" : ""}).`
              : "Votre abonnement est en cours.",
          }
        : {
            Icone: CircleAlert,
            classe: "border-red-200 bg-red-50",
            iconeClasse: "text-red-600",
            titre: "Compte suspendu",
            texte: "Votre abonnement a expiré. Réglez-le pour retrouver l'accès à vos demandes et dossiers.",
          };

  return (
    <div className="space-y-5">
      <section className={`flex gap-3 rounded-xl border p-4 ${etat.classe}`}>
        <etat.Icone className={`mt-0.5 size-5 shrink-0 ${etat.iconeClasse}`} aria-hidden />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="font-bold text-ink">{etat.titre}</p>
            <p className="text-sm text-ink/70">{etat.texte}</p>
          </div>
          {abo.statut === "ESSAI" && (
            <div
              role="progressbar"
              aria-valuenow={progression}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression de l'essai gratuit"
              className="h-2 overflow-hidden rounded-full bg-white"
            >
              <div className="h-full rounded-full bg-signal" style={{ width: `${progression}%` }} />
            </div>
          )}
        </div>
      </section>

      <section className={`${carte} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wide text-ink/50 uppercase">Votre plan</p>
          <p className="text-3xl font-bold text-ink">
            {formaterFcfa(abo.montantMensuel)}
            <span className="text-sm font-medium text-ink/55"> / mois</span>
          </p>
          <p className="text-xs text-ink/55">
            Accès aux demandes, dossiers, agenda et notifications. Sans engagement.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setPaiementOuvert(true)}
          className="h-11 gap-2 rounded-xl bg-signal px-5 font-semibold text-white hover:bg-signal/90"
        >
          <CreditCard className="size-4" aria-hidden />
          {abo.suspendu ? "Payer et réactiver mon compte" : "Payer mon abonnement"}
        </Button>
      </section>

      <section className={`${carte} space-y-3`}>
        <h3 className="text-base font-bold text-ink">Tarifs par métier</h3>
        <ul className="divide-y divide-ink/10">
          {PLANS.map((p) => {
            const courant = p.metiers.includes(abo.typeProfession);
            return (
              <li key={p.libelle} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-ink">
                  {p.libelle}
                  {courant && (
                    <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-bold text-signal uppercase">
                      Votre plan
                    </span>
                  )}
                </span>
                <span className="text-sm font-semibold text-ink">{formaterFcfa(p.montant)} / mois</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${carte} space-y-3`}>
        <h3 className="text-base font-bold text-ink">Historique des paiements</h3>
        {!paiements ? (
          <div className="h-12 animate-pulse rounded-lg bg-ink/5" />
        ) : paiements.contenu.length === 0 ? (
          <p className="text-sm text-ink/55">Aucun paiement pour le moment.</p>
        ) : (
          <ul className="divide-y divide-ink/10">
            {paiements.contenu.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{formaterFcfa(p.montant)}</p>
                  <p className="truncate text-xs text-ink/55">
                    {LIBELLE_MOYEN[p.moyenPaiement]} · {formaterDateIso(p.datePaiement)} · du{" "}
                    {formaterDateIso(p.periodeDebut)} au {formaterDateIso(p.periodeFin)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    p.statut === "REUSSI"
                      ? "bg-emerald-100 text-emerald-700"
                      : p.statut === "ECHEC"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {p.statut === "REUSSI" ? "Réussi" : p.statut === "ECHEC" ? "Échec" : "En attente"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DialogPaiement
        ouvert={paiementOuvert}
        montant={abo.montantMensuel}
        onFermer={() => setPaiementOuvert(false)}
      />
    </div>
  );
}
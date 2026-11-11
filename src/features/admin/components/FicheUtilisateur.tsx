import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { toast } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/utils";
import { useDemandesUtilisateur, useDetailUtilisateur, useRevoquerSessions } from "../hooks/useUtilisateursAdmin";
import { messageAdmin } from "../lib/erreursAdmin";
import { formaterDuree } from "../lib/demande";
import {
  FILTRES_HISTORIQUE,
  LIBELLE_DEMANDES,
  formaterDateHeure,
  formaterDateInscription,
  nomUtilisateur,
  peutDesactiver,
  peutReactiver,
} from "../lib/utilisateurs";
import type {
  CibleUtilisateur,
  DemandeUtilisateur,
  FiltreDemandesUtilisateur,
} from "../types/utilisateurs.types";
import { BadgeStatutDemande } from "./ElementsDemande";
import { AvatarUtilisateur, BadgeStatutCompte } from "./ElementsUtilisateur";

interface Props {
  id: string | undefined;
  onFermer: () => void;
  onChangerStatut: (c: CibleUtilisateur) => void;
}

function Section({ titre, droite, children }: { titre: string; droite?: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">{titre}</h3>
        {droite && <span className="text-xs text-muted-foreground">{droite}</span>}
      </div>
      {children}
    </section>
  );
}

function Ligne({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 wrap-break-word text-right font-medium">{children}</span>
    </div>
  );
}

/** Mention de l'issue d'une demande quand elle n'a pas abouti ou n'a pas encore de professionnel. */
function detailDemande(d: DemandeUtilisateur): string | null {
  if (d.statut === "ANNULEE") {
    const par = d.annuleePar ? ` par ${d.annuleePar.toLowerCase()}` : "";
    const motif = d.motifAnnulation ? ` : ${d.motifAnnulation}` : "";
    const attente =
      d.attenteAvantAnnulationMinutes != null ? ` (après ${formaterDuree(d.attenteAvantAnnulationMinutes * 60)})` : "";
    return `Annulée${par}${motif}${attente}`;
  }
  if (d.professionnel) {
    const delai =
      d.priseEnChargeMinutes != null ? ` · prise en charge en ${formaterDuree(d.priseEnChargeMinutes * 60)}` : "";
    return `${d.professionnel}${delai}`;
  }
  return null;
}

function HistoriqueDemandes({ id }: { id: string }) {
  const [filtre, setFiltre] = useState<FiltreDemandesUtilisateur>("TOUTES");
  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useDemandesUtilisateur(id, filtre);
  const demandes = data?.pages.flatMap((p) => p.contenu) ?? [];
  const total = data?.pages[0]?.totalElements ?? 0;

  return (
    <Section titre="Historique des demandes" droite={data ? LIBELLE_DEMANDES(total) : undefined}>
      <div role="group" aria-label="Filtrer les demandes" className="flex flex-wrap gap-1.5">
        {FILTRES_HISTORIQUE.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filtre === f.value}
            onClick={() => setFiltre(f.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-signal/50",
              filtre === f.value
                ? "border-signal/40 bg-signal/10 text-signal"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : isError ? (
        <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          Impossible de charger les demandes.{" "}
          <button type="button" onClick={() => refetch()} className="font-medium text-signal underline">
            Réessayer
          </button>
        </p>
      ) : demandes.length === 0 ? (
        <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
          {filtre === "TOUTES" ? "Ce citoyen n'a pas encore déposé de demande." : "Aucune demande dans cette catégorie."}
        </p>
      ) : (
        <ul className="space-y-2">
          {demandes.map((d) => {
            const detail = detailDemande(d);
            return (
              <li key={d.id}>
                <Link
                  to={`/admin/demandes/${d.id}`}
                  className="group flex items-start gap-3 rounded-xl bg-muted/60 p-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-signal/50"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-semibold tabular-nums">{d.reference ?? "Sans référence"}</span>
                      <BadgeStatutDemande statut={d.statut} />
                    </div>
                    <p className="line-clamp-2 text-[13px] text-foreground/80">
                      {d.titre || d.extrait || "Aucun descriptif"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formaterDateHeure(d.dateCreation)}
                      {detail && <> · {detail}</>}
                    </p>
                  </div>
                  <ChevronRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Chargement…" : "Voir plus de demandes"}
        </Button>
      )}
    </Section>
  );
}

export function FicheUtilisateur({ id, onFermer, onChangerStatut }: Props) {
  const { data, isLoading, isError } = useDetailUtilisateur(id);
  const revoquer = useRevoquerSessions();
  const [confirmation, setConfirmation] = useState(false);

  const nom = data ? nomUtilisateur(data) : "";
  const desactivable = data ? peutDesactiver(data.statutCompte) : false;
  const reactivable = data ? peutReactiver(data.statutCompte) : false;

  function fermer() {
    setConfirmation(false);
    revoquer.reset();
    onFermer();
  }

  function deconnecter() {
    if (!id) return;
    revoquer.mutate(id, {
      onSuccess: () => {
        toast.success("Sessions révoquées", `${nom} est déconnecté de tous ses appareils.`);
        setConfirmation(false);
      },
      // Erreur affichée plus bas : on revient au choix pour pouvoir réessayer.
      onError: () => setConfirmation(false),
    });
  }

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && fermer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="flex-row items-center gap-4 border-b border-border p-6 pr-12 text-left">
          {data ? (
            <>
              <AvatarUtilisateur nomComplet={nom} statut={data.statutCompte} className="size-14 text-base" />
              <div className="min-w-0 space-y-1.5">
                <SheetTitle className="truncate text-lg">{nom}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2 text-sm">
                  Citoyen
                  <BadgeStatutCompte statut={data.statutCompte} />
                </SheetDescription>
              </div>
            </>
          ) : (
            <>
              <SheetTitle className="sr-only">Fiche du citoyen</SheetTitle>
              <SheetDescription className="sr-only">Chargement de la fiche</SheetDescription>
              <div className="h-12 w-48 animate-pulse rounded-lg bg-muted" />
            </>
          )}
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto p-6">
          {isLoading && <div className="h-40 animate-pulse rounded-xl bg-muted" />}
          {isError && <p className="text-sm text-destructive">Impossible de charger la fiche.</p>}

          {data && (
            <>
              {data.desactivation && !desactivable && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm dark:border-rose-500/20 dark:bg-rose-500/10">
                  <p className="font-semibold text-rose-700 dark:text-rose-400">
                    Compte désactivé{data.desactivation.date ? ` le ${formaterDateHeure(data.desactivation.date)}` : ""}
                  </p>
                  {data.desactivation.motif && (
                    <p className="mt-1 text-foreground/80">Motif : {data.desactivation.motif}</p>
                  )}
                  {data.desactivation.observations && (
                    <p className="mt-1 text-foreground/80">{data.desactivation.observations}</p>
                  )}
                </div>
              )}

              <Section titre="Coordonnées et activité">
                <div>
                  <Ligne label="Téléphone">
                    <span className="inline-flex flex-wrap items-center justify-end gap-1.5">
                      <span className="tabular-nums">{data.telephone ?? "—"}</span>
                      {data.telephone &&
                        (data.telephoneVerifie ? (
                          <BadgeCheck className="size-4 text-emerald-500" aria-label="Téléphone vérifié" />
                        ) : (
                          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                            Non vérifié
                          </span>
                        ))}
                    </span>
                  </Ligne>
                  <Ligne label="E-mail">{data.email ?? "—"}</Ligne>
                  <Ligne label="Inscrit le">{formaterDateInscription(data.dateInscription)}</Ligne>
                  <Ligne label="Dernière connexion">
                    {data.derniereConnexion ? formaterDateHeure(data.derniereConnexion) : "Jamais connecté"}
                  </Ligne>
                </div>
              </Section>

              <HistoriqueDemandes id={data.id} />
            </>
          )}
        </div>

        {data && (desactivable || reactivable) && (
          <SheetFooter className="m-0 flex-col items-stretch gap-2 border-t border-border bg-muted/40 px-6 py-4">
            {revoquer.error && (
              <p role="alert" className="text-sm text-destructive">
                {messageAdmin(revoquer.error, "Impossible de révoquer les sessions.")}
              </p>
            )}

            {confirmation ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="mr-auto text-sm">Déconnecter {nom} de tous ses appareils ?</span>
                <Button variant="ghost" disabled={revoquer.isPending} onClick={() => setConfirmation(false)}>
                  Annuler
                </Button>
                <Button disabled={revoquer.isPending} onClick={deconnecter}>
                  {revoquer.isPending ? "En cours…" : "Déconnecter"}
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {desactivable && (
                  <Button
                    variant="ghost"
                    className="mr-auto gap-1.5"
                    onClick={() => {
                      revoquer.reset();
                      setConfirmation(true);
                    }}
                  >
                    <LogOut className="size-4" aria-hidden /> Révoquer les sessions
                  </Button>
                )}
                <Button
                  variant={desactivable ? "outline" : "default"}
                  className={cn(desactivable && "text-destructive hover:text-destructive")}
                  onClick={() =>
                    onChangerStatut({
                      id: data.id,
                      nomComplet: nom,
                      telephone: data.telephone,
                      desactive: !desactivable,
                    })
                  }
                >
                  {desactivable ? "Désactiver le compte" : "Réactiver le compte"}
                </Button>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
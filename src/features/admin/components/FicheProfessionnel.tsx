import { useState, type ReactNode } from "react";
import { Banknote, BadgeCheck, Download, Eye, FileText, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import { cn } from "@/shared/lib/utils";
import { professionnelsAdminApi } from "../api/professionnelsAdminApi";
import { useApprouverDossier, useDetailProfessionnel } from "../hooks/useProfessionnelsAdmin";
import { formaterMontant } from "../lib/abonnements";
import { messageAdmin } from "../lib/erreursAdmin";
import {
  LIBELLE_DOCUMENT,
  METIERS_PRO,
  formaterDate,
  formaterTaille,
  statutAffichage,
} from "../lib/professionnels";
import type { CiblePro, CibleRefus, DocumentDossier } from "../types/professionnels.types";
import { AvatarPro, BadgeStatutPro } from "./ElementsProfessionnel";
import type { CiblePaiement } from "../types/abonnements.types";

interface Props {
  id: string | undefined;
  onFermer: () => void;
  onChangerStatut: (c: CiblePro) => void;
  onRefuser: (c: CibleRefus) => void;
  onPaiement: (c: CiblePaiement) => void;
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

const LIBELLE_ABONNEMENT: Record<string, string> = {
  ESSAI: "Période d'essai",
  ACTIF: "Abonnement actif",
  EXPIRE: "Expiré",
  SUSPENDU: "Suspendu",
};

export function FicheProfessionnel({ id, onFermer, onChangerStatut, onRefuser, onPaiement }: Props) {
  const { data, isLoading, isError } = useDetailProfessionnel(id);
  const approuver = useApprouverDossier();
  const [confirmation, setConfirmation] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [ouverture, setOuverture] = useState<string | null>(null);

  async function acces(doc: DocumentDossier, telecharger: boolean) {
    if (!id) return;
    setInfo(null);
    setOuverture(doc.id);
    try {
      // Lien signé valable ~1 h, généré (et tracé dans l'audit) uniquement au clic.
      const fichier = await professionnelsAdminApi.lienDocument(id, doc.id);
      const lien = mediaUrl(fichier.url);
      if (!lien) {
        setInfo("Ce document n'est pas disponible.");
        return;
      }
      const a = document.createElement("a");
      a.href = lien;
      a.target = "_blank";
      a.rel = "noopener";
      if (telecharger) a.download = fichier.nom || doc.nomFichier;
      a.click();
    } catch (e) {
      setInfo(messageAdmin(e, "Impossible d'ouvrir le document."));
    } finally {
      setOuverture(null);
    }
  }

  const nomComplet = data ? [data.prenom, data.nom].filter(Boolean).join(" ") || "Professionnel" : "";
  const dossier = data?.dossierInscription ?? null;
  const etat = data ? statutAffichage({ statutCompte: data.statutCompte, statutDossier: dossier?.statut ?? null }) : null;
  const documents = dossier?.documents ?? [];
  const abo = data?.abonnement ?? null;

  function fermer() {
    setConfirmation(false);
    setInfo(null);
    approuver.reset();
    onFermer();
  }

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && fermer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="flex-row items-center gap-4 border-b border-border p-6 pr-12 text-left">
          {data && etat ? (
            <>
              <AvatarPro nomComplet={nomComplet} etat={etat} photoUrl={data.photoUrl} className="size-14 text-base" />
              <div className="min-w-0 space-y-1.5">
                <SheetTitle className="truncate text-lg">{nomComplet}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2 text-sm">
                  {METIERS_PRO[data.typeProfession].libelle}
                  <BadgeStatutPro etat={etat} />
                </SheetDescription>
              </div>
            </>
          ) : (
            <>
              <SheetTitle className="sr-only">Fiche du professionnel</SheetTitle>
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
              <Section titre="Coordonnées et vérification">
                <div>
                  <Ligne label="Téléphone">{data.telephone}</Ligne>
                  <Ligne label="E-mail">
                    <span className="inline-flex flex-wrap items-center justify-end gap-1.5">
                      {data.email ?? "—"}
                      {data.email &&
                        (data.emailVerifie ? (
                          <BadgeCheck className="size-4 text-emerald-500" aria-label="E-mail vérifié" />
                        ) : (
                          <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                            Non vérifié
                          </span>
                        ))}
                    </span>
                  </Ligne>
                  {data.matricule && <Ligne label="Matricule">{data.matricule}</Ligne>}
                  {data.organisme && <Ligne label="Organisme">{data.organisme}</Ligne>}
                  {dossier && (
                    <>
                      <Ligne label="Dossier soumis le">{formaterDate(dossier.dateSoumission)}</Ligne>
                      <Ligne label="Référence du dossier">{dossier.reference}</Ligne>
                      {(dossier.nombreSoumissions ?? 0) > 1 && (
                        <Ligne label="Nombre de soumissions">{dossier.nombreSoumissions}</Ligne>
                      )}
                    </>
                  )}
                </div>
              </Section>

              <Section titre="Activité professionnelle">
                <div>
                  <Ligne label="Profession">{METIERS_PRO[data.typeProfession].libelle}</Ligne>
                  {data.nomCabinet && <Ligne label="Cabinet">{data.nomCabinet}</Ligne>}
                  <Ligne label="Spécialités">
                    {data.specialites.length > 0 ? data.specialites.map((s) => s.libelle).join(", ") : "—"}
                  </Ligne>
                  <Ligne label="Zone d'intervention">{data.zone ?? "—"}</Ligne>
                  {data.typeProfession === "JURISTE_CONSEIL" && dossier && (
                    <Ligne label="Déclaration sur l'honneur">
                      {dossier.declarationHonneurAcceptee
                        ? `Acceptée${dossier.dateDeclarationHonneur ? ` le ${formaterDate(dossier.dateDeclarationHonneur)}` : ""}`
                        : "Non acceptée"}
                    </Ligne>
                  )}
                </div>
              </Section>

              {abo && (
                <Section titre="Abonnement">
                  <div>
                    <Ligne label="Statut">{LIBELLE_ABONNEMENT[abo.statut] ?? abo.statut}</Ligne>
                    {abo.finEssai && <Ligne label="Fin de l'essai">{formaterDate(abo.finEssai)}</Ligne>}
                    {abo.finPeriode && <Ligne label="Fin de la période">{formaterDate(abo.finPeriode)}</Ligne>}
                    {abo.joursRestants != null && (
                      <Ligne label="Jours restants">{Math.max(0, abo.joursRestants)}</Ligne>
                    )}
                    {abo.montantMensuel != null && (
                      <Ligne label="Mensualité">{formaterMontant(abo.montantMensuel)}</Ligne>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full gap-1.5"
                    onClick={() =>
                      onPaiement({
                        professionnelId: data.id,
                        nomComplet,
                        montantMensuel: abo.montantMensuel ?? null,
                        echeance: abo.statut === "ESSAI" ? abo.finEssai : (abo.finPeriode ?? abo.finEssai),
                        statutCompte: data.statutCompte,
                      })
                    }
                  >
                    <Banknote className="size-4" aria-hidden /> Enregistrer un paiement
                  </Button>
                </Section>
              )}

              <Section
                titre="Pièces fournies"
                droite={`${documents.length} fichier${documents.length > 1 ? "s" : ""}`}
              >
                {!dossier ? (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    Ce professionnel n'a pas encore soumis de dossier d'inscription.
                  </p>
                ) : documents.length === 0 ? (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">Aucune pièce jointe.</p>
                ) : (
                  <ul className="space-y-2">
                    {documents.map((d) => {
                      const enCours = ouverture === d.id;
                      return (
                        <li key={d.id} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                          <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{LIBELLE_DOCUMENT[d.type] ?? d.type}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {d.nomFichier} · {formaterTaille(d.tailleOctets)}
                              {d.statut === "REJETE" && <span className="text-rose-600"> · Refusée</span>}
                            </p>
                          </div>
                          {enCours ? (
                            <Loader2 className="mx-2 size-4 animate-spin text-muted-foreground" aria-label="Ouverture…" />
                          ) : (
                            <>
                              <button
                                type="button"
                                aria-label={`Voir ${LIBELLE_DOCUMENT[d.type] ?? d.type}`}
                                onClick={() => acces(d, false)}
                                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-card focus-visible:ring-2 focus-visible:ring-signal/50"
                              >
                                <Eye className="size-4" aria-hidden />
                              </button>
                              <button
                                type="button"
                                aria-label={`Télécharger ${LIBELLE_DOCUMENT[d.type] ?? d.type}`}
                                onClick={() => acces(d, true)}
                                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-card focus-visible:ring-2 focus-visible:ring-signal/50"
                              >
                                <Download className="size-4" aria-hidden />
                              </button>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {info && (
                  <p role="alert" className="text-xs text-destructive">
                    {info}
                  </p>
                )}
              </Section>
            </>
          )}
        </div>

        {data && etat && (
          <SheetFooter className="m-0 flex-col items-stretch gap-2 border-t border-border bg-muted/40 px-6 py-4">
            {approuver.error && (
              <p role="alert" className="text-sm text-destructive">
                {messageAdmin(approuver.error, "Impossible d'approuver ce dossier.")}
              </p>
            )}

            {etat === "EN_ATTENTE" && dossier && !confirmation && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {!data.emailVerifie && (
                  <span className="mr-auto text-xs text-amber-700 dark:text-amber-400">
                    E-mail non confirmé : l'approbation est impossible.
                  </span>
                )}
                <Button
                  variant="outline"
                  onClick={() => onRefuser({ dossierId: dossier.id, nomComplet, documents })}
                >
                  Refuser
                </Button>
                <Button disabled={!data.emailVerifie} onClick={() => setConfirmation(true)}>
                  Accepter l'inscription
                </Button>
              </div>
            )}

            {etat === "EN_ATTENTE" && dossier && confirmation && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="mr-auto text-sm">Valider ce dossier et démarrer l'essai gratuit ?</span>
                <Button variant="ghost" disabled={approuver.isPending} onClick={() => setConfirmation(false)}>
                  Annuler
                </Button>
                <Button
                  disabled={approuver.isPending}
                  onClick={() =>
                    approuver.mutate(dossier.id, {
                      onSuccess: () => setConfirmation(false),
                      // Erreur affichée ci-dessus : on revient au choix pour pouvoir réessayer.
                      onError: () => setConfirmation(false),
                    })
                  }
                >
                  {approuver.isPending ? "En cours…" : "Confirmer"}
                </Button>
              </div>
            )}

            {(etat === "VALIDE" || etat === "SUSPENDU") && (
              <div className="flex justify-end">
                <Button
                  variant={etat === "VALIDE" ? "outline" : "default"}
                  className={cn(etat === "VALIDE" && "text-destructive hover:text-destructive")}
                  onClick={() =>
                    onChangerStatut({ id: data.id, nomComplet, email: data.email, suspendu: etat === "SUSPENDU" })
                  }
                >
                  {etat === "VALIDE" ? "Désactiver le compte" : "Réactiver le compte"}
                </Button>
              </div>
            )}

            {etat === "REFUSE" && (
              <p className="text-right text-xs text-muted-foreground">
                Dossier refusé : en attente d'une nouvelle soumission du professionnel.
              </p>
            )}
            {etat === "INCOMPLET" && (
              <p className="text-right text-xs text-muted-foreground">
                Inscription non terminée : aucune action possible tant que le dossier n'est pas soumis.
              </p>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
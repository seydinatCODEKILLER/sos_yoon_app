import { useState, type ReactNode } from "react";
import { BadgeCheck, Download, Eye, FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { cn } from "@/shared/lib/utils";
import { useApprouverDossier, useDetailProfessionnel } from "../hooks/useProfessionnelsAdmin";
import { initiales } from "../lib/formatAdmin";
import { professionnelsAdminService } from "../lib/professionnelsAdminService";
import {
  COULEUR_STATUT,
  LIBELLE_DOCUMENT,
  LIBELLE_STATUT,
  METIERS_PRO,
  formaterDate,
  formaterTaille,
  statutAffichage,
} from "../lib/professionnels";
import type { CiblePro, CibleRefus, DocumentDossier } from "../types/professionnels.types";

interface Props {
  id: string | undefined;
  onFermer: () => void;
  onChangerStatut: (c: CiblePro) => void;
  onRefuser: (c: CibleRefus) => void;
}

function Section({ titre, droite, children }: { titre: string; droite?: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{titre}</h3>
        {droite && <span className="text-xs text-muted-foreground">{droite}</span>}
      </div>
      {children}
    </section>
  );
}

function Ligne({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{children}</span>
    </div>
  );
}

export function FicheProfessionnel({ id, onFermer, onChangerStatut, onRefuser }: Props) {
  const { data, isLoading, isError } = useDetailProfessionnel(id);
  const approuver = useApprouverDossier();
  const [confirmation, setConfirmation] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function acces(doc: DocumentDossier, telecharger: boolean) {
    if (!id) return;
    setInfo(null);
    try {
      const { url } = await professionnelsAdminService.lienDocument(id, doc.id);
      if (!url) {
        setInfo("Aperçu indisponible en mode démonstration.");
        return;
      }
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      if (telecharger) a.download = doc.nomFichier;
      a.click();
    } catch {
      setInfo("Impossible d'ouvrir le document.");
    }
  }

  const nomComplet = data ? `${data.prenom} ${data.nom}` : "";
  const dossier = data?.dossierInscription;
  const etat = data && dossier ? statutAffichage({ statutCompte: data.statutCompte, statutDossier: dossier.statut }) : null;
  const erreurApprobation = (approuver.error as { message?: string } | null)?.message;

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onFermer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="flex-row items-center gap-4 border-b border-border p-6 pr-12 text-left">
          {data && etat ? (
            <>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
                {initiales(nomComplet)}
              </span>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-lg">{nomComplet}</SheetTitle>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                    <span className={cn("size-1.5 rounded-full", COULEUR_STATUT[etat])} />
                    {LIBELLE_STATUT[etat]}
                  </span>
                </div>
                <SheetDescription className="text-xs font-semibold uppercase tracking-wider">
                  {METIERS_PRO[data.typeProfession].libelle}
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

          {data && dossier && (
            <>
              <Section titre="Informations personnelles & vérification">
                <div>
                  <Ligne label="Numéro mobile Sénégal">{data.telephone}</Ligne>
                  <Ligne label="Adresse courriel">
                    <span className="inline-flex items-center gap-1.5">
                      {data.email ?? "—"}
                      {data.emailVerifie ? (
                        <BadgeCheck className="size-4 text-emerald-500" aria-label="E-mail vérifié" />
                      ) : (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          Non vérifié
                        </span>
                      )}
                    </span>
                  </Ligne>
                  {data.matricule && <Ligne label="Matricule">{data.matricule}</Ligne>}
                  <Ligne label="Date de soumission">{formaterDate(dossier.dateSoumission)}</Ligne>
                  <Ligne label="Référence du dossier">{dossier.reference}</Ligne>
                  {dossier.nombreSoumissions > 1 && (
                    <Ligne label="Soumissions">{dossier.nombreSoumissions}</Ligne>
                  )}
                </div>
              </Section>

              <Section titre="Informations professionnelles">
                <div>
                  <Ligne label="Corps de métier">{METIERS_PRO[data.typeProfession].libelle}</Ligne>
                  <Ligne label="Spécialités">{data.specialites.map((s) => s.libelle).join(", ") || "—"}</Ligne>
                  <Ligne label="Zone d'intervention">{data.zone}</Ligne>
                  {data.typeProfession === "JURISTE_CONSEIL" && (
                    <Ligne label="Déclaration sur l'honneur">
                      {dossier.declarationHonneurAcceptee
                        ? `Acceptée${dossier.dateDeclarationHonneur ? ` le ${formaterDate(dossier.dateDeclarationHonneur)}` : ""}`
                        : "Non acceptée"}
                    </Ligne>
                  )}
                </div>
              </Section>

              <Section titre="Pièces fournies" droite={`${dossier.documents.length} fichier${dossier.documents.length > 1 ? "s" : ""}`}>
                <ul className="space-y-2">
                  {dossier.documents.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
                      <FileText className="size-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{LIBELLE_DOCUMENT[d.type]}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.nomFichier} · {formaterTaille(d.tailleOctets)}
                          {d.statut === "REJETE" && <span className="text-rose-600"> · Refusée</span>}
                        </p>
                      </div>
                      <button
                        aria-label={`Voir ${LIBELLE_DOCUMENT[d.type]}`}
                        onClick={() => acces(d, false)}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-card"
                      >
                        <Eye className="size-4" />
                      </button>
                      <button
                        aria-label={`Télécharger ${LIBELLE_DOCUMENT[d.type]}`}
                        onClick={() => acces(d, true)}
                        className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-card"
                      >
                        <Download className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                {info && <p className="text-xs text-muted-foreground">{info}</p>}
              </Section>
            </>
          )}
        </div>

        {data && dossier && etat && (
          <SheetFooter className="m-0 flex-col items-stretch gap-2 border-t border-border bg-muted/40 px-6 py-4">
            {erreurApprobation && (
              <p role="alert" className="text-sm text-destructive">{erreurApprobation}</p>
            )}

            {etat === "EN_ATTENTE" && !confirmation && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                {!data.emailVerifie && (
                  <span className="mr-auto text-xs text-amber-700">E-mail non vérifié : approbation impossible.</span>
                )}
                <Button
                  variant="outline"
                  onClick={() => onRefuser({ dossierId: dossier.id, nomComplet, documents: dossier.documents })}
                >
                  Refuser
                </Button>
                <Button disabled={!data.emailVerifie} onClick={() => setConfirmation(true)}>
                  Accepter l'inscription
                </Button>
              </div>
            )}

            {etat === "EN_ATTENTE" && confirmation && (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="mr-auto text-sm">Valider ce dossier et démarrer l'essai gratuit ?</span>
                <Button variant="ghost" disabled={approuver.isPending} onClick={() => setConfirmation(false)}>
                  Annuler
                </Button>
                <Button
                  disabled={approuver.isPending}
                  onClick={() => approuver.mutate(dossier.id, { onSuccess: () => setConfirmation(false) })}
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
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
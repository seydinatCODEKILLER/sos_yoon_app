import type { ReactNode } from "react";
import { ExternalLink, MapPin, Mic, Phone } from "lucide-react";
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
import { useDetailDemande } from "../hooks/useDemandesAdmin";
import {
  BADGE_TON,
  POINT_TON,
  estAQualifier,
  formaterDateHeure,
  formaterDuree,
  formaterDureeAudio,
  infoStatut,
  libelleMotifRefus,
  libelleSansProfessionnel,
  peutAnnuler,
  peutQualifier,
  peutReaffecter,
  peutRelancer,
} from "../lib/demande";
import type { DemandeAdminDetail } from "../types/demandes.types";
import { BadgeStatutDemande, BadgeUrgence, MetiersDemande, type ActionDemande } from "./ElementsDemande";

interface Props {
  id: string | undefined;
  onFermer: () => void;
  onAction: (a: ActionDemande, d: DemandeAdminDetail) => void;
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

export function FicheDemande({ id, onFermer, onAction }: Props) {
  const { data, isLoading, isError } = useDetailDemande(id);

  const audio = data?.audio ?? null;
  const urlAudio = mediaUrl(audio?.url);
  const loc = data?.localisation ?? null;
  const aCoordonnees = loc?.latitude != null && loc?.longitude != null;

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onFermer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border p-6 pr-12 text-left">
          {data ? (
            <>
              <SheetTitle className="text-lg tabular-nums">Demande {data.reference ?? "sans référence"}</SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-2 text-sm">
                Reçue le {formaterDateHeure(data.date)}
                <BadgeStatutDemande statut={data.statut} />
                <BadgeUrgence niveau={data.niveauUrgence} />
              </SheetDescription>
            </>
          ) : (
            <>
              <SheetTitle className="sr-only">Détail de la demande</SheetTitle>
              <SheetDescription className="sr-only">Chargement de la demande</SheetDescription>
              <div className="h-12 w-56 animate-pulse rounded-lg bg-muted" />
            </>
          )}
        </SheetHeader>

        <div className="flex-1 space-y-7 overflow-y-auto p-6">
          {isLoading && <div className="h-40 animate-pulse rounded-xl bg-muted" />}
          {isError && <p className="text-sm text-destructive">Impossible de charger la demande.</p>}

          {data && (
            <>
              <Section titre="Citoyen">
                <div>
                  <Ligne label="Nom">{data.citoyen?.nomComplet ?? "—"}</Ligne>
                  <Ligne label="Téléphone">
                    {data.citoyen?.telephone ? (
                      <a
                        href={`tel:${data.citoyen.telephone}`}
                        className="inline-flex items-center gap-1.5 hover:underline"
                      >
                        <Phone className="size-3.5" aria-hidden /> {data.citoyen.telephone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Ligne>
                </div>
              </Section>

              <Section titre="Besoin exprimé">
                {data.description ? (
                  <p className="rounded-xl bg-muted/60 p-3.5 text-sm leading-relaxed whitespace-pre-wrap">
                    {data.description}
                  </p>
                ) : (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    Aucune description écrite.
                  </p>
                )}

                {audio && (
                  <div className="space-y-2 rounded-xl bg-muted/60 p-3.5">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Mic className="size-4 text-muted-foreground" aria-hidden /> Message vocal
                      {audio.dureeSecondes != null && (
                        <span className="text-xs font-normal text-muted-foreground tabular-nums">
                          {formaterDureeAudio(audio.dureeSecondes)}
                        </span>
                      )}
                    </p>
                    {urlAudio ? (
                      <audio controls preload="none" src={urlAudio} className="w-full" />
                    ) : (
                      <p className="text-xs text-muted-foreground">Fichier audio indisponible.</p>
                    )}
                    {data.transcription ? (
                      <blockquote className="border-l-2 border-border pl-3 text-sm text-muted-foreground italic">
                        {data.transcription}
                      </blockquote>
                    ) : (
                      <p className="text-xs text-muted-foreground">Pas de transcription.</p>
                    )}
                  </div>
                )}

                <div>
                  <Ligne label="Profession">
                    <span className="inline-block text-left">
                      <MetiersDemande metiers={data.metiers} matiere={data.matiere} />
                    </span>
                  </Ligne>
                  <Ligne label="Localisation">
                    {loc?.libelle || aCoordonnees ? (
                      <span className="inline-flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
                        <MapPin className="size-3.5 text-muted-foreground" aria-hidden />
                        {loc?.libelle ?? "Position GPS"}
                        {aCoordonnees && (
                          <a
                            href={`https://www.google.com/maps?q=${loc?.latitude},${loc?.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-normal text-signal hover:underline"
                          >
                            Voir sur la carte <ExternalLink className="size-3" aria-hidden />
                          </a>
                        )}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Ligne>
                </div>
              </Section>

              <Section titre="Prise en charge">
                <div>
                  <Ligne label="Professionnel">{data.professionnel ?? libelleSansProfessionnel(data.statut)}</Ligne>
                  {data.tempsTraitementSecondes != null && (
                    <Ligne label="Acceptée après">{formaterDuree(data.tempsTraitementSecondes)}</Ligne>
                  )}
                </div>
              </Section>

              <Section
                titre="Professionnels sollicités"
                droite={`${data.sollicitations.length} sollicitation${data.sollicitations.length > 1 ? "s" : ""}`}
              >
                {data.sollicitations.length === 0 ? (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    Aucun professionnel n'a encore été sollicité.
                  </p>
                ) : (
                  <ol className="space-y-2">
                    {data.sollicitations.map((s, i) => {
                      const { libelle, ton } = infoStatut(s.statut);
                      const motif = libelleMotifRefus(s.motifRefus);
                      return (
                        <li key={`${s.rang ?? i}-${s.professionnel ?? ""}`} className="rounded-xl bg-muted/60 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="min-w-0 truncate text-sm font-medium">
                              {s.rang != null && <span className="text-muted-foreground">{s.rang}. </span>}
                              {s.professionnel ?? "Professionnel inconnu"}
                            </p>
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                BADGE_TON[ton],
                              )}
                            >
                              {libelleSollicitation(s.statut, libelle)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sollicité le {formaterDateHeure(s.dateSollicitation)}
                            {s.dateReponse && ` · réponse le ${formaterDateHeure(s.dateReponse)}`}
                            {motif && ` · ${motif}`}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </Section>

              <Section titre="Historique" droite={`${data.historique.length} événement${data.historique.length > 1 ? "s" : ""}`}>
                {data.historique.length === 0 ? (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">Aucun événement.</p>
                ) : (
                  <ol className="relative ml-1.5 space-y-4 border-l border-border pl-5">
                    {data.historique.map((h, i) => {
                      const { libelle, ton } = infoStatut(h.nouveauStatut);
                      return (
                        <li key={`${h.date ?? ""}-${h.nouveauStatut ?? ""}-${i}`} className="relative">
                          <span
                            className={cn(
                              "absolute top-1.5 left-[-1.6rem] size-2.5 rounded-full ring-4 ring-background",
                              POINT_TON[ton],
                            )}
                            aria-hidden
                          />
                          <p className="text-sm font-medium">{libelle}</p>
                          <p className="text-xs text-muted-foreground">
                            {formaterDateHeure(h.date)}
                            {h.acteur && ` · ${h.acteur}`}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </Section>
            </>
          )}
        </div>

        {data && <PiedFiche d={data} onAction={onAction} />}
      </SheetContent>
    </Sheet>
  );
}

/** Une sollicitation a ses propres statuts (EN_ATTENTE, ACCEPTEE, REFUSEE…) : libellés dédiés. */
function libelleSollicitation(statut: string | null, repli: string): string {
  switch (statut) {
    case "EN_ATTENTE":
      return "En attente";
    case "EN_RESERVE":
      return "En réserve";
    case "ACCEPTEE":
      return "Acceptée";
    case "REFUSEE":
      return "Refusée";
    case "EXPIREE":
      return "Sans réponse";
    default:
      return repli;
  }
}

function PiedFiche({ d, onAction }: { d: DemandeAdminDetail; onAction: (a: ActionDemande, d: DemandeAdminDetail) => void }) {
  const qualifier = peutQualifier(d.statut);
  const reaffecter = peutReaffecter(d.statut);
  const relancer = peutRelancer(d.statut, d.professionnel);
  const annuler = peutAnnuler(d.statut);

  if (!qualifier && !reaffecter && !relancer && !annuler) {
    return (
      <SheetFooter className="m-0 border-t border-border bg-muted/40 px-6 py-4">
        <p className="text-right text-xs text-muted-foreground">Cette demande est clôturée : aucune action possible.</p>
      </SheetFooter>
    );
  }

  return (
    <SheetFooter className="m-0 flex-row flex-wrap items-center justify-end gap-2 border-t border-border bg-muted/40 px-6 py-4">
      {annuler && (
        <Button
          variant="outline"
          className="mr-auto text-destructive hover:text-destructive"
          onClick={() => onAction("annuler", d)}
        >
          Annuler la demande
        </Button>
      )}
      {relancer && (
        <Button variant="outline" onClick={() => onAction("relancer", d)}>
          Relancer la recherche
        </Button>
      )}
      {qualifier && !estAQualifier(d.statut) && (
        <Button variant="outline" onClick={() => onAction("qualifier", d)}>
          Requalifier
        </Button>
      )}
      {reaffecter && (
        <Button variant={estAQualifier(d.statut) ? "outline" : "default"} onClick={() => onAction("reaffecter", d)}>
          Attribuer à un professionnel
        </Button>
      )}
      {estAQualifier(d.statut) && qualifier && (
        <Button onClick={() => onAction("qualifier", d)}>Qualifier la demande</Button>
      )}
    </SheetFooter>
  );
}
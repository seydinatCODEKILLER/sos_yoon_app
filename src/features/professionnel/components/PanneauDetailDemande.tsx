import {
  Check,
  CircleAlert,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { useSollicitationDetail } from "../hooks/useSollicitationDetail";
import { libelleMetier, libellePrestation } from "../lib/libellesDemande";
import { URGENCE } from "../lib/urgence";
import type { SollicitationDetail } from "../types/sollicitation.types";
import { LecteurAudio } from "./LecteurAudio";
import { formaterTelephone } from "../lib/contactClient";
import { BoutonsContactClient } from "./BoutonsContactClient";

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  ACCEPTEE: { libelle: "Acceptée", classe: "bg-emerald-100 text-emerald-700" },
  REFUSEE: { libelle: "Refusée", classe: "bg-red-100 text-red-700" },
  EXPIREE: { libelle: "Expirée", classe: "bg-amber-100 text-amber-800" },
};

interface PanneauDetailDemandeProps {
  /** null = panneau fermé */
  id: string | null;
  enCours: boolean;
  erreur: string | null;
  onFermer: () => void;
  onAccepter: (d: SollicitationDetail) => void;
  onRefuser: (d: SollicitationDetail) => void;
}

function Bloc({
  titre,
  children,
}: {
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-ink/10 bg-linear-to-br from-white to-navy/5 p-4">
      <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink/70 uppercase">
        <span aria-hidden className="size-1.5 rounded-full bg-signal" />
        {titre}
      </h3>
      {children}
    </section>
  );
}

export function PanneauDetailDemande({
  id,
  enCours,
  erreur,
  onFermer,
  onAccepter,
  onRefuser,
}: PanneauDetailDemandeProps) {
  const { data: d, isError } = useSollicitationDetail(id);
  const enAttente = d?.statut === "EN_ATTENTE";
  const urgence = d ? (URGENCE[d.niveauUrgence] ?? URGENCE.NORMAL) : null;
  const statut = d ? STATUTS[d.statut] : undefined;
  const texteLibre = d?.transcription ?? d?.description ?? d?.extrait;

  return (
    <Sheet open={id !== null} onOpenChange={(ouvert) => !ouvert && onFermer()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl"
      >
        {isError ? (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div className="space-y-3">
              <SheetTitle className="text-lg font-bold text-ink">
                Demande introuvable
              </SheetTitle>
              <SheetDescription className="text-sm text-ink/60">
                Cette demande n'existe plus ou a été réattribuée.
              </SheetDescription>
              <Button type="button" variant="outline" onClick={onFermer}>
                Retour aux demandes
              </Button>
            </div>
          </div>
        ) : !d ? (
          <div className="space-y-4 p-6">
            <SheetTitle className="sr-only">
              Chargement de la demande
            </SheetTitle>
            <div className="h-8 w-48 animate-pulse rounded-md bg-ink/10" />
            <div className="h-24 animate-pulse rounded-xl bg-ink/5" />
            <div className="h-32 animate-pulse rounded-xl bg-ink/5" />
          </div>
        ) : (
          <>
            {/* En-tête */}
            <header className="space-y-3 border-b border-ink/10 bg-linear-to-br from-white to-navy/6 px-6 pt-6 pb-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pr-8">
                <SheetTitle className="text-2xl font-bold text-ink">
                  {d.citoyen.affichage}
                </SheetTitle>
                <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11px] text-ink/60">
                  {d.reference}
                </code>
                {urgence && (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${urgence.pastille}`}
                  >
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-current"
                    />
                    {urgence.libelle}
                  </span>
                )}
                {statut && (
                  <Badge
                    className={`border-0 text-xs font-semibold ${statut.classe}`}
                  >
                    {statut.libelle}
                  </Badge>
                )}
              </div>

              <SheetDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/65">
                <span className="inline-flex items-center gap-1 font-semibold text-ink">
                  <MapPin className="size-3.5" aria-hidden />
                  {d.libelleLocalisation}
                  <span className="font-normal text-ink/50">
                    (~{d.distanceKm} km)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <ShieldCheck className="size-3.5 shrink-0" aria-hidden />
                  Numéro &amp; email certifiés SOS Yoon, débloqués dès
                  l'acceptation
                </span>
              </SheetDescription>

              {d.prestationRecommandee && (
                <p className="text-xs font-semibold text-signal">
                  Prestation recommandée :{" "}
                  {libellePrestation(d.prestationRecommandee)}
                </p>
              )}
            </header>

            {/* Contenu */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <section className="space-y-3 rounded-xl border border-violet-200 bg-linear-to-br from-violet-50 to-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-violet-900 uppercase">
                    <Sparkles className="size-4 shrink-0" aria-hidden />
                    Pertinence pour votre profil
                  </h3>
                  <Badge className="shrink-0 border border-violet-200 bg-white text-[11px] font-bold text-violet-700">
                    Correspondance : {d.scoreCorrespondance} %
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-ink/80">
                  <strong className="text-ink">Matière :</strong> {d.matiere}.
                  {d.metiersRequis.length > 0 && (
                    <>
                      {" "}
                      <strong className="text-ink">Métier requis :</strong>{" "}
                      {d.metiersRequis.map(libelleMetier).join(", ")}.
                    </>
                  )}
                </p>
              </section>

              {d.audio && (
                <Bloc titre="Message vocal du citoyen">
                  <LecteurAudio
                    key={d.audio.url}
                    url={d.audio.url}
                    dureeSecondes={d.audio.dureeSecondes}
                  />
                </Bloc>
              )}

              {texteLibre && (
                <Bloc
                  titre={
                    d.transcription
                      ? "Transcription automatique"
                      : "Description de la demande"
                  }
                >
                  <p
                    className={`text-sm leading-relaxed text-ink/80 ${d.transcription ? "italic" : ""}`}
                  >
                    {d.transcription ? `« ${d.transcription} »` : texteLibre}
                  </p>
                </Bloc>
              )}
            </div>

            {/* Actions */}
            {enAttente && (
              <footer className="space-y-3 border-t border-ink/10 bg-white px-6 py-4">
                {erreur && (
                  <p
                    role="alert"
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
                  >
                    <CircleAlert className="size-4 shrink-0" aria-hidden />
                    {erreur}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={enCours}
                    onClick={() => onRefuser(d)}
                    className="h-11 w-full rounded-xl border-ink/15 px-4 text-sm font-semibold text-ink/80"
                  >
                    Refuser la demande
                  </Button>
                  <Button
                    type="button"
                    disabled={enCours}
                    onClick={() => onAccepter(d)}
                    className="h-11 w-full rounded-xl bg-signal px-4 text-sm font-semibold text-white hover:bg-signal/90"
                  >
                    <Check className="size-4" aria-hidden />
                    {enCours ? "Acceptation…" : "Accepter la demande"}
                  </Button>
                </div>
                <p className="text-center text-[11px] leading-snug text-ink/50">
                  En acceptant, le citoyen est notifié par SMS et un dossier est
                  instantanément créé dans votre espace.
                </p>
              </footer>
            )}

            {/* Demande acceptée : coordonnées et contact */}
            {d.statut === "ACCEPTEE" && d.citoyen.telephone && (
              <footer className="space-y-3 border-t border-ink/10 bg-white px-6 py-4">
                <p className="text-xs text-ink/60">
                  Coordonnées du client :{" "}
                  <strong className="text-ink">
                    {formaterTelephone(d.citoyen.telephone)}
                  </strong>
                  {d.citoyen.email && <> · {d.citoyen.email}</>}
                </p>
                <BoutonsContactClient
                  telephone={d.citoyen.telephone}
                  reference={d.reference}
                />
              </footer>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

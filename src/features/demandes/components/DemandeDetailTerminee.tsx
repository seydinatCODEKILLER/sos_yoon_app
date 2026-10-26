import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  Landmark,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import type { PhaseDemande, SuiviDemande } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { formatDateDemande, formatHeure } from "../lib/formatDateDemande";
import {
  lienAppel,
  lienWhatsApp,
  nomCourt,
} from "../lib/contactProfessionnel";
import { SuiviTimeline, type TimelineItem } from "./SuiviTimeline";

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PHASES: PhaseDemande[] = [
  "ENVOYEE",
  "PROS_NOTIFIES",
  "ACCEPTEE",
  "CONTACT_ETABLI",
];

const CARTE_CLASSE = `gap-0 rounded-xl border py-0 ${CARTE}`;

export function DemandeDetailTerminee({ suivi }: { suivi: SuiviDemande }) {
  const pro = suivi.professionnel;
  const annulee = suivi.statut === "ANNULEE";
  const titre = capitalise(suivi.matiereLibelle ?? "Demande d'aide");

  const jalon = (phase: PhaseDemande) =>
    suivi.jalons.find((j) => j.phase === phase);

  const textes: Record<PhaseDemande, { titre: string; description: string }> = {
    ENVOYEE: {
      titre: "Demande envoyée",
      description: "Reçue par le système central SOS Yoon",
    },
    PROS_NOTIFIES: {
      titre: "Professionnels notifiés",
      description: "Disponibilités vérifiées dans votre zone",
    },
    ACCEPTEE: {
      titre: "Demande acceptée",
      description: pro
        ? `Attribution confirmée avec ${nomCourt(pro.nomComplet)}`
        : "Attribution confirmée",
    },
    CONTACT_ETABLI: {
      titre: "Contact établi",
      description: "Échange direct réalisé",
    },
  };

  const items: TimelineItem[] = PHASES.map((phase) => {
    const j = jalon(phase);
    return {
      id: phase,
      titre: textes[phase].titre,
      description: textes[phase].description,
      status: j ? "done" : "pending",
      heure: j ? formatHeure(j.date) : undefined,
    };
  });

  const nbEtapes = items.filter((i) => i.status === "done").length;

  return (
    <div className="flex flex-1 flex-col">
      <Button
        variant="ghost"
        size="icon"
        nativeButton={false}
        render={<Link to={demandeRoutes.liste} />}
        aria-label="Retour à mes demandes"
        className="-ml-2 size-10 rounded-full text-navy hover:bg-ink/5"
      >
        <ArrowLeft className="size-5" />
      </Button>

      {/* En-tête */}
      <Card className={`mt-2 ${CARTE_CLASSE}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg leading-snug font-bold text-navy">
              {titre}
            </h2>
            <Badge
              variant="secondary"
              className="h-auto shrink-0 gap-1 rounded-lg bg-ink/6 px-2.5 py-1 text-xs font-semibold text-ink/70 [&>svg]:size-3.5"
            >
              {annulee ? <X aria-hidden /> : <Check aria-hidden />}
              {annulee ? "Annulée" : "Terminée"}
            </Badge>
          </div>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-ink/60">
            <Clock className="size-3.5" aria-hidden />
            {formatDateDemande(suivi.dateEnvoi)}
          </p>
        </CardContent>
      </Card>

      {/* Parcours */}
      <Card
        role="region"
        aria-label="Parcours de prise en charge"
        className={`mt-4 ${CARTE_CLASSE}`}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between rounded-lg bg-ink/5 px-3 py-2">
            <h3 className="text-[13px] font-semibold text-ink">
              Parcours de prise en charge
            </h3>
            <Badge
              variant="secondary"
              className="h-auto rounded-md bg-ink/8 px-2 py-0.5 text-xs font-medium text-ink/60"
            >
              {nbEtapes === PHASES.length
                ? "Complet"
                : `${nbEtapes}/${PHASES.length} étapes`}
            </Badge>
          </div>
          <div className="mt-2">
            <SuiviTimeline items={items} />
          </div>
        </CardContent>
      </Card>

      {/* Professionnel */}
      {pro && (
        <Card
          role="region"
          aria-label="Professionnel"
          className={`mt-4 ${CARTE_CLASSE}`}
        >
          <CardContent className="flex items-start gap-3 p-4">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center text-navy"
            >
              <Landmark className="size-7" strokeWidth={1.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-base leading-snug font-bold text-navy">
                  {pro.nomComplet}
                </p>
                {!annulee && (
                  <Badge
                    variant="secondary"
                    className="h-auto shrink-0 gap-1.5 rounded-lg bg-ink/6 px-2 py-0.5 text-xs font-medium text-ink/70"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-ink/40"
                    />
                    Contact terminé
                  </Badge>
                )}
              </div>
              <p className="text-[13px] text-ink/60">
                {capitalise(pro.metier)} · {pro.communeLibelle}
              </p>
              {pro.ordre && (
                <Badge
                  variant="outline"
                  className="mt-2 h-auto gap-1.5 rounded-lg border-ink/10 bg-ink/3 px-2.5 py-1 text-xs font-medium text-ink/70 [&>svg]:size-3.5"
                >
                  <BadgeCheck aria-hidden />
                  {pro.ordre}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      {pro && (
        <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
          <Button
            nativeButton={false}
            render={<a href={lienAppel(pro.telephone)} />}
            className="h-13 rounded-xl bg-navy text-sm font-semibold text-paper hover:bg-navy/90"
          >
            <PhoneCall className="size-4" aria-hidden />
            Appeler
          </Button>
          <Button
            variant="secondary"
            nativeButton={false}
            render={
              <a
                href={lienWhatsApp(pro.telephone, pro.nomComplet, suivi.reference)}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            className="h-13 rounded-xl bg-ink/8 text-sm font-semibold text-ink/80 hover:bg-ink/12"
          >
            <MessageCircle className="size-4" aria-hidden />
            Message
          </Button>
        </div>
      )}
    </div>
  );
}
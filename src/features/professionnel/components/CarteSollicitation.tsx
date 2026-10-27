import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Check,
  Clock,
  FileText,
  Hourglass,
  MapPin,
  Mic,
  Zap,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition } from "@/shared/lib/animationsPage";
import {
  formaterCompteARebours,
  formaterMmSs,
  ilYa,
} from "../lib/formatDashboard";
import { URGENCE } from "../lib/urgence";
import type { SollicitationResume } from "../types/dashboard.types";

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  ACCEPTEE: { libelle: "Acceptée", classe: "bg-emerald-100 text-emerald-700" },
  REFUSEE: { libelle: "Refusée", classe: "bg-red-100 text-red-700" },
  EXPIREE: { libelle: "Expirée", classe: "bg-amber-100 text-amber-800" },
};

interface CarteSollicitationProps {
  s: SollicitationResume;
  /** Horodatage de la dernière récupération (dataUpdatedAt) */
  maintenant: number;
  enCours: boolean;
  desactive: boolean;
  onAccepter: (s: SollicitationResume) => void;
  onRefuser: (s: SollicitationResume) => void;
  onOuvrir: (s: SollicitationResume) => void;
}

export function CarteSollicitation({
  s,
  maintenant,
  enCours,
  desactive,
  onAccepter,
  onRefuser,
  onOuvrir,
}: CarteSollicitationProps) {
  const enAttente = s.statut === "EN_ATTENTE";
  const urgence = URGENCE[s.niveauUrgence] ?? URGENCE.NORMAL;
  const critique = s.niveauUrgence === "CRITIQUE";

  // Compte à rebours en direct. La carte est remontée à chaque récupération
  // (key = dataUpdatedAt) : secondesRestantes repart donc de la valeur du serveur.
  const [ecoule, setEcoule] = useState(0);
  useEffect(() => {
    if (!enAttente) return;
    const id = setInterval(() => setEcoule((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [enAttente]);

  const restant = Math.max(0, s.secondesRestantes - ecoule);
  const expiree = enAttente && restant === 0;
  const totalSecondes = Math.max(
    1,
    (new Date(s.expireLe).getTime() - new Date(s.recueLe).getTime()) / 1000,
  );
  const part = Math.min(100, (restant / totalSecondes) * 100);
  const IconeDelai = critique ? Clock : Hourglass;
  const statut = STATUTS[s.statut];

  return (
    <motion.li variants={apparition} className="list-none">
      <Card
        className={`relative h-full gap-0 py-0 ${
          critique && enAttente
            ? "border-signal bg-linear-to-br from-white to-signal/8 shadow-sm ring-1 ring-signal/30"
            : CARTE
        } ${expiree ? "opacity-60" : ""}`}
      >
        <CardContent className="flex h-full flex-col gap-3 p-4">
          {/* Délai */}
          {enAttente ? (
            <div className="space-y-1.5">
              <p
                className={`flex items-center gap-1.5 text-xs font-semibold ${urgence.texte}`}
              >
                <IconeDelai className="size-3.5" aria-hidden />
                {expiree
                  ? "Expirée"
                  : `Expire dans ${formaterCompteARebours(restant)}`}
              </p>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(part)}
                className="h-1.5 overflow-hidden rounded-full bg-ink/10"
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${urgence.barre}`}
                  style={{ width: `${part}%` }}
                />
              </div>
            </div>
          ) : (
            statut && (
              <Badge
                className={`w-fit border-0 text-xs font-semibold ${statut.classe}`}
              >
                {statut.libelle}
              </Badge>
            )
          )}

          {/* Urgence + réception */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${urgence.pastille}`}
            >
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {urgence.libelle}
            </span>
            <span className="text-[11px] text-ink/50">
              Reçu {ilYa(s.recueLe, maintenant)}
            </span>
          </div>

          {/* Citoyen + score */}
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => onOuvrir(s)}
              className="text-left text-base font-bold text-ink outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-signal after:rounded-xl"
            >
              {s.citoyen.affichage}
            </button>
            <Badge
              className={`shrink-0 border-0 text-[10px] font-bold ${
                s.scoreCorrespondance >= 95
                  ? "bg-violet-100 text-violet-700"
                  : "bg-ink/8 text-ink/70"
              }`}
            >
              <Zap className="size-3" aria-hidden />
              {s.scoreCorrespondance} % IA
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-ink">{s.matiere}</p>
            <p className="line-clamp-2 text-xs leading-snug text-ink/70">
              {s.extrait}
            </p>
          </div>

          {/* Lieu + type de saisie */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/8 pt-3 text-[11px]">
            <span className="inline-flex min-w-0 items-center gap-1 text-ink/60">
              <MapPin className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{s.libelleLocalisation}</span>
            </span>
            {s.typeSaisie === "VOCAL" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-signal/10 px-2 py-1 font-medium text-signal">
                <Mic className="size-3" aria-hidden />
                Vocal
                {s.dureeAudioSecondes !== null
                  ? ` ${formaterMmSs(s.dureeAudioSecondes)}`
                  : ""}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-ink/8 px-2 py-1 font-medium text-ink/65">
                <FileText className="size-3" aria-hidden />
                Note écrite
              </span>
            )}
          </div>

          {/* Actions */}
          {enAttente && (
            <div className="relative z-10 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={expiree || desactive}
                onClick={() => onRefuser(s)}
                className="h-9 rounded-lg border-ink/10 bg-ink/5 text-xs font-semibold text-ink/80"
              >
                Refuser
              </Button>
              <Button
                type="button"
                disabled={expiree || desactive}
                onClick={() => onAccepter(s)}
                className={`h-9 rounded-lg text-xs font-semibold ${
                  critique
                    ? "bg-signal text-white hover:bg-signal/90"
                    : "border border-signal/30 bg-signal/10 text-signal hover:bg-signal/15"
                }`}
              >
                {enCours ? "Acceptation…" : "Accepter"}
                {!enCours && <Check className="size-3.5" aria-hidden />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.li>
  );
}

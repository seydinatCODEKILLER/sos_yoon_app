import { Link } from "react-router-dom";
import { Check, Mail, MapPin, Phone, Timer } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { formaterTelephone } from "../lib/contactClient";
import { initiales } from "../lib/formatDashboard";
import type { SollicitationAcceptee } from "../types/dashboard.types";
import { BoutonsContactClient } from "./BoutonsContactClient";

export interface AcceptationAffichee {
  resultat: SollicitationAcceptee;
  /** Objet de la demande (extrait affiché dans la liste) */
  objet: string;
}

interface DialogAcceptationProps {
  /** null = fenêtre fermée */
  acceptation: AcceptationAffichee | null;
  /** Demandes restantes en attente */
  restantes: number;
  onFermer: () => void;
}

function heureLocale(iso: string) {
  return new Date(iso)
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "h");
}

export function DialogAcceptation({ acceptation, restantes, onFermer }: DialogAcceptationProps) {
  const r = acceptation?.resultat;
  const nom = r ? `${r.citoyen.prenom} ${r.citoyen.nom}` : "";

  return (
    <Dialog open={acceptation !== null} onOpenChange={(ouvert) => !ouvert && onFermer()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto sm:max-w-xl">
        {acceptation && r && (
          <>
            <div className="flex items-start gap-4">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <span className="grid size-8 place-items-center rounded-full bg-emerald-600 text-white">
                  <Check className="size-5" strokeWidth={3} aria-hidden />
                </span>
              </span>
              <div className="space-y-2">
                <Badge className="gap-1 border-0 bg-emerald-100 text-[11px] font-semibold text-emerald-700">
                  <Check className="size-3" aria-hidden />
                  Dossier assigné avec succès
                </Badge>
                <DialogTitle className="text-xl font-bold text-ink">
                  Demande ajoutée à vos dossiers !
                </DialogTitle>
              </div>
            </div>

            <DialogDescription className="text-sm leading-relaxed text-ink/65">
              Le dossier de <strong className="text-ink">{nom}</strong>{" "}
              <code className="rounded bg-ink/8 px-1.5 py-0.5 text-xs">{r.reference}</code> est
              désormais actif dans votre espace d'exercice. Le citoyen a été notifié de votre prise
              en charge.
            </DialogDescription>

            {/* Coordonnées révélées */}
            <div className="space-y-3 rounded-xl border border-ink/10 bg-ink/5 p-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white"
                >
                  {initiales(nom)}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{nom}</p>
                  {r.citoyen.commune && (
                    <p className="flex items-center gap-1 text-xs text-ink/55">
                      <MapPin className="size-3" aria-hidden />
                      {r.citoyen.commune}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-ink/10 pt-3 sm:grid-cols-2">
                <div className="flex min-h-14 items-center gap-3 rounded-lg bg-white px-3 py-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Phone className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-ink/50">Ligne directe débloquée</p>
                    <p className="text-sm font-semibold text-ink">
                      {formaterTelephone(r.citoyen.telephone)}
                    </p>
                  </div>
                </div>

                <div className="flex min-h-14 items-center gap-3 rounded-lg bg-white px-3 py-2">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-700">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-ink/50">Courriel</p>
                    <p className="truncate text-sm font-semibold text-ink">
                      {r.citoyen.email ?? "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 pt-3 text-xs">
                <p className="flex min-w-0 items-center gap-2 text-ink/80">
                  <Badge className="border-0 bg-signal/15 text-[10px] font-bold text-signal uppercase">
                    Objet
                  </Badge>
                  <span className="line-clamp-2">{acceptation.objet}</span>
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-signal/10 px-2 py-1 font-semibold text-signal">
                  <Timer className="size-3.5" aria-hidden />
                  1er contact garanti avant {heureLocale(r.premierContactAvant)}
                </span>
              </div>
            </div>

            <BoutonsContactClient telephone={r.citoyen.telephone} reference={r.reference} />

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link to={`/pro/dossiers/${r.demandeId}`} />}
                className="text-xs font-semibold text-ink/70"
              >
                Ouvrir le dossier
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onFermer}
                className="text-xs text-ink/55"
              >
                {restantes > 0
                  ? `Rester sur les demandes restantes (${restantes} en attente)`
                  : "Rester sur les demandes"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CircleAlert,
  FolderCheck,
  Hourglass,
  Mail,
  MapPin,
  Phone,
  Play,
} from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { CARTE } from "@/shared/lib/styleCarte";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import {
  useChangerStatutDossier,
  useCloturerDossier,
  useDossierDetail,
} from "../hooks/useDossiers";
import { formaterTelephone } from "../lib/contactClient";
import { formaterDateCourte, initiales } from "../lib/formatDashboard";
import { STATUT_DOSSIER } from "../lib/statutDossier";
import { DialogCloture } from "./DialogCloture";
import { BoutonsContactClient } from "./BoutonsContactClient";

const messageErreur = (e: unknown, defaut: string) => (e as Partial<ApiErreur>).message ?? defaut;

interface DetailDossierProps {
  demandeId: string;
  /** Affiché sur mobile pour revenir à la liste */
  onRetour?: () => void;
}

export function DetailDossier({ demandeId, onRetour }: DetailDossierProps) {
  const { data: d, isError } = useDossierDetail(demandeId);
  const changerStatut = useChangerStatutDossier();
  const cloturer = useCloturerDossier();
  const [clotureOuverte, setClotureOuverte] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [erreurCloture, setErreurCloture] = useState<string | null>(null);

  async function changer(statut: "EN_COURS" | "EN_ATTENTE_CLIENT") {
    setErreur(null);
    try {
      await changerStatut.mutateAsync({ id: demandeId, statut });
    } catch (e) {
      setErreur(messageErreur(e, "Impossible de modifier le statut du dossier."));
    }
  }

  async function confirmerCloture(commentaire: string) {
    setErreurCloture(null);
    try {
      await cloturer.mutateAsync({ id: demandeId, commentaire });
      setClotureOuverte(false);
    } catch (e) {
      setErreurCloture(messageErreur(e, "Impossible de clôturer le dossier."));
    }
  }

  if (isError) {
    return (
      <div className="grid min-h-64 place-items-center text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">Dossier introuvable</p>
          {onRetour && (
            <Button type="button" variant="outline" onClick={onRetour}>
              Retour aux dossiers
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="space-y-4">
        <div className="h-20 animate-pulse rounded-xl bg-ink/5" />
        <div className="h-40 animate-pulse rounded-xl bg-ink/5" />
      </div>
    );
  }

  const nom = `${d.citoyen.prenom} ${d.citoyen.nom}`;
  const statut = STATUT_DOSSIER[d.statutDossier];
  const objet = d.demande.description ?? d.demande.transcription ?? "Aucune description.";
  const ouvert = d.statutDossier !== "CLOTURE";

  return (
    <motion.div variants={conteneur} initial="cache" animate="visible" className="space-y-5">
      {onRetour && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRetour}
          className="-ml-2 text-xs font-semibold text-ink/65"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Retour aux dossiers
        </Button>
      )}

      {/* Client */}
      <motion.header variants={apparition} className="flex flex-wrap items-start gap-4">
        <span
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-2xl bg-signal/15 text-xl font-bold text-signal"
        >
          {initiales(nom)}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-ink">{nom}</h2>
            <Badge className={`gap-1.5 border-0 text-[11px] font-semibold ${statut.classe}`}>
              <span aria-hidden className={`size-1.5 rounded-full ${statut.point}`} />
              {statut.libelle}
            </Badge>
          </div>
          <p className="font-mono text-[11px] font-semibold text-ink/50">{d.reference}</p>
          <ul className="space-y-0.5 text-xs text-ink/65">
            <li className="flex items-center gap-1.5">
              <Phone className="size-3.5" aria-hidden />
              {formaterTelephone(d.citoyen.telephone)}
            </li>
            {d.citoyen.email && (
              <li className="flex items-center gap-1.5">
                <Mail className="size-3.5" aria-hidden />
                {d.citoyen.email}
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {d.demande.libelleLocalisation}
            </li>
          </ul>
        </div>
      </motion.header>

      {/* Contact et actions */}
      {ouvert && (
        <motion.section variants={apparition} className="space-y-3">
          <BoutonsContactClient telephone={d.citoyen.telephone} reference={d.reference} />

          <div className="flex flex-wrap items-center gap-2">
            {d.statutDossier === "EN_COURS" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={changerStatut.isPending}
                onClick={() => changer("EN_ATTENTE_CLIENT")}
                className="h-9 rounded-lg text-xs font-semibold"
              >
                <Hourglass className="size-4" aria-hidden />
                Mettre en attente du client
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={changerStatut.isPending}
                onClick={() => changer("EN_COURS")}
                className="h-9 rounded-lg text-xs font-semibold"
              >
                <Play className="size-4" aria-hidden />
                Reprendre le dossier
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setErreurCloture(null);
                setClotureOuverte(true);
              }}
              className="h-9 rounded-lg bg-navy text-xs font-semibold text-white hover:bg-navy/90"
            >
              <FolderCheck className="size-4" aria-hidden />
              Clôturer le dossier
            </Button>
          </div>

          {erreur && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden />
              {erreur}
            </p>
          )}
        </motion.section>
      )}

      {/* Demande initiale */}
      <motion.div variants={apparition}>
        <Card className="gap-0 border-signal/25 bg-linear-to-br from-signal/8 to-white py-0 shadow-sm">
          <CardContent className="space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-ink uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-signal" />
                Demande initiale acceptée
              </h3>
              <span className="text-[11px] text-ink/50">
                Acceptée le {formaterDateCourte(d.demande.dateAcceptation)} via SOS Yoon
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink/80">
              <strong className="text-ink">Objet du dossier :</strong> {d.titre ? `${d.titre}. ` : ""}
              {objet}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {!ouvert && (
        <motion.p variants={apparition} className={`rounded-xl p-4 text-sm text-ink/70 ${CARTE}`}>
          Ce dossier est clôturé. Le client peut désormais donner son avis sur votre accompagnement.
        </motion.p>
      )}

      <DialogCloture
        ouvert={clotureOuverte}
        reference={d.reference}
        nomClient={nom}
        enCours={cloturer.isPending}
        erreur={erreurCloture}
        onFermer={() => setClotureOuverte(false)}
        onConfirmer={confirmerCloture}
      />
    </motion.div>
  );
}
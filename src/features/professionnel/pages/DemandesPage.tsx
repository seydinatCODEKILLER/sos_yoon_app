import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Ban, ChevronLeft, ChevronRight, CircleAlert, History, Inbox, type LucideIcon } from "lucide-react";
import type { ApiErreur } from "@/types/api.types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteDisponibilite } from "../components/CarteDisponibilite";
import { CarteSollicitation } from "../components/CarteSollicitation";
import {
  DialogAcceptation,
  type AcceptationAffichee,
} from "../components/DialogAcceptation";
import { DialogRefus } from "../components/DialogRefus";
import { OngletsDemandes } from "../components/OngletsDemandes";
import { PanneauDetailDemande } from "../components/PanneauDetailDemande";
import { useAccepterSollicitation } from "../hooks/useAccepterSollicitation";
import { useSollicitations } from "../hooks/useSollicitations";
import { useTableauDeBord } from "../hooks/useTableauDeBord";
import type { SollicitationResume } from "../types/dashboard.types";
import type { OngletSollicitations } from "../types/sollicitation.types";

const MESSAGES_ERREUR: Record<string, string> = {
  SOLLICITATION_EXPIREE: "Cette demande a expiré.",
  DEMANDE_DEJA_AFFECTEE: "Un autre professionnel a déjà accepté cette demande.",
};

const VIDES: Record<OngletSollicitations, { icone: LucideIcon; titre: string; texte: string }> = {
  NOUVELLES: {
    icone: Inbox,
    titre: "Aucune nouvelle demande",
    texte: "Les demandes correspondant à votre profil apparaîtront ici dès leur réception.",
  },
  REFUSEES: {
    icone: Ban,
    titre: "Aucune demande refusée",
    texte: "Les demandes que vous avez refusées ces dernières 48 heures s'afficheront ici.",
  },
  HISTORIQUE: {
    icone: History,
    titre: "Historique vide",
    texte: "Vos demandes traitées apparaîtront ici.",
  },
};

export function DemandesPage() {
  const navigate = useNavigate();
  // /pro/demandes/:id ouvre le panneau de détail par-dessus la liste
  const { id: idDetail } = useParams<{ id: string }>();

  const [onglet, setOnglet] = useState<OngletSollicitations>("NOUVELLES");
  const [page, setPage] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [aRefuser, setARefuser] = useState<SollicitationResume | null>(null);
  const [acceptation, setAcceptation] = useState<AcceptationAffichee | null>(null);

  const { data, dataUpdatedAt } = useSollicitations(onglet, page);
  const { data: tableau } = useTableauDeBord("7j");
  const accepter = useAccepterSollicitation();

  const enAttente = tableau?.sollicitationsEnAttente ?? 0;
  const enCours = accepter.isPending ? accepter.variables : null;
  const vide = VIDES[onglet];
  const IconeVide = vide.icone;

  function changerOnglet(valeur: OngletSollicitations) {
    setOnglet(valeur);
    setPage(0);
    setErreur(null);
  }

  function ouvrirDetail(s: Pick<SollicitationResume, "id">) {
    setErreur(null);
    navigate(`/pro/demandes/${s.id}`);
  }

  function fermerDetail() {
    setErreur(null);
    navigate("/pro/demandes");
  }

  async function onAccepter(s: Pick<SollicitationResume, "id" | "extrait">) {
    setErreur(null);
    try {
      const resultat = await accepter.mutateAsync(s.id);
      // Le panneau se ferme avant d'ouvrir la fenêtre de confirmation
      if (idDetail) navigate("/pro/demandes", { replace: true });
      setAcceptation({ resultat, objet: s.extrait });
    } catch (e) {
      const err = e as Partial<ApiErreur>;
      setErreur(
        (err.code && MESSAGES_ERREUR[err.code]) ??
          err.message ??
          "Impossible d'accepter la demande.",
      );
    }
  }

  function onRefuser(s: SollicitationResume) {
    setErreur(null);
    if (idDetail) navigate("/pro/demandes", { replace: true });
    setARefuser(s);
  }

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6"
    >
      <motion.header
        variants={apparition}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Gestion des demandes entrantes
            </h2>
            {enAttente > 0 && (
              <Badge className="gap-1.5 border border-red-200 bg-red-50 text-xs font-semibold text-red-700">
                <span aria-hidden className="size-1.5 rounded-full bg-red-600" />
                {enAttente} à traiter immédiatement
              </Badge>
            )}
          </div>
          <p className="max-w-xl text-sm text-ink/60">
            Scannez, qualifiez l'urgence et décidez en quelques secondes. Les demandes non
            traitées sont réattribuées après expiration du délai garanti.
          </p>
        </div>
        <CarteDisponibilite />
      </motion.header>

      <motion.div variants={apparition} className="border-t border-ink/10 pt-4">
        <OngletsDemandes
          valeur={onglet}
          onChange={changerOnglet}
          compteNouvelles={enAttente}
        />
      </motion.div>

      {erreur && !idDetail && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {erreur}
        </p>
      )}

      {!data ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-ink/5" />
          ))}
        </div>
      ) : data.contenu.length === 0 ? (
        <motion.div
          variants={apparition}
          className="flex min-h-64 flex-col items-center justify-center gap-2 text-center"
        >
          <span className="grid size-12 place-items-center rounded-full bg-ink/5 text-ink/50">
            <IconeVide className="size-6" aria-hidden />
          </span>
          <p className="text-sm font-semibold text-ink">{vide.titre}</p>
          <p className="max-w-xs text-xs text-ink/60">{vide.texte}</p>
        </motion.div>
      ) : (
        <motion.ul
          key={onglet}
          variants={conteneur}
          initial="cache"
          animate="visible"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
          {data.contenu.map((s) => (
            <CarteSollicitation
              key={`${s.id}-${dataUpdatedAt}`}
              s={s}
              maintenant={dataUpdatedAt}
              enCours={enCours === s.id}
              desactive={enCours !== null}
              onAccepter={onAccepter}
              onRefuser={onRefuser}
              onOuvrir={ouvrirDetail}
            />
          ))}
        </motion.ul>
      )}

      {data && data.totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden />
            Précédent
          </Button>
          <span className="text-xs text-ink/60">
            Page {page + 1} sur {data.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page + 1 >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </nav>
      )}

      <PanneauDetailDemande
        id={idDetail ?? null}
        enCours={enCours === idDetail}
        erreur={erreur}
        onFermer={fermerDetail}
        onAccepter={onAccepter}
        onRefuser={onRefuser}
      />
      <DialogRefus sollicitation={aRefuser} onFermer={() => setARefuser(null)} />
      <DialogAcceptation
        acceptation={acceptation}
        restantes={enAttente}
        onFermer={() => setAcceptation(null)}
      />
    </motion.div>
  );
}
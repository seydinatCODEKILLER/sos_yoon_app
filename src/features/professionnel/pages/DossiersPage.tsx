import { useDeferredValue, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, FolderOpen, Search } from "lucide-react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CarteDisponibilite } from "../components/CarteDisponibilite";
import { CarteDossier } from "../components/CarteDossier";
import { DetailDossier } from "../components/DetailDossier";
import { OngletsDossiers } from "../components/OngletsDossiers";
import { useCompteursDossiers, useDossiers } from "../hooks/useDossiers";
import type { FiltreDossiers } from "../types/dossier.types";

export function DossiersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  // /pro/dossiers/:id sélectionne un dossier (liste + détail sur grand écran)
  const { id } = useParams<{ id: string }>();

  const [filtre, setFiltre] = useState<FiltreDossiers>("EN_COURS");
  const [recherche, setRecherche] = useState("");
  const q = useDeferredValue(recherche.trim());
  const [page, setPage] = useState(0);

  const { data } = useDossiers(filtre, q, page);
  const { data: compteurs } = useCompteursDossiers();

  // Sur grand écran, le premier dossier est affiché tant qu'aucun n'est choisi
  // Aucun dossier n'est sélectionné tant que l'utilisateur n'en a pas choisi un
  const idSelectionne = id;
  const afficherListe = !isMobile || !id;
  const afficherDetail = !isMobile || !!id;

  function changerFiltre(valeur: FiltreDossiers) {
    setFiltre(valeur);
    setPage(0);
  }

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6"
    >
      <motion.header
        variants={apparition}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Gestion des dossiers
          </h2>
          <p className="max-w-xl text-sm text-ink/60">
            Suivez l'avancement de vos dossiers et contactez vos clients.
          </p>
        </div>
        <CarteDisponibilite />
      </motion.header>

      {afficherListe && (
        <motion.div
          variants={apparition}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <OngletsDossiers
            valeur={filtre}
            onChange={changerFiltre}
            compteurs={compteurs}
          />
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40"
              aria-hidden
            />
            <Input
              type="search"
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                setPage(0);
              }}
              aria-label="Rechercher un dossier"
              placeholder="Rechercher par client, n° dossier…"
              className="h-10 bg-white pl-9 text-sm"
            />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        {afficherListe && (
          <motion.section
            variants={apparition}
            aria-label="Liste des dossiers"
            className="md:sticky md:top-20 md:max-h-[calc(100dvh-9rem)] md:self-start md:overflow-y-auto md:pr-1"
          >
            {!data ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl bg-ink/5"
                  />
                ))}
              </div>
            ) : data.contenu.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-ink/5 text-ink/50">
                  <FolderOpen className="size-6" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-ink">Aucun dossier</p>
                <p className="max-w-xs text-xs text-ink/60">
                  {q
                    ? "Aucun dossier ne correspond à votre recherche."
                    : "Les demandes que vous acceptez apparaîtront ici."}
                </p>
              </div>
            ) : (
              <motion.ul
                key={`${filtre}-${q}-${page}`}
                variants={conteneur}
                initial="cache"
                animate="visible"
                className="space-y-3"
              >
                {data.contenu.map((d) => (
                  <CarteDossier
                    key={d.demandeId}
                    dossier={d}
                    selectionne={!isMobile && d.demandeId === idSelectionne}
                  />
                ))}
              </motion.ul>
            )}

            {data && data.totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-4 flex items-center justify-center gap-3"
              >
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
                  {page + 1} / {data.totalPages}
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
          </motion.section>
        )}

        {afficherDetail && (
          <section aria-label="Détail du dossier" className="min-w-0">
            {idSelectionne ? (
              <DetailDossier
                key={idSelectionne}
                demandeId={idSelectionne}
                onRetour={
                  isMobile ? () => navigate("/pro/dossiers") : undefined
                }
              />
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/15 bg-white/50 p-6 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-ink/5 text-ink/50">
                  <FolderOpen className="size-6" aria-hidden />
                </span>
                <p className="text-sm font-semibold text-ink">
                  Aucun dossier sélectionné
                </p>
                <p className="max-w-xs text-xs text-ink/60">
                  Choisissez un dossier dans la liste pour consulter les
                  coordonnées du client et la demande initiale.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </motion.div>
  );
}

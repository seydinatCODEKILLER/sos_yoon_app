import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { RefreshCw, Search, SearchX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { BasculeVue } from "../components/BasculeVue";
import { CompteursDemandes } from "../components/CompteurDemandes";
import { DialogAnnulerDemande } from "../components/DialogAnnulerDemande";
import { DialogQualifierDemande } from "../components/DialogQualifierDemande";
import { DialogReaffecterDemande } from "../components/DialogReaffecterDemande";
import { DialogRelancerDemande } from "../components/DialogRelancerDemande";
import type { ActionDemande } from "../components/ElementsDemande";
import { FicheDemande } from "../components/FicheDemande";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauDemandes } from "../components/TableauDemandes";
import { DEMANDES_ADMIN_KEY, useCompteursDemandes, useDemandesAdmin } from "../hooks/useDemandesAdmin";
import type { DemandeAdmin, FiltreStatutDemande } from "../types/demandes.types";
import { useVueListe } from "../hooks/useVueList";
import { CartesDemandes } from "../components/CarteDemandes";

const TAILLE = 12; // multiple de 2 et de 3 : la grille de cartes n'a jamais de ligne bancale
const ROUTE = "/admin/demandes";

const ITEMS_STATUT: { value: FiltreStatutDemande; label: string }[] = [
  { value: "TOUS", label: "Tous les statuts" },
  { value: "A_QUALIFIER", label: "À qualifier" },
  { value: "EN_RECHERCHE", label: "En recherche" },
  { value: "EN_COURS", label: "En cours" },
  { value: "TERMINEES", label: "Terminées" },
  { value: "ANNULEES", label: "Annulées ou expirées" },
];

interface ActionEnCours {
  type: ActionDemande;
  demande: DemandeAdmin;
}

export default function DemandesAdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [vue, setVue] = useVueListe("demandes", "TABLEAU");

  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreStatutDemande>("TOUS");
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState<ActionEnCours | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursDemandes();
  const { data, isFetching, isError, refetch, dataUpdatedAt } = useDemandesAdmin({
    q,
    statut,
    du,
    au,
    page: page - 1,
    taille: TAILLE,
  });

  const filtresActifs = q !== "" || statut !== "TOUS" || du !== "" || au !== "";

  function reinitialiser() {
    setRecherche("");
    setQ("");
    setStatut("TOUS");
    setDu("");
    setAu("");
    setPage(1);
  }

  function changerStatut(f: FiltreStatutDemande) {
    setStatut(f);
    setPage(1);
  }

  const voir = (d: DemandeAdmin) => navigate(`${ROUTE}/${d.id}`);
  const lancer = (type: ActionDemande, demande: DemandeAdmin) => setAction({ type, demande });
  const fermerAction = () => setAction(null);

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Demandes</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Suivez les demandes des citoyens, qualifiez celles que le système n'a pas pu orienter et reprenez la main
            quand une recherche n'aboutit pas.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            qc.invalidateQueries({ queryKey: DEMANDES_ADMIN_KEY });
            refetch();
          }}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden /> Actualiser
        </Button>
      </motion.header>

      <motion.div variants={apparition}>
        <CompteursDemandes donnees={compteurs} filtre={statut} onFiltre={changerStatut} />
      </motion.div>

      <motion.div variants={apparition} className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Référence, nom ou téléphone…"
            className="pl-9"
            aria-label="Rechercher une demande"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:ml-auto">
          <Select value={statut} onValueChange={(v) => changerStatut((v ?? "TOUS") as FiltreStatutDemande)} items={ITEMS_STATUT}>
            <SelectTrigger className="w-full sm:w-52" aria-label="Filtrer par statut">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_STATUT.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={du}
              max={au || undefined}
              onChange={(e) => {
                setDu(e.target.value);
                setPage(1);
              }}
              aria-label="Reçues à partir du"
              className="w-full sm:w-40"
            />
            <span className="text-sm text-muted-foreground" aria-hidden>
              au
            </span>
            <Input
              type="date"
              value={au}
              min={du || undefined}
              onChange={(e) => {
                setAu(e.target.value);
                setPage(1);
              }}
              aria-label="Reçues jusqu'au"
              className="w-full sm:w-40"
            />
          </div>
          <BasculeVue value={vue} onChange={setVue} />
        </div>
      </motion.div>

      <motion.section variants={apparition} className="overflow-hidden rounded-2xl border border-border bg-card">
        {isError ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Impossible de charger les demandes.{" "}
            <button type="button" onClick={() => refetch()} className="font-medium text-signal underline">
              Réessayer
            </button>
          </div>
        ) : !data ? (
          vue === "TABLEAU" ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )
        ) : data.contenu.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {filtresActifs ? "Aucune demande ne correspond à ces filtres." : "Aucune demande pour le moment."}
            </p>
            {filtresActifs && (
              <Button variant="outline" size="sm" onClick={reinitialiser}>
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(isFetching && "opacity-60 transition-opacity")}>
            {vue === "TABLEAU" ? (
              <TableauDemandes demandes={data.contenu} maintenant={dataUpdatedAt} onVoir={voir} onAction={lancer} />
            ) : (
              <CartesDemandes demandes={data.contenu} maintenant={dataUpdatedAt} onVoir={voir} onAction={lancer} />
            )}
          </div>
        )}

        {data && data.totalElements > 0 && (
          <PaginationAdmin
            page={page}
            taille={TAILLE}
            total={data.totalElements}
            libelle="demandes"
            onChange={setPage}
          />
        )}
      </motion.section>

      <FicheDemande id={id} onFermer={() => navigate(ROUTE)} onAction={lancer} />
      <DialogQualifierDemande cible={action?.type === "qualifier" ? action.demande : null} onFermer={fermerAction} />
      <DialogReaffecterDemande cible={action?.type === "reaffecter" ? action.demande : null} onFermer={fermerAction} />
      <DialogRelancerDemande cible={action?.type === "relancer" ? action.demande : null} onFermer={fermerAction} />
      <DialogAnnulerDemande cible={action?.type === "annuler" ? action.demande : null} onFermer={fermerAction} />
    </motion.div>
  );
}
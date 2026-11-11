import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { RefreshCw, Search, SearchX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { BasculeVue } from "../components/BasculeVue";
import { CartesAbonnements } from "../components/CartesAbonnements";
import { CompteursAbonnements } from "../components/CompteursAbonnements";
import { DialogPaiement } from "../components/DialogPaiement";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauAbonnements } from "../components/TableauAbonnements";
import {
  ABONNEMENTS_ADMIN_KEY,
  useAbonnementsAdmin,
  useCompteursAbonnements,
} from "../hooks/useAbonnementAdmin";
import { useVueListe } from "../hooks/useVueList";
import type { AbonnementAdmin, CiblePaiement, FiltreAbonnement } from "../types/abonnements.types";

const TAILLE = 12;

const ITEMS_STATUT: { value: FiltreAbonnement; label: string }[] = [
  { value: "TOUS", label: "Tous les abonnements" },
  { value: "ECHEANCE_PROCHE", label: "Échéance proche" },
  { value: "ESSAI", label: "En essai" },
  { value: "ACTIF", label: "Actifs" },
  { value: "EXPIRE", label: "Expirés" },
];

export default function AbonnementsAdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [vue, setVue] = useVueListe("abonnements", "TABLEAU");

  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreAbonnement>("TOUS");
  const [page, setPage] = useState(1); // 1-indexé côté interface
  const [cible, setCible] = useState<CiblePaiement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursAbonnements();
  const { data, isFetching, isError, refetch } = useAbonnementsAdmin({
    q,
    statut,
    page: page - 1,
    taille: TAILLE,
  });

  const filtresActifs = q !== "" || statut !== "TOUS";

  function reinitialiser() {
    setRecherche("");
    setQ("");
    setStatut("TOUS");
    setPage(1);
  }

  function changerStatut(f: FiltreAbonnement) {
    setStatut(f);
    setPage(1);
  }

  const voir = (a: AbonnementAdmin) => navigate(`/admin/professionnels/${a.professionnelId}`);

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Abonnements et paiements</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Suivez les essais et les mensualités des professionnels. Les paiements reçus en dehors de la plateforme
            s'enregistrent ici : l'abonnement est prolongé d'un mois.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            qc.invalidateQueries({ queryKey: ABONNEMENTS_ADMIN_KEY });
            refetch();
          }}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden /> Actualiser
        </Button>
      </motion.header>

      <motion.div variants={apparition}>
        <CompteursAbonnements donnees={compteurs} filtre={statut} onFiltre={changerStatut} />
      </motion.div>

      <motion.div variants={apparition} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom du professionnel…"
            className="pl-9"
            aria-label="Rechercher un professionnel"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
          <Select
            value={statut}
            onValueChange={(v) => changerStatut((v ?? "TOUS") as FiltreAbonnement)}
            items={ITEMS_STATUT}
          >
            <SelectTrigger className="w-full sm:w-56" aria-label="Filtrer par état de l'abonnement">
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
          <BasculeVue value={vue} onChange={setVue} />
        </div>
      </motion.div>

      <motion.section variants={apparition} className="overflow-hidden rounded-2xl border border-border bg-card">
        {isError ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Impossible de charger les abonnements.{" "}
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
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )
        ) : data.contenu.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {filtresActifs
                ? "Aucun abonnement ne correspond à ces filtres."
                : "Aucun abonnement pour le moment : ils apparaissent dès qu'un professionnel est validé."}
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
              <TableauAbonnements abonnements={data.contenu} onVoir={voir} onPaiement={setCible} />
            ) : (
              <CartesAbonnements abonnements={data.contenu} onVoir={voir} onPaiement={setCible} />
            )}
          </div>
        )}

        {data && data.totalElements > 0 && (
          <PaginationAdmin
            page={page}
            taille={TAILLE}
            total={data.totalElements}
            libelle="abonnements"
            onChange={setPage}
          />
        )}
      </motion.section>

      <DialogPaiement cible={cible} onFermer={() => setCible(null)} />
    </motion.div>
  );
}
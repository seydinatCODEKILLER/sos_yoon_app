import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Download, RefreshCw, Search, SearchX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { BasculeVue } from "../components/BasculeVue";
import { CartesProfessionnels } from "../components/CartesProfessionnels";
import { CompteursProfessionnels } from "../components/CompteursProfessionnels";
import { DialogRefusDossier } from "../components/DialogRefusDossier";
import { DialogStatutPro } from "../components/DialogStatutPro";
import { FicheProfessionnel } from "../components/FicheProfessionnel";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauProfessionnels } from "../components/TableauProfessionnels";
import {
  PROFESSIONNELS_ADMIN_KEY,
  useCompteursProfessionnels,
  useProfessionnelsAdmin,
} from "../hooks/useProfessionnelsAdmin";
import { useVueListe } from "../hooks/useVueList";
import { METIERS_PRO } from "../lib/professionnels";
import type {
  CiblePro,
  CibleRefus,
  FiltreMetier,
  FiltreStatutPro,
  TypeProfession,
} from "../types/professionnels.types";

const TAILLE = 12;
const ROUTE = "/admin/professionnels";

const ITEMS_METIER = [
  { value: "TOUS", label: "Toutes les professions" },
  ...(Object.keys(METIERS_PRO) as TypeProfession[]).map((t) => ({ value: t, label: METIERS_PRO[t].libelle })),
];

export default function ProfessionnelsAdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [vue, setVue] = useVueListe("professionnels", "TABLEAU");

  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreStatutPro>("TOUS");
  const [metier, setMetier] = useState<FiltreMetier>("TOUS");
  const [page, setPage] = useState(1); // 1-indexé côté interface
  const [cibleStatut, setCibleStatut] = useState<CiblePro | null>(null);
  const [cibleRefus, setCibleRefus] = useState<CibleRefus | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursProfessionnels();
  const { data, isFetching, isError, refetch, dataUpdatedAt } = useProfessionnelsAdmin({
    q,
    statut,
    metier,
    page: page - 1,
    taille: TAILLE,
  });

  const filtresActifs = q !== "" || statut !== "TOUS" || metier !== "TOUS";

  function reinitialiser() {
    setRecherche("");
    setQ("");
    setStatut("TOUS");
    setMetier("TOUS");
    setPage(1);
  }

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Professionnels</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Examinez les pièces des professionnels du droit, instruisez les demandes d'inscription et gérez leurs comptes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              qc.invalidateQueries({ queryKey: PROFESSIONNELS_ADMIN_KEY });
              refetch();
            }}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden /> Actualiser
          </Button>
          <Button variant="outline" disabled title="Bientôt disponible" className="border-signal/30 text-signal">
            <Download className="size-4" aria-hidden /> Exporter la liste
          </Button>
        </div>
      </motion.header>

      <motion.div variants={apparition}>
        <CompteursProfessionnels
          donnees={compteurs}
          filtre={statut}
          onFiltre={(f) => {
            setStatut(f);
            setPage(1);
          }}
        />
      </motion.div>

      <motion.div variants={apparition} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom, téléphone, e-mail…"
            className="pl-9"
            aria-label="Rechercher un professionnel"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
          <Select
            value={metier}
            onValueChange={(v) => {
              setMetier((v ?? "TOUS") as FiltreMetier);
              setPage(1);
            }}
            items={ITEMS_METIER}
          >
            <SelectTrigger className="w-full sm:w-56" aria-label="Filtrer par profession">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_METIER.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
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
            Impossible de charger les professionnels.{" "}
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
              {filtresActifs ? "Aucun professionnel ne correspond à ces filtres." : "Aucun professionnel inscrit pour le moment."}
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
              <TableauProfessionnels
                professionnels={data.contenu}
                maintenant={dataUpdatedAt}
                onVoir={(p) => navigate(`${ROUTE}/${p.id}`)}
                onChangerStatut={setCibleStatut}
              />
            ) : (
              <CartesProfessionnels
                professionnels={data.contenu}
                maintenant={dataUpdatedAt}
                onVoir={(p) => navigate(`${ROUTE}/${p.id}`)}
                onChangerStatut={setCibleStatut}
              />
            )}
          </div>
        )}

        {data && data.totalElements > 0 && (
          <PaginationAdmin
            page={page}
            taille={TAILLE}
            total={data.totalElements}
            libelle="professionnels"
            onChange={setPage}
          />
        )}
      </motion.section>

      <FicheProfessionnel
        id={id}
        onFermer={() => navigate(ROUTE)}
        onChangerStatut={setCibleStatut}
        onRefuser={setCibleRefus}
      />
      <DialogStatutPro cible={cibleStatut} onFermer={() => setCibleStatut(null)} />
      <DialogRefusDossier cible={cibleRefus} onFermer={() => setCibleRefus(null)} />
    </motion.div>
  );
}
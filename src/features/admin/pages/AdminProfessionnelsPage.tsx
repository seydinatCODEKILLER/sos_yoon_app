import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Download, RefreshCw, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { CompteursProfessionnels } from "../components/CompteursProfessionnels";
import { DialogRefusDossier } from "../components/DialogRefusDossier";
import { DialogStatutPro } from "../components/DialogStatutPro";
import { FicheProfessionnel } from "../components/FicheProfessionnel";
import { TableauProfessionnels } from "../components/TableauProfessionnels";
import { PaginationAdmin } from "../components/PaginationAdmin";
import {
  PROFESSIONNELS_ADMIN_KEY,
  useCompteursProfessionnels,
  useProfessionnelsAdmin,
} from "../hooks/useProfessionnelsAdmin";
import { METIERS_PRO } from "../lib/professionnels";
import type {
  CiblePro,
  CibleRefus,
  FiltreMetier,
  FiltreStatutPro,
  TypeProfession,
} from "../types/professionnels.types";

const TAILLE = 6;
const ROUTE = "/admin/professionnels";

const ITEMS_METIER = [
  { value: "TOUS", label: "Tous les métiers (Avocats, Huissiers, Notaires, Juristes)" },
  ...(Object.keys(METIERS_PRO) as TypeProfession[]).map((t) => ({ value: t, label: METIERS_PRO[t].libelle })),
];

export default function ProfessionnelsAdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreStatutPro>("TOUS");
  const [metier, setMetier] = useState<FiltreMetier>("TOUS");
  const [page, setPage] = useState(1); // 1-indexé côté interface
  const [cibleStatut, setCibleStatut] = useState<CiblePro | null>(null);
  const [cibleRefus, setCibleRefus] = useState<CibleRefus | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursProfessionnels();
  const { data, isFetching, isError, refetch } = useProfessionnelsAdmin({
    q,
    statut,
    metier,
    page: page - 1,
    taille: TAILLE,
  });

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">Professionnels</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Répertoire officiel &amp; homologations
            </span>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Supervisez les professionnels du droit agréés, examinez les pièces probatoires et instruisez les demandes d'inscription.
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
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} /> Actualiser
          </Button>
          <Button variant="outline" disabled title="Bientôt disponible" className="border-signal/30 text-signal">
            <Download className="size-4" /> Exporter la liste
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

      <motion.div variants={apparition} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, profession, spécialité, e-mail…"
            className="pl-9"
            aria-label="Rechercher un professionnel"
          />
        </div>
        <Select
          value={metier}
          onValueChange={(v) => {
            setMetier((v ?? "TOUS") as FiltreMetier);
            setPage(1);
          }}
          items={ITEMS_METIER}
        >
          <SelectTrigger className="w-full sm:w-auto sm:min-w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_METIER.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <motion.section variants={apparition} className="overflow-hidden rounded-2xl border border-border bg-card">
        {isError ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Impossible de charger les professionnels.{" "}
            <button onClick={() => refetch()} className="font-medium text-signal underline">Réessayer</button>
          </div>
        ) : !data ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: TAILLE }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data.contenu.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Aucun professionnel ne correspond à votre recherche.
          </div>
        ) : (
          <div className={cn(isFetching && "opacity-60 transition-opacity")}>
            <TableauProfessionnels
              professionnels={data.contenu}
              onVoir={(p) => navigate(`${ROUTE}/${p.id}`)}
              onChangerStatut={setCibleStatut}
            />
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
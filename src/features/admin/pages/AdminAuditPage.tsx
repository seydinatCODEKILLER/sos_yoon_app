import { useState } from "react";
import { motion } from "motion/react";
import { RefreshCw, SearchX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauAudit } from "../components/TableauAudit";
import { AUDIT_ADMIN_KEY, useAuditAdmin } from "../hooks/useAuditAdmin";
import { ITEMS_ACTION, TYPES_CIBLE } from "../lib/audit";

const TAILLE = 20;

export default function AuditAdminPage() {
  const qc = useQueryClient();
  const [action, setAction] = useState("TOUTES");
  const [typeCible, setTypeCible] = useState("TOUS");
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [page, setPage] = useState(1); // 1-indexé côté interface

  const { data, isFetching, isError, refetch } = useAuditAdmin({
    action,
    typeCible,
    du,
    au,
    page: page - 1,
    taille: TAILLE,
  });

  const filtresActifs = action !== "TOUTES" || typeCible !== "TOUS" || du !== "" || au !== "";

  function reinitialiser() {
    setAction("TOUTES");
    setTypeCible("TOUS");
    setDu("");
    setAu("");
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
          <h1 className="text-2xl font-semibold">Journal d'audit</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Toutes les actions sensibles faites par les administrateurs : qui, quand, sur quoi et pourquoi. Le journal
            est en lecture seule.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            qc.invalidateQueries({ queryKey: AUDIT_ADMIN_KEY });
            refetch();
          }}
        >
          <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden /> Actualiser
        </Button>
      </motion.header>

      <motion.div variants={apparition} className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v ?? "TOUTES");
            setPage(1);
          }}
          items={ITEMS_ACTION}
        >
          <SelectTrigger className="w-full xl:w-64" aria-label="Filtrer par action">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_ACTION.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeCible}
          onValueChange={(v) => {
            setTypeCible(v ?? "TOUS");
            setPage(1);
          }}
          items={TYPES_CIBLE}
        >
          <SelectTrigger className="w-full xl:w-56" aria-label="Filtrer par type de cible">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPES_CIBLE.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 xl:ml-auto">
          <Input
            type="date"
            value={du}
            max={au || undefined}
            onChange={(e) => {
              setDu(e.target.value);
              setPage(1);
            }}
            aria-label="À partir du"
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
            aria-label="Jusqu'au"
            className="w-full sm:w-40"
          />
        </div>
      </motion.div>

      <motion.section variants={apparition} className="overflow-hidden rounded-2xl border border-border bg-card">
        {isError ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Impossible de charger le journal.{" "}
            <button type="button" onClick={() => refetch()} className="font-medium text-signal underline">
              Réessayer
            </button>
          </div>
        ) : !data ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data.contenu.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-10 text-center">
            <SearchX className="size-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              {filtresActifs ? "Aucune action ne correspond à ces filtres." : "Aucune action enregistrée pour le moment."}
            </p>
            {filtresActifs && (
              <Button variant="outline" size="sm" onClick={reinitialiser}>
                Effacer les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(isFetching && "opacity-60 transition-opacity")}>
            <TableauAudit entrees={data.contenu} />
          </div>
        )}

        {data && data.totalElements > 0 && (
          <PaginationAdmin
            page={page}
            taille={TAILLE}
            total={data.totalElements}
            libelle="actions"
            onChange={setPage}
          />
        )}
      </motion.section>
    </motion.div>
  );
}
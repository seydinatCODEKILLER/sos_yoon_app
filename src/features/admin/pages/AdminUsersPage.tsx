import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Download, RefreshCw, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { CompteursUtilisateurs } from "../components/CompteursUtilisateurs";
import { DialogChangementStatut } from "../components/DialogChangementStatut";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauUtilisateurs } from "../components/TableauUtilisateurs";
import {
  UTILISATEURS_ADMIN_KEY,
  useCompteursUtilisateurs,
  useUtilisateursAdmin,
} from "../hooks/useUtilisateursAdmin";
import { formaterNombre } from "../lib/formatAdmin";
import type { FiltreStatutUtilisateur, UtilisateurAdmin } from "../types/utilisateurs.types";

const TAILLE = 6;

export default function UtilisateursAdminPage() {
  const qc = useQueryClient();
  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreStatutUtilisateur>("TOUS");
  const [page, setPage] = useState(1);
  const [cible, setCible] = useState<UtilisateurAdmin | null>(null);

  // Recherche différée : évite une requête à chaque frappe
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursUtilisateurs();
  const { data, isFetching, isError, refetch } = useUtilisateursAdmin({ q, statut, page, taille: TAILLE });

  const filtres: { valeur: FiltreStatutUtilisateur; libelle: string; nombre?: number }[] = [
    { valeur: "TOUS", libelle: "Tous", nombre: compteurs?.total },
    { valeur: "ACTIF", libelle: "Actifs", nombre: compteurs?.actifs },
    { valeur: "DESACTIVE", libelle: "Désactivés", nombre: compteurs?.desactives },
  ];

  return (
   <motion.div
  variants={conteneur}
  initial="cache"
  animate="visible"
  className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
>
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Utilisateurs</h1>
            <span className="rounded-full bg-signal/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-signal">
              Répertoire citoyen
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Consultez et gérez les comptes des utilisateurs inscrits sur la plateforme SOS Yoon.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              qc.invalidateQueries({ queryKey: UTILISATEURS_ADMIN_KEY });
              refetch();
            }}
          >
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} /> Actualiser
          </Button>
          <Button variant="outline" disabled title="Bientôt disponible">
            <Download className="size-4" /> Exporter la liste
          </Button>
        </div>
      </motion.header>

      <motion.div variants={apparition}>
        <CompteursUtilisateurs donnees={compteurs} />
      </motion.div>

      <motion.section variants={apparition} className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher par nom, téléphone ou e-mail"
              className="pl-9"
              aria-label="Rechercher un utilisateur"
            />
          </div>
          <div role="tablist" className="inline-flex self-start rounded-xl bg-muted p-1">
            {filtres.map((f) => (
              <button
                key={f.valeur}
                role="tab"
                aria-selected={statut === f.valeur}
                onClick={() => {
                  setStatut(f.valeur);
                  setPage(1);
                }}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  statut === f.valeur ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.libelle}
                {f.nombre !== undefined && (
                  <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">{formaterNombre(f.nombre)}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isError ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Impossible de charger les utilisateurs.{" "}
            <button onClick={() => refetch()} className="font-medium text-signal underline">Réessayer</button>
          </div>
        ) : !data ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: TAILLE }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data.elements.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Aucun utilisateur ne correspond à votre recherche.</div>
        ) : (
          <div className={cn(isFetching && "opacity-60 transition-opacity")}>
            <TableauUtilisateurs utilisateurs={data.elements} onChangerStatut={setCible} />
          </div>
        )}

        {data && data.total > 0 && (
          <PaginationAdmin page={page} taille={TAILLE} total={data.total} onChange={setPage} />
        )}
      </motion.section>

      <DialogChangementStatut utilisateur={cible} onFermer={() => setCible(null)} />
    </motion.div>
  );
}
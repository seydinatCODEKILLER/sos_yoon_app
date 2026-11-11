import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Download, Loader2, RefreshCw, Search, SearchX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { toast } from "@/shared/lib/toast";
import { cn } from "@/shared/lib/utils";
import { utilisateursAdminApi } from "../api/utilisateursAdminApi";
import { BasculeVue } from "../components/BasculeVue";
import { CompteursUtilisateurs } from "../components/CompteursUtilisateurs";
import { DialogChangementStatut } from "../components/DialogChangementStatut";
import { FicheUtilisateur } from "../components/FicheUtilisateur";
import { PaginationAdmin } from "../components/PaginationAdmin";
import { TableauUtilisateurs } from "../components/TableauUtilisateurs";
import {
  UTILISATEURS_ADMIN_KEY,
  useCompteursUtilisateurs,
  useUtilisateursAdmin,
} from "../hooks/useUtilisateursAdmin";
import { useVueListe } from "../hooks/useVueList";
import type {
  CibleUtilisateur,
  FiltreStatutUtilisateur,
  UtilisateurAdmin,
} from "../types/utilisateurs.types";
import { CartesUtilisateurs } from "../components/CartesUtilisateurs";

const TAILLE = 12; // multiple de 2 et de 3 : la grille de cartes n'a jamais de ligne bancale
const ROUTE = "/admin/utilisateurs";

const ITEMS_STATUT: { value: FiltreStatutUtilisateur; label: string }[] = [
  { value: "TOUS", label: "Tous les comptes" },
  { value: "ACTIF", label: "Comptes actifs" },
  { value: "DESACTIVE", label: "Comptes désactivés" },
];

export default function UtilisateursAdminPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [vue, setVue] = useVueListe("utilisateurs", "TABLEAU");

  const [recherche, setRecherche] = useState("");
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState<FiltreStatutUtilisateur>("TOUS");
  const [page, setPage] = useState(1); // 1-indexé côté interface
  const [cible, setCible] = useState<CibleUtilisateur | null>(null);
  const [enExport, setExport] = useState(false);

  // Recherche différée : évite une requête à chaque frappe
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(recherche.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [recherche]);

  const { data: compteurs } = useCompteursUtilisateurs();
  const { data, isFetching, isError, refetch, dataUpdatedAt } = useUtilisateursAdmin({
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

  function changerStatut(f: FiltreStatutUtilisateur) {
    setStatut(f);
    setPage(1);
  }

  const voir = (u: UtilisateurAdmin) => navigate(`${ROUTE}/${u.id}`);

  /** Télécharge le CSV des comptes qui correspondent aux filtres en cours (pas seulement la page affichée). */
  async function exporter() {
    setExport(true);
    try {
      const csv = await utilisateursAdminApi.exporter(q, statut);
      // BOM : sans lui, Excel affiche mal les accents d'un CSV UTF-8.
      const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
      const lien = document.createElement("a");
      const url = URL.createObjectURL(blob);
      lien.href = url;
      lien.download = `utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`;
      lien.click();
      URL.revokeObjectURL(url);
    } catch {
      // Le corps d'erreur d'un téléchargement est un blob illisible : message fixe.
      toast.error("L'export a échoué. Réessayez dans un instant.");
    } finally {
      setExport(false);
    }
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
          <h1 className="text-2xl font-semibold">Utilisateurs</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Retrouvez les citoyens inscrits sur SOS Yoon, consultez leurs demandes et bloquez l'accès d'un compte en
            cas de problème.
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
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden /> Actualiser
          </Button>
          <Button
            variant="outline"
            disabled={enExport}
            onClick={exporter}
            className="border-signal/30 text-signal"
            title={filtresActifs ? "Exporte uniquement les comptes filtrés" : "Exporte tous les comptes"}
          >
            {enExport ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Download className="size-4" aria-hidden />
            )}
            Exporter la liste
          </Button>
        </div>
      </motion.header>

      <motion.div variants={apparition}>
        <CompteursUtilisateurs donnees={compteurs} filtre={statut} onFiltre={changerStatut} />
      </motion.div>

      <motion.div variants={apparition} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom, téléphone, e-mail…"
            className="pl-9"
            aria-label="Rechercher un utilisateur"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:ml-auto">
          <Select
            value={statut}
            onValueChange={(v) => changerStatut((v ?? "TOUS") as FiltreStatutUtilisateur)}
            items={ITEMS_STATUT}
          >
            <SelectTrigger className="w-full sm:w-52" aria-label="Filtrer par statut du compte">
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
            Impossible de charger les utilisateurs.{" "}
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
              {filtresActifs ? "Aucun utilisateur ne correspond à ces filtres." : "Aucun citoyen inscrit pour le moment."}
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
              <TableauUtilisateurs utilisateurs={data.contenu} onVoir={voir} onChangerStatut={setCible} />
            ) : (
              <CartesUtilisateurs
                utilisateurs={data.contenu}
                maintenant={dataUpdatedAt}
                onVoir={voir}
                onChangerStatut={setCible}
              />
            )}
          </div>
        )}

        {data && data.totalElements > 0 && (
          <PaginationAdmin
            page={page}
            taille={TAILLE}
            total={data.totalElements}
            libelle="utilisateurs"
            onChange={setPage}
          />
        )}
      </motion.section>

      <FicheUtilisateur id={id} onFermer={() => navigate(ROUTE)} onChangerStatut={setCible} />
      <DialogChangementStatut cible={cible} onFermer={() => setCible(null)} />
    </motion.div>
  );
}
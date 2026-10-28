import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { Bell, Check, History, Shield, User, type LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { cn } from "@/shared/lib/utils";
import { ID_FORMULAIRE_PROFIL_ADMIN, ProfilAdminForm } from "../components/ProfilAdminForm";
import { SecuriteAdmin } from "../components/SecuriteAdmin";
import { SessionsAdmin } from "../components/SessionsAdmin";
import { useProfilAdmin } from "../hooks/useParametresAdmin";

type Onglet = "general" | "securite" | "sessions";

const ONGLETS: { id: Onglet; libelle: string; icone: LucideIcon }[] = [
  { id: "general", libelle: "Général & Profil", icone: User },
  { id: "securite", libelle: "Sécurité & Accès", icone: Shield },
  { id: "sessions", libelle: "Sessions & Appareils", icone: Bell },
];

export default function ParametresAdminPage() {
  const [onglet, setOnglet] = useState<Onglet>("general");
  const [etat, setEtat] = useState({ modifie: false, enCours: false });
  const onEtat = useCallback((e: { modifie: boolean; enCours: boolean }) => setEtat(e), []);
  const { data: profil, isError, refetch } = useProfilAdmin();

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <motion.header variants={apparition} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">Paramètres</h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Configuration &amp; compte administrateur
            </span>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Gérez les informations de votre compte administrateur et la sécurité d'accès.
          </p>
        </div>

        <div className="flex gap-2">
          {onglet !== "general" && (
            <Button variant="outline" disabled title="Bientôt disponible">
              <History className="size-4" /> Journal d'audit
            </Button>
          )}
          {onglet === "general" && (
            <Button
              type="submit"
              form={ID_FORMULAIRE_PROFIL_ADMIN}
              disabled={!etat.modifie || etat.enCours}
              className="rounded-full"
            >
              <Check className="size-4" />
              {etat.enCours ? "Enregistrement…" : "Enregistrer les modifications"}
            </Button>
          )}
        </div>
      </motion.header>

      <motion.div variants={apparition} role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {ONGLETS.map(({ id, libelle, icone: Icone }) => (
          <button
            key={id}
            role="tab"
            aria-selected={onglet === id}
            onClick={() => setOnglet(id)}
            className={cn(
              "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm transition-colors",
              onglet === id
                ? "border-signal font-medium text-signal"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icone className="size-4" /> {libelle}
          </button>
        ))}
      </motion.div>

      <motion.div variants={apparition}>
        {/* Gardé monté pour ne pas perdre une saisie en cours en changeant d'onglet */}
        <div hidden={onglet !== "general"}>
          {isError ? (
            <p className="text-sm text-muted-foreground">
              Impossible de charger le profil.{" "}
              <button onClick={() => refetch()} className="font-medium text-signal underline">Réessayer</button>
            </p>
          ) : !profil ? (
            <div className="h-96 animate-pulse rounded-3xl bg-muted" />
          ) : (
            <ProfilAdminForm profil={profil} onEtat={onEtat} />
          )}
        </div>
        {onglet === "securite" && <SecuriteAdmin />}
        {onglet === "sessions" && <SessionsAdmin />}
      </motion.div>
    </motion.div>
  );
}
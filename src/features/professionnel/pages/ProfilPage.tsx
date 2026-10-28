import { useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { apparition, conteneur } from "@/shared/lib/animationsPage";
import { ApercuSpecialitesZone } from "../components/ApercuSpecialitesZone";
import { EnteteProfil } from "../components/EnteteProfil";
import { FormulaireInformations } from "../components/FormulaireInformations";
import { PanneauAbonnement } from "../components/PanneauAbonnement";
import { useProfil } from "../hooks/useProfil";

const ONGLETS = [
  { valeur: "informations", libelle: "Informations" },
  { valeur: "specialites", libelle: "Spécialités & zone" },
  { valeur: "abonnement", libelle: "Abonnement" },
] as const;

type Onglet = (typeof ONGLETS)[number]["valeur"];

export function ProfilProPage() {
  const [params, setParams] = useSearchParams();
  const demande = params.get("onglet");
  const onglet: Onglet =
    ONGLETS.find((o) => o.valeur === demande)?.valeur ?? "informations";
  const { data: profil, isError } = useProfil();

  return (
    <motion.div
      variants={conteneur}
      initial="cache"
      animate="visible"
      className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-6"
    >
      <motion.header variants={apparition} className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Mon profil
        </h2>
        <p className="text-sm text-ink/60">
          Vos informations professionnelles, vos spécialités et votre
          abonnement.
        </p>
      </motion.header>

      {isError ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          Impossible de charger votre profil. Réessayez dans un instant.
        </p>
      ) : !profil ? (
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-xl bg-ink/5" />
          <div className="h-64 animate-pulse rounded-xl bg-ink/5" />
        </div>
      ) : (
        <>
          <motion.div variants={apparition}>
            <EnteteProfil
              profil={profil}
              onVoirAbonnement={() =>
                setParams({ onglet: "abonnement" }, { replace: true })
              }
            />
          </motion.div>

          <motion.div
            variants={apparition}
            className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ink/5 p-1"
            role="tablist"
            aria-label="Sections du profil"
          >
            {ONGLETS.map((o) => {
              const actif = o.valeur === onglet;
              return (
                <button
                  key={o.valeur}
                  type="button"
                  role="tab"
                  aria-selected={actif}
                  onClick={() =>
                    setParams({ onglet: o.valeur }, { replace: true })
                  }
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                    actif
                      ? "bg-white text-ink shadow-sm"
                      : "text-ink/65 hover:text-ink"
                  }`}
                >
                  {o.libelle}
                </button>
              );
            })}
          </motion.div>

          <motion.div variants={apparition} role="tabpanel">
            {onglet === "informations" && (
              <FormulaireInformations profil={profil} />
            )}
            {onglet === "specialites" && (
              <ApercuSpecialitesZone profil={profil} />
            )}
            {onglet === "abonnement" && <PanneauAbonnement />}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

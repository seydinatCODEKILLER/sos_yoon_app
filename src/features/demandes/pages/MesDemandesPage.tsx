import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardCheck,
  ClipboardList,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { useCompteursDemandes, useMesDemandes } from "../hooks/useMesDemandes";
import { demandeErrorMessage } from "../lib/demandeErrors";
import { demandeRoutes } from "../lib/demandeRoutes";
import type { FiltreDemandes } from "../types/demande.types";
import { FiltresDemandes } from "../components/FiltresDemandes";
import { MesDemandesVide } from "../components/MesDemandesVide";
import { MesDemandesSquelette } from "../components/MesDemandesSquelette";
import { DemandeEnCoursCard } from "../components/DemandeEnCoursCard";
import {
  DemandeHistoriqueItem,
  HistoriqueListe,
} from "../components/DemandeHistoriqueItem";
import { EtatVide } from "../components/EtatVide";
import { estStatutFinal } from "../lib/demandeStatus";

const VIDES: Record<
  Exclude<FiltreDemandes, "TOUTES">,
  { icone: React.ReactNode; message: string }
> = {
  EN_COURS: {
    icone: <ClipboardList className="size-6" strokeWidth={1.75} />,
    message: "Aucune demande en cours.",
  },
  TERMINEES: {
    icone: <ClipboardCheck className="size-6" strokeWidth={1.75} />,
    message: "Aucune demande terminée.",
  },
  ANNULEES: {
    icone: <XCircle className="size-6" strokeWidth={1.75} />,
    message: "Aucune demande annulée.",
  },
};

export function MesDemandesPage() {
  const [filtre, setFiltre] = useState<FiltreDemandes>("TOUTES");
  const compteurs = useCompteursDemandes();
  const {
    data,
    isPending,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useMesDemandes(filtre);

  const demandes = data?.pages.flatMap((p) => p.contenu) ?? [];
  const ouvertes = demandes.filter((d) => !estStatutFinal(d.statut));
  const closes = demandes.filter((d) => estStatutFinal(d.statut));
  // Sous « Toutes », les demandes closes sont rangées sous un titre « Historique »
  const titreHistorique = filtre === "TOUTES" && ouvertes.length > 0;

  let contenu: React.ReactNode;

  if (isPending) {
    contenu = <MesDemandesSquelette />;
  } else if (error) {
    contenu = (
      <p role="alert" className="py-24 text-center text-sm text-red-600">
        {demandeErrorMessage(error)}
      </p>
    );
  } else if (demandes.length === 0) {
    contenu =
      filtre === "TOUTES" ? (
        <MesDemandesVide />
      ) : (
        <EtatVide
          icone={VIDES[filtre].icone}
          message={VIDES[filtre].message}
          className="py-16"
        />
      );
  } else {
    contenu = (
      <div className="space-y-8">
        {ouvertes.length > 0 && (
          <ul className="space-y-3">
            {ouvertes.map((d) => (
              <li key={d.id}>
                <DemandeEnCoursCard demande={d} />
              </li>
            ))}
          </ul>
        )}

        {closes.length > 0 && (
          <section aria-labelledby={titreHistorique ? "titre-historique" : undefined}>
            {titreHistorique && (
              <h3
                id="titre-historique"
                className="mb-3 text-sm font-semibold text-ink/60"
              >
                Historique
              </h3>
            )}
            <HistoriqueListe>
              {closes.map((d) => (
                <li key={d.id}>
                  <DemandeHistoriqueItem demande={d} />
                </li>
              ))}
            </HistoriqueListe>
          </section>
        )}

        {hasNextPage && (
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mx-auto flex h-11 items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white px-6 text-sm font-semibold text-navy transition-colors hover:bg-ink/3 disabled:opacity-60"
          >
            {isFetchingNextPage && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            Voir plus de demandes
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-3xl flex-col px-5 pt-2 pb-6 md:min-h-0 md:px-10 md:pt-10 md:pb-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] leading-tight font-bold text-navy md:text-[34px]">
            Mes demandes
          </h2>
          <p className="mt-1.5 max-w-sm text-[14px] leading-snug text-ink/60">
            Suivez vos demandes et contactez votre professionnel.
          </p>
        </div>
        <Link
          to={demandeRoutes.nouvelle}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-signal px-4 text-sm font-semibold text-paper shadow-[0_6px_18px_rgba(249,97,13,0.3)] transition hover:brightness-105"
        >
          <Plus className="size-4" aria-hidden />
          <span className="max-md:sr-only">Nouvelle demande</span>
          <span className="md:hidden" aria-hidden>
            Nouvelle
          </span>
        </Link>
      </header>

      <div className="mt-6">
        <FiltresDemandes
          value={filtre}
          onChange={setFiltre}
          compteurs={compteurs.data}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">{contenu}</div>
    </div>
  );
}
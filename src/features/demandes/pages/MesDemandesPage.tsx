import { useState } from "react";
import { ClipboardCheck, ClipboardList, Loader2 } from "lucide-react";
import { useMesDemandes } from "../hooks/useMesDemandes";
import { demandeErrorMessage } from "../lib/demandeErrors";
import {
  FiltresDemandes,
  type FiltreDemandes,
} from "../components/FiltresDemandes";
import { MesDemandesVide } from "../components/MesDemandesVide";
import { DemandeEnCoursCard } from "../components/DemandeEnCoursCard";
import { DemandeHistoriqueItem } from "../components/DemandeHistoriqueItem";
import { EtatVide } from "../components/EtatVide";



/** Nombre de demandes passées montrées dans l'onglet « En cours » */
const HISTORIQUE_RECENT = 3;

export function MesDemandesPage() {
  const [filtre, setFiltre] = useState<FiltreDemandes>("EN_COURS");
  const { data: demandes, isPending, error } = useMesDemandes();

  const enCours = demandes?.filter((d) => d.statut === "EN_COURS") ?? [];
  const terminees = demandes?.filter((d) => d.statut !== "EN_COURS") ?? [];

  const afficheEnCours = filtre !== "TERMINEES";
  const historique =
    filtre === "EN_COURS" ? terminees.slice(0, HISTORIQUE_RECENT) : terminees;
  const titreHistorique =
    filtre === "EN_COURS" ? "Historique récent" : "Historique";

  let contenu: React.ReactNode;

  if (isPending) {
    contenu = (
      <div className="flex flex-1 items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-ink/40" aria-label="Chargement" />
      </div>
    );
  } else if (error || !demandes) {
    contenu = (
      <p role="alert" className="py-24 text-center text-sm text-red-600">
        {demandeErrorMessage(error)}
      </p>
    );
  } else if (demandes.length === 0) {
    contenu = <MesDemandesVide />;
  } else {
    contenu = (
      <div className="space-y-6">
        {afficheEnCours &&
          (enCours.length > 0 ? (
            <ul className="space-y-3">
              {enCours.map((d) => (
                <li key={d.id}>
                  <DemandeEnCoursCard demande={d} />
                </li>
              ))}
            </ul>
          ) : (
            filtre === "EN_COURS" && (
              <EtatVide
                icone={<ClipboardList className="size-6" strokeWidth={1.75} />}
                message="Aucune demande en cours."
              />
            )
          ))}

        {historique.length > 0 && (
          <section aria-labelledby="titre-historique">
            <h3
              id="titre-historique"
              className="mb-3 text-xs font-bold tracking-wider text-ink/50 uppercase"
            >
              {titreHistorique}
            </h3>
            <ul className="space-y-3">
              {historique.map((d) => (
                <li key={d.id}>
                  <DemandeHistoriqueItem demande={d} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {filtre === "TERMINEES" && terminees.length === 0 && (
          <EtatVide
            icone={<ClipboardCheck className="size-6" strokeWidth={1.75} />}
            message="Aucune demande terminée."
            className="py-16"
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-3xl flex-col px-5 pt-2 pb-6 md:min-h-0 md:px-10 md:pt-10 md:pb-12">
      <header>
        <h2 className="text-[28px] leading-tight font-bold text-navy md:text-[34px]">
          Mes demandes
        </h2>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/60">
          Suivi de vos dossiers juridiques et interventions en direct
        </p>
      </header>

      <div className="mt-5">
        <FiltresDemandes
          value={filtre}
          onChange={setFiltre}
          enCours={enCours.length}
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">{contenu}</div>
    </div>
  );
}
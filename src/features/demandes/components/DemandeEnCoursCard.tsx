import { Link } from "react-router-dom";
import { ChevronRight, MapPin, Mic } from "lucide-react";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import type { DemandeResume } from "../types/demande.types";
import { demandeRoutes } from "../lib/demandeRoutes";
import { initiales, nomCourt } from "../lib/contactProfessionnel";
import { formatDateDemande } from "../lib/formatDateDemande";
import { formatHorloge } from "../lib/formatDuration";
import { etatDemande, NB_ETAPES, TONS } from "../lib/statutDemandeUi";
import { DemandeIcone } from "./DemandeIcone";
import { MiniProgression } from "./MiniProgression";

/** Ce que le professionnel affecté montre dans la carte */
function ProfessionnelAffecte({
  professionnel,
}: {
  professionnel: NonNullable<DemandeResume["professionnel"]>;
}) {
  const photo = mediaUrl(professionnel.photoUrl);
  return (
    <div className="flex items-center gap-2.5">
      {photo ? (
        <img src={photo} alt="" className="size-8 rounded-full object-cover" />
      ) : (
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-navy text-xs font-semibold text-paper"
        >
          {initiales(professionnel.nomComplet)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">
          {nomCourt(professionnel.nomComplet)} a accepté
        </p>
        {(professionnel.specialiteDominante || professionnel.titre) && (
          <p className="truncate text-xs text-ink/55">
            {professionnel.specialiteDominante ?? professionnel.titre}
          </p>
        )}
      </div>
    </div>
  );
}

/** Demande encore ouverte : une vraie carte, avec l'étape en cours */
export function DemandeEnCoursCard({ demande }: { demande: DemandeResume }) {
  const etat = etatDemande(demande);
  const ton = TONS[etat.ton];
  const urgent = demande.niveauUrgence === "URGENT";

  return (
    <Link
      to={demandeRoutes.suivi(demande.id)}
      className="group block rounded-2xl border border-ink/10 bg-white p-4 shadow-sm outline-none transition hover:border-ink/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-signal/40"
    >
      <div className="flex items-start gap-3">
        <DemandeIcone typeSaisie={demande.typeSaisie} urgent={urgent} />

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs text-ink/50">
            <span className="tabular-nums">{demande.reference}</span>
            {urgent && (
              <span className="rounded-md bg-signal/10 px-1.5 py-px font-semibold text-signal">
                Urgent
              </span>
            )}
          </p>
          <p className="mt-0.5 line-clamp-2 text-base leading-snug font-bold text-navy">
            {demande.titre ?? "Demande d'aide"}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-ink/60">
            <span>{formatDateDemande(demande.dateCreation)}</span>
            {demande.libelleLocalisation && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {demande.libelleLocalisation}
              </span>
            )}
            {demande.typeSaisie === "VOCAL" && demande.dureeAudioSecondes && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Mic className="size-3.5" aria-hidden />
                {formatHorloge(demande.dureeAudioSecondes)}
              </span>
            )}
          </p>
        </div>

        <ChevronRight
          aria-hidden
          className="mt-3 size-5 shrink-0 text-ink/30 transition-transform group-hover:translate-x-0.5"
        />
      </div>

      {/* État courant : le professionnel s'il a accepté, sinon l'étape de la recherche */}
      <div className={`mt-4 rounded-xl px-3 py-2.5 ${ton.fond}`}>
        {demande.professionnel && etat.etape === 3 ? (
          <ProfessionnelAffecte professionnel={demande.professionnel} />
        ) : (
          <p className={`flex items-center gap-2 text-sm font-semibold ${ton.texte}`}>
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${ton.plein} ${
                etat.ton === "actif" ? "animate-pulse" : ""
              }`}
            />
            {etat.libelle}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <MiniProgression etat={etat} />
        </div>
        <span className="text-xs tabular-nums text-ink/45">
          {etat.etape}/{NB_ETAPES}
        </span>
      </div>
    </Link>
  );
}
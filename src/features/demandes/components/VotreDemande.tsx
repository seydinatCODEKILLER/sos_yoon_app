import { ChevronDown, FileText, Mic } from "lucide-react";
import { mediaUrl } from "@/shared/lib/mediaUrl";
import type { DemandeDetail } from "../types/demande.types";
import { useDemandeDetail } from "../hooks/useDemandeDetail";
import { useMotsClesFrequents } from "../hooks/useMotsClesFrequents";
import { formatDateComplete } from "../lib/formatDateDemande";
import { formatHorloge } from "../lib/formatDuration";

/** "EXPULSION_LOCATIVE" → "Expulsion locative" */
const lisible = (code: string) => {
  const t = code.replace(/_/g, " ").toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-[13px] text-ink/55">{libelle}</dt>
      <dd className="text-right text-sm font-medium text-ink">{valeur}</dd>
    </div>
  );
}

function Contenu({ demande }: { demande: DemandeDetail }) {
  const { data: frequents } = useMotsClesFrequents();
  const libelleMotCle = (code: string) =>
    frequents?.find((m) => m.motCle === code)?.libelle ?? lisible(code);

  const audio = demande.audio;
  const motsCles = demande.motsCles ?? [];
  const metiers = (demande.metiersRequis ?? []).map(lisible).join(", ");
  const dateEnvoi = demande.dateEnvoi ?? demande.dateCreation;

  const lignes = [
    demande.matiere && { libelle: "Domaine", valeur: demande.matiere.libelle },
    metiers && { libelle: "Professionnel recherché", valeur: metiers },
    demande.niveauUrgence === "URGENT" && {
      libelle: "Urgence",
      valeur: "Urgent",
    },
    demande.localisation?.libelle && {
      libelle: "Lieu",
      valeur: demande.localisation.libelle,
    },
    { libelle: "Envoyée le", valeur: formatDateComplete(dateEnvoi) },
  ].filter((l): l is { libelle: string; valeur: string } => !!l);

  return (
    <div className="space-y-4">
      {audio && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-ink/60">
            <Mic className="size-3.5" aria-hidden />
            Message vocal
            <span className="tabular-nums">
              · {formatHorloge(audio.dureeSecondes)}
            </span>
          </p>
          <audio
            controls
            preload="metadata"
            src={mediaUrl(audio.url) ?? undefined}
            className="h-11 w-full"
          />
        </div>
      )}

      {demande.description && (
        <div>
          {audio && (
            <p className="mb-2 flex items-center gap-1.5 text-[13px] font-medium text-ink/60">
              <FileText className="size-3.5" aria-hidden />
              Texte
            </p>
          )}
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink">
            {demande.description}
          </p>
        </div>
      )}

      {demande.transcription && (
        <div>
          <p className="mb-1 text-[13px] font-medium text-ink/60">
            Transcription
          </p>
          <p className="text-sm leading-relaxed whitespace-pre-line text-ink/80">
            {demande.transcription}
          </p>
        </div>
      )}

      {motsCles.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Mots-clés">
          {motsCles.map((m) => (
            <li
              key={m}
              className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink/70"
            >
              {libelleMotCle(m)}
            </li>
          ))}
        </ul>
      )}

      <dl className="divide-y divide-ink/8 border-t border-ink/8">
        {lignes.map((l) => (
          <Ligne key={l.libelle} {...l} />
        ))}
      </dl>
    </div>
  );
}

interface VotreDemandeProps {
  demandeId: string;
  /** Replié par défaut (écrans de suivi en direct) ; déplié sinon (demande close) */
  repliable?: boolean;
}

/** « Votre demande » : ce que le citoyen a envoyé, relu depuis le serveur */
export function VotreDemande({ demandeId, repliable = false }: VotreDemandeProps) {
  const { data, isPending, error } = useDemandeDetail(demandeId);

  const corps = isPending ? (
    <div role="status" aria-label="Chargement" className="animate-pulse space-y-2">
      <span className="block h-4 w-full rounded bg-ink/8" />
      <span className="block h-4 w-4/5 rounded bg-ink/8" />
      <span className="block h-4 w-2/5 rounded bg-ink/6" />
    </div>
  ) : error || !data ? (
    <p className="text-sm text-ink/55">
      Impossible d'afficher le détail de votre demande pour le moment.
    </p>
  ) : (
    <Contenu demande={data} />
  );

  const carte =
    "rounded-2xl border border-ink/10 bg-white shadow-sm";

  if (repliable) {
    return (
      <details className={`group ${carte}`}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-navy outline-none focus-visible:ring-2 focus-visible:ring-signal/40 [&::-webkit-details-marker]:hidden">
          Voir ma demande
          <ChevronDown
            aria-hidden
            className="size-5 text-ink/40 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-t border-ink/8 px-4 pt-4 pb-3">{corps}</div>
      </details>
    );
  }

  return (
    <section aria-labelledby="votre-demande-titre" className={`${carte} p-4`}>
      <h3
        id="votre-demande-titre"
        className="mb-3 text-[15px] font-semibold text-navy"
      >
        Votre demande
      </h3>
      {corps}
    </section>
  );
}
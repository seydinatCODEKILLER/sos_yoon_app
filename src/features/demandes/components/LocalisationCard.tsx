import { Check, Loader2, MapPin, Navigation } from "lucide-react";
import { ZoneAutocomplete } from "@/features/profil/components/ZoneAutocomplete";
import type { LocalisationPartagee } from "../hooks/useLocalisationPartagee";

export function LocalisationCard({ state }: { state: LocalisationPartagee }) {
  const {
    status,
    localisation,
    partager,
    choisirZone,
    modifier,
    fallback,
    regions,
    zones,
    zonesUtilisables,
    regionId,
    setRegionId,
    setRecherche,
  } = state;
  const shared = status === "shared" && localisation;

  return (
    <section
      aria-labelledby="localisation-titre"
      className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-ink/70" aria-hidden />
        <h3
          id="localisation-titre"
          className="text-[15px] font-semibold text-navy"
        >
          Où êtes-vous ?
        </h3>
      </div>

      {shared ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
            <Check className="size-4" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-emerald-900">
              Position partagée
            </p>
            <p className="truncate text-xs text-emerald-800/70">
              {localisation.libelle}
            </p>
          </div>
          <button
            type="button"
            onClick={modifier}
            className="text-xs font-semibold text-emerald-900 underline underline-offset-4"
          >
            Modifier
          </button>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Nous en avons besoin pour trouver un professionnel proche de vous.
            Elle n'est utilisée que pour cette demande.
          </p>

          {fallback && (
            <div className="mt-3 space-y-2 rounded-xl bg-ink/4 p-3">
              <p className="text-xs text-ink/70">
                {status === "denied"
                  ? "La géolocalisation est désactivée. Indiquez votre zone :"
                  : "Impossible de vous localiser. Indiquez votre zone :"}
              </p>
              <select
                aria-label="Région"
                value={regionId ?? ""}
                onChange={(e) => setRegionId(e.target.value || null)}
                className="h-11 w-full rounded-lg border border-input bg-white px-3 text-sm"
              >
                <option value="" disabled>
                  {regions.isLoading ? "Chargement…" : "Sélectionnez votre région"}
                </option>
                {regions.data?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nom}
                  </option>
                ))}
              </select>
              <ZoneAutocomplete
                id="zone-demande"
                value={null}
                libelleInitial={null}
                zones={zonesUtilisables}
                onChange={(zone) => {
                  if (zone) choisirZone(zone);
                }}
                onRecherche={setRecherche}
                disabled={regionId === null}
                chargement={zones.isFetching}
              />
            </div>
          )}

          <button
            type="button"
            onClick={partager}
            disabled={status === "detecting"}
            className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-sm font-semibold text-paper transition hover:bg-navy/90 active:scale-[0.99] disabled:opacity-70"
          >
            {status === "detecting" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />{" "}
                Localisation…
              </>
            ) : (
              <>
                <Navigation className="size-4" aria-hidden />{" "}
                {fallback ? "Réessayer le GPS" : "Partager ma position"}
              </>
            )}
          </button>
        </>
      )}
    </section>
  );
}
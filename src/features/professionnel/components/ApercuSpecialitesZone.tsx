import { LocateFixed, MapPin, Star } from "lucide-react";
import type { ProfilPro } from "../types/profil.types";

function formaterCoordonnees(lat: number, lng: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

export function ApercuSpecialitesZone({ profil }: { profil: ProfilPro }) {
  const z = profil.zone;
  const aPosition = z?.latitude != null && z?.longitude != null;

  return (
    <div className="space-y-5">
      <section className="space-y-3 rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="text-base font-bold text-ink">Spécialités</h3>
        <p className="text-sm text-ink/60">
          Elles décident des demandes qui vous sont proposées. La spécialité dominante est prioritaire.
        </p>
        <ul className="flex flex-wrap gap-2">
          {profil.specialites.map((s) => (
            <li
              key={s.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                s.dominante ? "bg-signal/10 text-signal" : "bg-ink/5 text-ink/70"
              }`}
            >
              {s.dominante && <Star className="size-3 fill-current" aria-hidden />}
              {s.libelle}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-ink/10 bg-white p-5">
        <h3 className="text-base font-bold text-ink">Zone d'intervention</h3>
        {z ? (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-ink">
              <MapPin className="size-4 text-signal" aria-hidden />
              {z.region} · rayon de {z.rayonKm} km
            </p>
            {aPosition && (
              <p className="flex items-center gap-2 text-xs text-ink/60">
                <LocateFixed className="size-4 text-ink/40" aria-hidden />
                Position :{" "}
                <span className="font-mono">
                  {formaterCoordonnees(z.latitude as number, z.longitude as number)}
                </span>
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-ink/60">Aucune zone renseignée.</p>
        )}
      </section>

      <p className="rounded-lg bg-ink/5 px-4 py-3 text-xs text-ink/60">
        La modification des spécialités et de la zone sera disponible prochainement.
      </p>
    </div>
  );
}
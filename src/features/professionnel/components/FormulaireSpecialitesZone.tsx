import { useState } from "react";
import { CircleAlert, CircleCheck, Loader2, LocateFixed, MapPin, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "@/shared/lib/toast";
import { useSpecialites } from "@/features/auth/hooks/useSpecialite";
import { useRegions } from "@/features/profil/hooks/useReferentielsProfil";
import { useMettreAJourSpecialites, useMettreAJourZone } from "../hooks/useProfilEdition";
import { messageEspacePro } from "../lib/erreurSollicitation";
import type { ProfilPro } from "../types/profil.types";

const carte = "space-y-4 rounded-xl border border-ink/10 bg-white p-5";
const SELECT_TRIGGER_CLASS =
  "h-10 w-full rounded-lg border-ink/10 bg-white px-3 text-sm focus-visible:border-signal focus-visible:ring-signal/20";

function Pied({
  erreur,
  enregistre,
  modifie,
  enCours,
  desactive,
  onAnnuler,
}: {
  erreur: string | null;
  enregistre: boolean;
  modifie: boolean;
  enCours: boolean;
  desactive: boolean;
  onAnnuler: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
      {erreur && (
        <p role="alert" className="flex items-center gap-2 text-sm text-red-600 sm:mr-auto">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {erreur}
        </p>
      )}
      {enregistre && !modifie && !erreur && (
        <p role="status" className="flex items-center gap-2 text-sm text-emerald-700 sm:mr-auto">
          <CircleCheck className="size-4" aria-hidden />
          Modifications enregistrées.
        </p>
      )}
      <Button type="button" variant="outline" disabled={!modifie || enCours} onClick={onAnnuler}>
        Annuler
      </Button>
      <Button
        type="submit"
        disabled={!modifie || enCours || desactive}
        className="bg-signal font-semibold text-white hover:bg-signal/90"
      >
        {enCours ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </div>
  );
}

/* ── Spécialités (spec 11.3) ─────────────────────────────────── */

function SectionSpecialites({ profil }: { profil: ProfilPro }) {
  const referentiel = useSpecialites();
  const maj = useMettreAJourSpecialites();

  const idsInitiaux = profil.specialites.map((s) => s.id);
  const dominanteInitiale =
    profil.specialites.find((s) => s.dominante)?.id ?? idsInitiaux[0] ?? null;

  // null = pas encore touché : on affiche ce que le serveur a enregistré
  const [choix, setChoix] = useState<string[] | null>(null);
  const [domChoisie, setDomChoisie] = useState<string | null | undefined>(undefined);

  const ids = choix ?? idsInitiaux;
  const demandee = domChoisie === undefined ? dominanteInitiale : domChoisie;
  const dominante = demandee && ids.includes(demandee) ? demandee : (ids[0] ?? null);

  const modifie =
    [...ids].sort().join() !== [...idsInitiaux].sort().join() || dominante !== dominanteInitiale;

  function basculer(id: string) {
    maj.reset();
    setChoix(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }

  function annuler() {
    maj.reset();
    setChoix(null);
    setDomChoisie(undefined);
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (ids.length === 0) return;
    maj.reset();
    try {
      await maj.mutateAsync({ specialiteIds: ids, specialiteDominanteId: dominante });
      setChoix(null);
      setDomChoisie(undefined);
    } catch {
      /* lue via maj.error */
    }
  }

  const libelles = new Map((referentiel.data ?? []).map((s) => [s.id, s.libelle]));

  return (
    <form onSubmit={enregistrer} noValidate className={carte}>
      <div>
        <h3 className="text-base font-bold text-ink">Spécialités</h3>
        <p className="mt-1 text-sm text-ink/60">
          Elles décident des demandes qui vous sont proposées. La spécialité dominante est
          prioritaire.
        </p>
      </div>

      {referentiel.isPending && (
        <p className="flex items-center gap-2 text-xs text-ink/50">
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          Chargement des spécialités…
        </p>
      )}
      {referentiel.isError && (
        <p className="text-xs text-red-600">
          Impossible de charger les spécialités.{" "}
          <button
            type="button"
            onClick={() => void referentiel.refetch()}
            className="font-semibold underline"
          >
            Réessayer
          </button>
        </p>
      )}

      <ul className="flex flex-wrap gap-2" aria-label="Spécialités disponibles">
        {referentiel.data?.map((s) => {
          const coche = ids.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={coche}
                disabled={maj.isPending}
                onClick={() => basculer(s.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  coche
                    ? "border-signal bg-signal/10 text-signal"
                    : "border-ink/10 bg-white text-ink/65 hover:border-ink/25"
                }`}
              >
                {s.libelle}
              </button>
            </li>
          );
        })}
      </ul>

      {ids.length === 0 && (
        <p role="alert" className="text-sm text-red-600">
          Choisissez au moins une spécialité : sans elle, aucune demande ne peut vous être proposée.
        </p>
      )}

      {ids.length > 1 && (
        <div className="space-y-2 border-t border-ink/10 pt-4">
          <p className="text-sm font-medium text-ink">Spécialité dominante</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Spécialité dominante">
            {ids.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={dominante === id}
                disabled={maj.isPending}
                onClick={() => {
                  maj.reset();
                  setDomChoisie(id);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-signal ${
                  dominante === id ? "bg-navy text-white" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                }`}
              >
                {dominante === id && <Star className="size-3 fill-current" aria-hidden />}
                {libelles.get(id) ?? profil.specialites.find((s) => s.id === id)?.libelle ?? id}
              </button>
            ))}
          </div>
        </div>
      )}

      <Pied
        erreur={maj.isError ? messageEspacePro(maj.error, "Enregistrement impossible.") : null}
        enregistre={maj.isSuccess}
        modifie={modifie}
        enCours={maj.isPending}
        desactive={ids.length === 0}
        onAnnuler={annuler}
      />
    </form>
  );
}

/* ── Zone d'intervention (spec 11.4) ─────────────────────────── */

function formaterCoordonnees(lat: number, lng: number) {
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
}

function SectionZone({ profil }: { profil: ProfilPro }) {
  const regions = useRegions();
  const maj = useMettreAJourZone();
  const zone = profil.zone;

  // Le profil donne le nom de la région, pas son identifiant
  const regionInitiale = regions.data?.find((r) => r.nom === zone?.region)?.id ?? "";
  const rayonInitial = String(zone?.rayonKm ?? 15);

  const [regionChoisie, setRegionChoisie] = useState<string | null>(null);
  const [rayonSaisi, setRayonSaisi] = useState<string | null>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [recherche, setRecherche] = useState(false);

  const regionId = regionChoisie ?? regionInitiale;
  const rayonTexte = rayonSaisi ?? rayonInitial;
  const rayon = Number(rayonTexte);
  const rayonValide = Number.isInteger(rayon) && rayon >= 1 && rayon <= 200;

  const modifie =
    regionId !== regionInitiale || rayonTexte !== rayonInitial || position !== null;

  const lat = position?.lat ?? zone?.latitude ?? null;
  const lng = position?.lng ?? zone?.longitude ?? null;

  function annuler() {
    maj.reset();
    setRegionChoisie(null);
    setRayonSaisi(null);
    setPosition(null);
  }

  function utiliserMaPosition() {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas disponible sur cet appareil");
      return;
    }
    setRecherche(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setRecherche(false);
        maj.reset();
      },
      () => {
        setRecherche(false);
        toast.error(
          "Impossible d'obtenir votre position",
          "Autorisez la localisation dans votre navigateur.",
        );
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function enregistrer(e: React.FormEvent) {
    e.preventDefault();
    if (!regionId || !rayonValide) return;
    maj.reset();
    try {
      await maj.mutateAsync({
        regionId,
        rayonKm: rayon,
        ...(position ? { latitude: position.lat, longitude: position.lng } : {}),
      });
      setRegionChoisie(null);
      setRayonSaisi(null);
      setPosition(null);
    } catch {
      /* lue via maj.error */
    }
  }

  return (
    <form onSubmit={enregistrer} noValidate className={carte}>
      <div>
        <h3 className="text-base font-bold text-ink">Zone d'intervention</h3>
        <p className="mt-1 text-sm text-ink/60">
          Les demandes proches de vous passent en premier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="zone-region" className="text-sm font-medium text-ink">
            Région
          </Label>
          <Select
            value={regionId}
            onValueChange={(v: string | null) => {
              maj.reset();
              if (v) setRegionChoisie(v);
            }}
            disabled={regions.isPending || maj.isPending}
          >
            <SelectTrigger id="zone-region" className={SELECT_TRIGGER_CLASS}>
              {/* Le libellé est donné explicitement : sans cela, la liste n'étant pas
                  encore ouverte, le composant afficherait l'identifiant de la région */}
              <SelectValue
                placeholder={
                  regions.isPending ? "Chargement des régions…" : "Choisissez une région"
                }
              >
                {(valeur: string | null) =>
                  regions.data?.find((r) => r.id === valeur)?.nom ??
                  (regions.isPending ? "Chargement des régions…" : "Choisissez une région")
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {regions.data?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {regions.isError && (
            <p className="text-xs text-red-600">Impossible de charger les régions.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="zone-rayon" className="text-sm font-medium text-ink">
            Rayon d'intervention (km)
          </Label>
          <Input
            id="zone-rayon"
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            value={rayonTexte}
            disabled={maj.isPending}
            aria-invalid={!rayonValide}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              maj.reset();
              setRayonSaisi(e.target.value);
            }}
          />
          {!rayonValide && (
            <p role="alert" className="text-sm text-red-600">
              Indiquez un nombre entier de 1 à 200 km.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-lg bg-ink/5 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm text-ink">
            <MapPin className="size-4 text-signal" aria-hidden />
            {lat !== null && lng !== null ? (
              <span className="font-mono text-xs">{formaterCoordonnees(lat, lng)}</span>
            ) : (
              <span className="text-ink/60">Position non enregistrée</span>
            )}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={recherche || maj.isPending}
            onClick={utiliserMaPosition}
            className="gap-1.5"
          >
            {recherche ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <LocateFixed className="size-3.5" aria-hidden />
            )}
            Utiliser ma position
          </Button>
        </div>
        <p className="text-xs text-ink/55">
          Votre position sert à calculer la distance avec les citoyens. Elle n'est jamais affichée
          publiquement.
        </p>
      </div>

      <Pied
        erreur={maj.isError ? messageEspacePro(maj.error, "Enregistrement impossible.") : null}
        enregistre={maj.isSuccess}
        modifie={modifie}
        enCours={maj.isPending}
        desactive={!regionId || !rayonValide}
        onAnnuler={annuler}
      />
    </form>
  );
}

/** Onglet « Spécialités & zone » : les deux se règlent séparément */
export function FormulaireSpecialitesZone({ profil }: { profil: ProfilPro }) {
  return (
    <div className="space-y-5">
      <SectionSpecialites profil={profil} />
      <SectionZone profil={profil} />
    </div>
  );
}
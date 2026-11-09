import { useId, useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { Zone } from "../types/profil.types";

interface ZoneAutocompleteProps {
  id: string;
  /** id de la zone choisie */
  value: string | null;
  /** Libellé de la zone déjà enregistrée (affiché avant toute recherche) */
  libelleInitial: string | null;
  /** Résultats de la recherche serveur (ou les premières zones de la région) */
  zones: Zone[];
  onChange: (zone: Zone | null) => void;
  /** Appelé à chaque frappe : le parent lance la recherche côté serveur */
  onRecherche: (q: string) => void;
  disabled?: boolean;
  chargement?: boolean;
  placeholder?: string;
}

export function ZoneAutocomplete({
  id,
  value,
  libelleInitial,
  zones,
  onChange,
  onRecherche,
  disabled,
  chargement,
  placeholder = "Rechercher votre quartier",
}: ZoneAutocompleteProps) {
  const listeId = useId();
  // null = pas de saisie en cours : on affiche la zone choisie
  const [saisie, setSaisie] = useState<string | null>(null);
  const [libelleChoisi, setLibelleChoisi] = useState<string | null>(libelleInitial);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(0);

  const libelleAffiche =
    value === null ? "" : (zones.find((z) => z.id === value)?.libelle ?? libelleChoisi ?? "");
  const texte = saisie ?? libelleAffiche;

  const choisir = (zone: Zone) => {
    setLibelleChoisi(zone.libelle);
    onChange(zone);
    setSaisie(null);
    onRecherche("");
    setOuvert(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOuvert(true);
      setActif((i) => Math.min(i + 1, zones.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && ouvert && zones[actif]) {
      e.preventDefault();
      choisir(zones[actif]);
    } else if (e.key === "Escape") {
      setOuvert(false);
      setSaisie(null);
      onRecherche("");
    }
  };

  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45"
        aria-hidden
      />
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={ouvert}
        aria-controls={listeId}
        aria-autocomplete="list"
        aria-activedescendant={
          ouvert && zones[actif] ? `${listeId}-${zones[actif].id}` : undefined
        }
        autoComplete="off"
        disabled={disabled}
        value={texte}
        placeholder={disabled ? "Choisissez d'abord une région" : placeholder}
        onChange={(e) => {
          setSaisie(e.target.value);
          onRecherche(e.target.value);
          setOuvert(true);
          setActif(0);
          if (e.target.value === "") onChange(null);
        }}
        onFocus={() => setOuvert(true)}
        onBlur={() => {
          setOuvert(false);
          setSaisie(null);
          onRecherche("");
        }}
        onKeyDown={onKeyDown}
        className="h-13 w-full rounded-xl border border-ink/10 bg-white pr-12 pl-11 text-[15px] text-ink shadow-sm transition outline-none placeholder:text-ink/30 focus:border-signal/60 focus:ring-2 focus:ring-signal/20 disabled:opacity-60"
      />
      <MapPin
        className={`pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 ${
          value ? "text-emerald-600" : "text-ink/30"
        }`}
        aria-hidden
      />

      {ouvert && !disabled && (
        <ul
          id={listeId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink/10 bg-white py-1 shadow-lg"
        >
          {chargement && zones.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/50">Chargement…</li>
          ) : zones.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/50">Aucune zone trouvée</li>
          ) : (
            zones.map((z, i) => (
              <li
                key={z.id}
                id={`${listeId}-${z.id}`}
                role="option"
                aria-selected={z.id === value}
                // mousedown : évite que le champ perde le focus avant le clic
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choisir(z)}
                className={`cursor-pointer px-4 py-2.5 text-sm ${
                  i === actif ? "bg-ink/5" : ""
                } ${z.id === value ? "font-semibold text-navy" : "text-ink"}`}
              >
                {z.libelle}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
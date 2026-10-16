import { useId, useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { Commune } from "@/features/demandes/types/demande.types";

const normaliser = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

interface ZoneAutocompleteProps {
  id: string;
  communes: Commune[];
  /** id de la commune choisie */
  value: number | null;
  onChange: (communeId: number | null) => void;
  disabled?: boolean;
  chargement?: boolean;
  placeholder?: string;
}

export function ZoneAutocomplete({
  id,
  communes,
  value,
  onChange,
  disabled,
  chargement,
  placeholder = "Rechercher votre quartier",
}: ZoneAutocompleteProps) {
  const listeId = useId();
  // null = pas de saisie en cours : on affiche la zone choisie
  const [saisie, setSaisie] = useState<string | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(0);

  const choisie = communes.find((c) => c.id === value) ?? null;
  const texte = saisie ?? choisie?.nom ?? "";
  const resultats =
    saisie === null || saisie === ""
      ? communes
      : communes.filter((c) => normaliser(c.nom).includes(normaliser(saisie)));

  const choisir = (commune: Commune) => {
    onChange(commune.id);
    setSaisie(null);
    setOuvert(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOuvert(true);
      setActif((i) => Math.min(i + 1, resultats.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActif((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && ouvert && resultats[actif]) {
      e.preventDefault();
      choisir(resultats[actif]);
    } else if (e.key === "Escape") {
      setOuvert(false);
      setSaisie(null);
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
          ouvert && resultats[actif] ? `${listeId}-${resultats[actif].id}` : undefined
        }
        autoComplete="off"
        disabled={disabled}
        value={texte}
        placeholder={disabled ? "Choisissez d'abord une région" : placeholder}
        onChange={(e) => {
          setSaisie(e.target.value);
          setOuvert(true);
          setActif(0);
          if (e.target.value === "") onChange(null);
        }}
        onFocus={() => setOuvert(true)}
        onBlur={() => {
          setOuvert(false);
          setSaisie(null);
        }}
        onKeyDown={onKeyDown}
        className="h-13 w-full rounded-xl border border-ink/10 bg-white pr-12 pl-11 text-[15px] text-ink shadow-sm transition outline-none placeholder:text-ink/30 focus:border-signal/60 focus:ring-2 focus:ring-signal/20 disabled:opacity-60"
      />
      <MapPin
        className={`pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 ${
          choisie ? "text-emerald-600" : "text-ink/30"
        }`}
        aria-hidden
      />

      {ouvert && !disabled && (
        <ul
          id={listeId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-ink/10 bg-white py-1 shadow-lg"
        >
          {chargement ? (
            <li className="px-4 py-3 text-sm text-ink/50">Chargement…</li>
          ) : resultats.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/50">Aucune zone trouvée</li>
          ) : (
            resultats.map((c, i) => (
              <li
                key={c.id}
                id={`${listeId}-${c.id}`}
                role="option"
                aria-selected={c.id === value}
                // mousedown : évite que le champ perde le focus avant le clic
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choisir(c)}
                className={`cursor-pointer px-4 py-2.5 text-sm ${
                  i === actif ? "bg-ink/5" : ""
                } ${c.id === value ? "font-semibold text-navy" : "text-ink"}`}
              >
                {c.nom}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
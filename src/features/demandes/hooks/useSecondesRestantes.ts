import { useEffect, useState } from "react";
import { parseDateServeur } from "../lib/formatDateDemande";

/** Secondes restantes avant une date ISO (0 une fois dépassée), rafraîchies chaque seconde */
export function useSecondesRestantes(jusquaIso: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!jusquaIso) return null;
  return Math.max(
    0,
    Math.ceil((parseDateServeur(jusquaIso).getTime() - now) / 1000),
  );
}
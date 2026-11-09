import { useEffect, useState } from "react";
import { parseDateServeur } from "../lib/formatDateDemande";

/** Secondes écoulées depuis une date ISO, rafraîchies chaque seconde */
export function useSecondesEcoulees(depuisIso: string | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!depuisIso) return 0;
  return Math.max(
    0,
    Math.floor((now - parseDateServeur(depuisIso).getTime()) / 1000),
  );
}
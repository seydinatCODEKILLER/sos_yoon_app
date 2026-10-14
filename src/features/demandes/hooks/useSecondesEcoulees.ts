import { useEffect, useState } from "react";

/** Secondes écoulées depuis une date ISO, rafraîchies chaque seconde */
export function useSecondesEcoulees(depuisIso: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  return Math.max(0, Math.floor((now - new Date(depuisIso).getTime()) / 1000));
}
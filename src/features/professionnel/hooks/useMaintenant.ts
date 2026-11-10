import { useEffect, useState } from "react";

/** Date courante, rafraîchie chaque minute : fait avancer la ligne « maintenant » de l'agenda */
export function useMaintenant(intervalleMs = 60_000) {
  const [maintenant, setMaintenant] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setMaintenant(new Date()), intervalleMs);
    return () => window.clearInterval(id);
  }, [intervalleMs]);
  return maintenant;
}
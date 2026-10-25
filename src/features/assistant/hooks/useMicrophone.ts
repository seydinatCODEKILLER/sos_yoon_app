import { useCallback, useEffect, useState } from "react";

export type EtatMicro = "a-demander" | "autorise" | "bloque" | "indisponible";

// Pas de getUserMedia : navigateur trop ancien ou page non sécurisée (hors HTTPS)
const MICRO_SUPPORTE =
  typeof navigator !== "undefined" &&
  typeof navigator.mediaDevices?.getUserMedia === "function";

const PERMISSIONS_API =
  typeof navigator !== "undefined" &&
  typeof navigator.permissions?.query === "function";

function depuisPermission(state: PermissionState): EtatMicro {
  if (state === "granted") return "autorise";
  if (state === "denied") return "bloque";
  return "a-demander";
}

export function useMicrophone() {
  const [etat, setEtat] = useState<EtatMicro>(
    MICRO_SUPPORTE ? "a-demander" : "indisponible",
  );
  // Tant que l'état réel n'est pas connu, la page reste invisible (pas de clignotement)
  const [pret, setPret] = useState(!(MICRO_SUPPORTE && PERMISSIONS_API));

  useEffect(() => {
    if (!MICRO_SUPPORTE || !PERMISSIONS_API) return;

    let annule = false;
    let statut: PermissionStatus | null = null;
    const synchroniser = () => {
      if (statut) setEtat(depuisPermission(statut.state));
    };

    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((s) => {
        if (annule) return;
        statut = s;
        synchroniser();
        setPret(true);
        // L'utilisateur peut changer le réglage pendant que la page est ouverte
        s.addEventListener("change", synchroniser);
      })
      .catch(() => {
        // Certains navigateurs (anciens Safari) ne connaissent pas "microphone"
        if (!annule) setPret(true);
      });

    return () => {
      annule = true;
      statut?.removeEventListener("change", synchroniser);
    };
  }, []);

  /** Demande l'accès au micro. Renvoie l'état obtenu. */
  const demander = useCallback(async (): Promise<EtatMicro> => {
    if (!MICRO_SUPPORTE) return "indisponible";
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      // On voulait seulement l'autorisation : on libère le micro tout de suite
      flux.getTracks().forEach((t) => t.stop());
      setEtat("autorise");
      return "autorise";
    } catch (e) {
      const suivant: EtatMicro =
        e instanceof DOMException && e.name === "NotFoundError"
          ? "indisponible"
          : "bloque";
      setEtat(suivant);
      return suivant;
    }
  }, []);

  return { etat, pret, demander };
}
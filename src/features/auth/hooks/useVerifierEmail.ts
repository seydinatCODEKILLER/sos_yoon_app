import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";

export type EtatVerification =
  | { statut: "cours" }
  | { statut: "ok" }
  | { statut: "erreur"; error: unknown };

/**
 * Une seule requête par jeton pour toute la durée de la page : le jeton ne sert
 * qu'une fois (spec 4.2). Elle vit hors du composant, donc le double montage de
 * React en développement (StrictMode) la retrouve au lieu d'en lancer une seconde.
 */
const requetes = new Map<string, Promise<unknown>>();

/** POST /auth/email/verifier : le jeton est valable 24 h */
export function useVerifierEmail(token: string | null): EtatVerification {
  const [etat, setEtat] = useState<EtatVerification>({ statut: "cours" });

  useEffect(() => {
    if (!token) return;
    let actif = true;

    let requete = requetes.get(token);
    if (!requete) {
      requete = authApi.email.verifier({ token });
      requetes.set(token, requete);
    }

    requete.then(
      () => {
        if (actif) setEtat({ statut: "ok" });
      },
      (error: unknown) => {
        if (actif) setEtat({ statut: "erreur", error });
      },
    );

    return () => {
      actif = false;
    };
  }, [token]);

  return etat;
}
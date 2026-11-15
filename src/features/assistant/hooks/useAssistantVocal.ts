import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/shared/lib/toast";
import { creerSession, type SessionVocale } from "../lib/sessionVocale";
import type {
  ActionAssistant,
  EtatAssistant,
} from "../types/assistant.types";

export function useAssistantVocal() {
  const [etat, setEtat] = useState<EtatAssistant>("pret");
  // Dernière action demandée par Soxna (urgence, orientation…). Pas encore affichée.
  const [action, setAction] = useState<ActionAssistant | null>(null);
  const session = useRef<SessionVocale | null>(null);

  // Une session par ouverture de la page, fermée au départ
  useEffect(() => {
    session.current = creerSession({
      onEtat: (suivant) => {
        setEtat(suivant);
        if (suivant === "pret") setAction(null);
      },
      onErreur: (message) => toast.error(message),
      onAction: setAction,
    });
    return () => {
      session.current?.arreter();
      session.current = null;
    };
  }, []);

  /** Ouvre la conversation (micro + connexion). Résout quand elle est prête. */
  const parler = useCallback(async () => {
    await session.current?.demarrer();
  }, []);

  /** Termine la conversation en cours */
  const terminer = useCallback(() => {
    session.current?.terminer();
  }, []);

  return { etat, action, parler, terminer };
}
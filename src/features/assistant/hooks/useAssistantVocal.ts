import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/shared/lib/toast";
import { creerSession, type SessionVocale } from "../lib/sessionVocale";
import type { EtatAssistant } from "../types/assistant.types";

export function useAssistantVocal() {
  const [etat, setEtat] = useState<EtatAssistant>("pret");
  const session = useRef<SessionVocale | null>(null);

  // Une session par ouverture de la page, fermée au départ
  useEffect(() => {
    session.current = creerSession({
      onEtat: setEtat,
      onErreur: (message) => toast.error(message),
    });
    return () => {
      session.current?.arreter();
      session.current = null;
    };
  }, []);

  const parler = useCallback(async () => {
    await session.current?.demarrer();
  }, []);

  const terminer = useCallback(() => {
    session.current?.terminerTour();
  }, []);

  return { etat, parler, terminer };
}
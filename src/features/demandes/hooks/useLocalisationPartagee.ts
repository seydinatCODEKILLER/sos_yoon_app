import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LocalisationPayload } from "../types/demande.types";
import { demandesService } from "../service/demandesService";

export type PartageStatus = "idle" | "detecting" | "shared" | "denied" | "error";

export function useLocalisationPartagee() {
  const [status, setStatus] = useState<PartageStatus>("idle");
  const [localisation, setLocalisation] = useState<LocalisationPayload | null>(null);

  const partager = () => {
    if (!("geolocation" in navigator)) {
      setStatus("denied");
      return;
    }
    setStatus("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalisation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          libelle: "Position actuelle",
        });
        setStatus("shared");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  const choisirCommune = (id: number, nom: string) => {
    setLocalisation({ latitude: null, longitude: null, libelle: nom, communeId: id });
    setStatus("shared");
  };

  const modifier = () => {
    setLocalisation(null);
    setStatus("idle");
  };

  const fallback = status === "denied" || status === "error";
  const communes = useQuery({
    queryKey: ["referentiels", "communes"],
    queryFn: () => demandesService.communes(),
    enabled: fallback,
    staleTime: Infinity,
  });

  return { status, localisation, partager, choisirCommune, modifier, fallback, communes };
}

export type LocalisationPartagee = ReturnType<typeof useLocalisationPartagee>;
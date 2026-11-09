import { useState } from "react";
import {
  useRegions,
  useZones,
} from "@/features/profil/hooks/useReferentielsProfil";
import type { Zone } from "@/features/profil/types/profil.types";
import type { LocalisationPayload } from "../types/demande.types";

export type PartageStatus = "idle" | "detecting" | "shared" | "denied" | "error";

/**
 * Position de la demande (latitude et longitude obligatoires, spec 8.1).
 * 1) GPS du téléphone ;
 * 2) si le GPS est refusé ou indisponible : le citoyen choisit sa zone (région puis quartier),
 *    et on utilise le centre de cette zone comme position approximative.
 */
export function useLocalisationPartagee() {
  const [status, setStatus] = useState<PartageStatus>("idle");
  const [localisation, setLocalisation] = useState<LocalisationPayload | null>(
    null,
  );
  const [regionId, setRegionId] = useState<string | null>(null);
  const [recherche, setRecherche] = useState("");

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
          libelle: "Ma position actuelle",
        });
        setStatus("shared");
      },
      (err) =>
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  /** Repli : une zone du référentiel, avec son centre comme position approximative */
  const choisirZone = (zone: Zone) => {
    if (zone.latitudeCentre == null || zone.longitudeCentre == null) return;
    setLocalisation({
      latitude: zone.latitudeCentre,
      longitude: zone.longitudeCentre,
      libelle: zone.libelle,
    });
    setStatus("shared");
  };

  const modifier = () => {
    setLocalisation(null);
    setStatus("idle");
    setRecherche("");
  };

  const fallback = status === "denied" || status === "error";

  const regions = useRegions(fallback);
  const zones = useZones(regionId, recherche);
  // Une zone sans coordonnées ne permettrait pas d'envoyer la demande
  const zonesUtilisables = (zones.data ?? []).filter(
    (z) => z.latitudeCentre != null && z.longitudeCentre != null,
  );

  return {
    status,
    localisation,
    partager,
    choisirZone,
    modifier,
    fallback,
    regions,
    zones,
    zonesUtilisables,
    regionId,
    setRegionId: (id: string | null) => {
      setRegionId(id);
      setRecherche("");
    },
    setRecherche,
  };
}

export type LocalisationPartagee = ReturnType<typeof useLocalisationPartagee>;
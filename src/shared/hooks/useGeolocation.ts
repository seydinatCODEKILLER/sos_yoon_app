import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  status: "idle" | "requesting" | "granted" | "denied" | "unsupported";
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    status: "idle",
    error: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, status: "unsupported" }));
      return;
    }

    setState((s) => ({ ...s, status: "requesting", error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: "granted",
          error: null,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          status: "denied",
          error: error.message,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  return { ...state, request };
}

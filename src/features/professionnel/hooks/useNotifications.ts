import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Page } from "@/types/api.types";
import { notificationsApi } from "../api/notificationsApi";
import { TAILLE_NOTIFICATIONS } from "../lib/notifications";
import type {
  CompteursNotifications,
  FiltreNotifications,
  Notification,
} from "../types/notification.types";

export const NOTIFICATIONS_KEY = ["pro", "notifications"] as const;
const LISTE_KEY = [...NOTIFICATIONS_KEY, "liste"] as const;
const COMPTEURS_KEY = [...NOTIFICATIONS_KEY, "compteurs"] as const;

const RAFRAICHISSEMENT_MS = 60_000;

export function useNotifications(filtre: FiltreNotifications, page: number) {
  return useQuery({
    queryKey: [...LISTE_KEY, filtre, page],
    queryFn: () => notificationsApi.lister(filtre, page, TAILLE_NOTIFICATIONS),
    placeholderData: keepPreviousData,
    refetchInterval: (q) => (q.state.status === "error" ? false : RAFRAICHISSEMENT_MS),
  });
}

/**
 * Alimente aussi la pastille de la barre latérale, qui est montée pour tous les rôles :
 * `actif` évite d'interroger l'API du professionnel quand l'utilisateur n'en est pas un.
 */
export function useCompteursNotifications(actif = true) {
  return useQuery({
    queryKey: COMPTEURS_KEY,
    queryFn: notificationsApi.compteurs,
    enabled: actif,
    retry: 1,
    refetchInterval: (q) => (q.state.status === "error" ? false : RAFRAICHISSEMENT_MS),
  });
}

/** Passage à « lue » immédiat dans le cache : la pastille et la ligne réagissent sans attendre le réseau. */
export function useMarquerNotificationLue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.marquerLue(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const etaitNonLue = qc
        .getQueriesData<Page<Notification>>({ queryKey: LISTE_KEY })
        .some(([, p]) => p?.contenu.some((n) => n.id === id && !n.lue));

      qc.setQueriesData<Page<Notification>>({ queryKey: LISTE_KEY }, (p) =>
        p
          ? {
              ...p,
              contenu: p.contenu.map((n) => (n.id === id ? { ...n, lue: true } : n)),
            }
          : p,
      );
      if (etaitNonLue) {
        qc.setQueryData<CompteursNotifications>(COMPTEURS_KEY, (c) =>
          c ? { ...c, nonLues: Math.max(0, c.nonLues - 1) } : c,
        );
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useToutMarquerLu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.toutMarquerLu,
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}
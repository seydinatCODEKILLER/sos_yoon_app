import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "@/shared/lib/toast";
import type { Page } from "@/types/api.types";
import { notificationsApi } from "../api/notificationsApi";
import type {
  CompteursNotifications,
  FiltreNotifications,
  Notification,
} from "../types/notification.types";

export const NOTIFICATIONS_KEY = ["notifications"] as const;
const LISTE_KEY = [...NOTIFICATIONS_KEY, "liste"] as const;
const COMPTEURS_KEY = [...NOTIFICATIONS_KEY, "compteurs"] as const;

export const TAILLE_NOTIFICATIONS = 20;
const POLL_MS = 30_000;

/** On cesse d'interroger le serveur tant que la requête échoue. */
const intervalle = (q: { state: { status: string } }) =>
  q.state.status === "error" ? false : POLL_MS;

export function useNotifications(filtre: FiltreNotifications, page: number) {
  return useQuery({
    queryKey: [...LISTE_KEY, filtre, page],
    queryFn: () => notificationsApi.lister(filtre, page, TAILLE_NOTIFICATIONS),
    placeholderData: keepPreviousData,
    refetchInterval: intervalle,
  });
}

/**
 * Compteurs (toutes / non lues) : à utiliser aussi pour la pastille de la cloche.
 * Ne pas déduire le nombre de non lues de la liste : elle est paginée.
 */
export function useCompteursNotifications() {
  return useQuery({
    queryKey: COMPTEURS_KEY,
    queryFn: notificationsApi.compteurs,
    retry: 1,
    refetchInterval: intervalle,
  });
}

/** Passage à « lue » immédiat dans le cache : la ligne et la pastille réagissent sans attendre le réseau. */
export function useMarquerLue() {
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
    onError: () =>
      toast.error("Impossible de marquer les notifications comme lues."),
  });
}
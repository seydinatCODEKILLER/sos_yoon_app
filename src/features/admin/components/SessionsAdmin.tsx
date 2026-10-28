import { LogOut, Monitor, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  useDeconnecterAutresSessions,
  useDeconnecterSession,
  useSessionsAdmin,
} from "../hooks/useParametresAdmin";
import { depuis, estMobile } from "../lib/parametres";

export function SessionsAdmin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const { data: sessions, dataUpdatedAt, isError, refetch } = useSessionsAdmin();
  const deconnecter = useDeconnecterSession();
  const deconnecterAutres = useDeconnecterAutresSessions();

  const autres = sessions?.filter((s) => !s.courante) ?? [];

  function quitter() {
    logout();
    qc.clear();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Sessions et terminaux connectés</h2>
            <p className="text-sm text-muted-foreground">Appareils ayant actuellement accès à votre compte d'administration.</p>
          </div>
          <Button
            variant="outline"
            disabled={autres.length === 0 || deconnecterAutres.isPending}
            onClick={() => deconnecterAutres.mutate()}
            className="shrink-0 border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10"
          >
            Déconnecter toutes les autres sessions
          </Button>
        </div>

        {isError ? (
          <p className="pt-6 text-sm text-muted-foreground">
            Impossible de charger les sessions.{" "}
            <button onClick={() => refetch()} className="font-medium text-signal underline">Réessayer</button>
          </p>
        ) : !sessions ? (
          <div className="space-y-3 pt-6">
            {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {sessions.map((s) => {
              const Icone = estMobile(s.appareil) ? Smartphone : Monitor;
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-border p-4",
                    s.courante && "bg-muted/50",
                  )}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground">
                    <Icone className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{s.appareil}</p>
                      {s.courante && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <span className="size-1.5 rounded-full bg-emerald-500" /> Cette session (active)
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      IP : {s.adresseIp} · {s.courante ? "Dernière activité" : "Dernier accès"} {depuis(s.dernierAcces, dataUpdatedAt)}
                    </p>
                  </div>
                  {s.courante ? (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">Poste de contrôle</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deconnecter.isPending && deconnecter.variables === s.id}
                      onClick={() => deconnecter.mutate(s.id)}
                    >
                      Déconnecter
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Fermer la session actuelle</p>
          <p className="text-xs text-muted-foreground">Terminez votre session de travail en cours sur cet ordinateur.</p>
        </div>
        <Button
          variant="outline"
          onClick={quitter}
          className="shrink-0 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="size-4" /> Se déconnecter de l'instance
        </Button>
      </section>
    </div>
  );
}
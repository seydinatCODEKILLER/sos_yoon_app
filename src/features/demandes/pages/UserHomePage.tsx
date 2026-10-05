import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, FileText, Bell, Mic } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getDemandeStatusInfo } from "../lib/demandeStatus";
import { METIERS } from "../lib/metiers";
import { NOTIFICATION_ICONS } from "@/features/notifications/lib/notificationIcons";
import { useRecentNotifications } from "@/features/notifications/hooks/useRecentNotifications";
import { useRecentDemandes } from "../hooks/useRecentDemandes";

const accentDot = {
  ink: "bg-ink/40",
  brass: "bg-brass",
  signal: "bg-signal",
  red: "bg-red-500",
};

function getMetierLabel(metier: string | null) {
  if (!metier) return "Analyse en cours";
  return METIERS.find((m) => m.value === metier)?.label ?? metier;
}

export function UserHomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: demandes, isLoading: loadingDemandes } = useRecentDemandes();
  const { data: notifData, isLoading: loadingNotifs } = useRecentNotifications();

const demandesEnCours =
  demandes?.filter((d) => getDemandeStatusInfo(d.statut).accent !== "signal")
    .length ?? 0;
  const notifsNonLues = notifData?.items.filter((n) => !n.lu).length ?? 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Salutation */}
      <div className="px-1">
        <p className="text-[15px] text-ink/50">
          Bonjour{user?.prenom ? `, ${user.prenom}` : ""} 👋
        </p>
        <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight text-ink sm:text-[32px]">
          Comment pouvons-nous vous aider ?
        </h1>
      </div>

      {/* Grille bento */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-6">
        {/* CTA principale */}
        <button
          type="button"
          onClick={() => navigate("/app/demandes/nouvelle")}
          className="group relative col-span-1 overflow-hidden rounded-[28px] bg-ink p-7 text-left transition-transform duration-300 hover:-translate-y-0.5 sm:col-span-4"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-[80px]"
            style={{ background: "var(--color-signal)" }}
          />
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal/15 text-signal">
            <Mic className="h-5 w-5" />
          </span>
          <h2 className="mt-8 font-display text-[26px] font-semibold leading-tight text-paper">
            Nouvelle demande
          </h2>
          <p className="mt-2 max-w-[30ch] text-[14px] text-paper/50">
            Vocal, écrit ou chatbot — décrivez votre situation, on s'occupe
            du reste.
          </p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-signal">
            Commencer
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </button>

        {/* Deux stats empilées */}
        <div className="flex flex-col gap-4 sm:col-span-2">
          <button
            type="button"
            onClick={() => navigate("/app/demandes")}
            className="flex flex-1 flex-col justify-center rounded-[28px] bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-ink/6 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal/10 text-signal">
              <FileText className="h-4 w-4" />
            </span>
            <p className="mt-4 font-display text-[28px] font-semibold leading-none text-ink">
              {loadingDemandes ? "—" : demandesEnCours}
            </p>
            <p className="mt-1.5 text-[13px] text-ink/45">
              Demande{demandesEnCours > 1 ? "s" : ""} en cours
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate("/app/notifications")}
            className="flex flex-1 flex-col justify-center rounded-[28px] bg-white p-6 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-ink/6 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brass/15 text-brass">
              <Bell className="h-4 w-4" />
            </span>
            <p className="mt-4 font-display text-[28px] font-semibold leading-none text-ink">
              {loadingNotifs ? "—" : notifsNonLues}
            </p>
            <p className="mt-1.5 text-[13px] text-ink/45">
              Non lue{notifsNonLues > 1 ? "s" : ""}
            </p>
          </button>
        </div>

        {/* Demandes récentes */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-ink/6 sm:col-span-3">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink/40">
              Demandes récentes
            </h2>
            <button
              type="button"
              onClick={() => navigate("/app/demandes")}
              className="text-[13px] font-medium text-signal hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="mt-3">
            {loadingDemandes && (
              <div className="mx-6 mb-5 h-14 animate-pulse rounded-xl bg-ink/4" />
            )}

            {!loadingDemandes && demandes?.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <FileText className="h-5 w-5 text-ink/25" />
                <p className="text-[13px] text-ink/45">
                  Vous n'avez pas encore de demande en cours.
                </p>
              </div>
            )}

            {demandes?.slice(0, 3).map((demande, i, arr) => {
              const status = getDemandeStatusInfo(demande.statut);
              return (
                <button
                  key={demande.id}
                  type="button"
                  onClick={() => navigate(`/app/demandes/${demande.id}`)}
                  className={`flex w-full items-center gap-3 px-6 py-3.5 text-left transition-colors hover:bg-ink/4 ${
                    i > 0 ? "border-t border-ink/6" : ""
                  } ${i === arr.length - 1 ? "pb-5" : ""}`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${accentDot[status.accent]}`}
                  />
                  <span className="flex-1">
                    <span className="block text-[14px] font-medium text-ink">
                      {getMetierLabel(demande.metierIdentifie)}
                    </span>
                    <span className="block text-[13px] text-ink/45">
                      {status.label}
                    </span>
                  </span>
                  <span className="text-[12px] text-ink/35">
                    {formatDistanceToNow(new Date(demande.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications récentes */}
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-ink/6 sm:col-span-3">
          <div className="flex items-center justify-between px-6 pt-5">
            <h2 className="text-[13px] font-medium uppercase tracking-wide text-ink/40">
              Notifications
            </h2>
            <button
              type="button"
              onClick={() => navigate("/app/notifications")}
              className="text-[13px] font-medium text-signal hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="mt-3">
            {loadingNotifs && (
              <div className="mx-6 mb-5 h-14 animate-pulse rounded-xl bg-ink/4" />
            )}

            {!loadingNotifs && notifData?.items.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <Bell className="h-5 w-5 text-ink/25" />
                <p className="text-[13px] text-ink/45">
                  Aucune notification pour le moment.
                </p>
              </div>
            )}

            {notifData?.items.slice(0, 3).map((notif, i, arr) => {
              const { icon: Icon, accent } = NOTIFICATION_ICONS[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-6 py-3.5 ${
                    i > 0 ? "border-t border-ink/6" : ""
                  } ${i === arr.length - 1 ? "pb-5" : ""}`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/4 ${
                      accent === "red" ? "text-red-500" : ""
                    } ${accent === "signal" ? "text-signal" : ""} ${
                      accent === "brass" ? "text-brass" : ""
                    } ${accent === "ink" ? "text-ink/50" : ""}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-ink">
                      {notif.titre}
                    </p>
                    <p className="text-[13px] text-ink/45">{notif.message}</p>
                  </div>
                  {!notif.lu && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
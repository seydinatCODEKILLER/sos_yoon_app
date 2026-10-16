import { PreferencesNotificationsForm } from "../components/PreferencesNotificationsForm";
import { ProfilSousPage } from "../components/ProfilSousPage";
import { usePreferencesNotifications } from "../hooks/usePreferencesNotifications";

export default function PreferencesNotificationsPage() {
  const { data, isLoading, isError } = usePreferencesNotifications();

  return (
    <ProfilSousPage titre="Notifications">
      <h2 className="text-[22px] font-bold text-navy">
        Gestion des notifications
      </h2>
      <p className="mt-2 mb-6 text-[15px] leading-snug text-ink/60">
        Choisissez comment vous souhaitez être averti des avancées de votre
        dossier.
      </p>

      {isLoading && (
        // Même hauteur que le contenu final : pas de décalage
        <div className="h-60 animate-pulse rounded-2xl bg-ink/5" aria-hidden />
      )}
      {isError && (
        <p role="alert" className="text-[14px] text-red-600">
          Impossible de charger vos préférences. Réessayez plus tard.
        </p>
      )}
      {data && <PreferencesNotificationsForm preferences={data} />}
    </ProfilSousPage>
  );
}
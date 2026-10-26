import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronRight,
  KeyRound,
  Loader2,
  LogOut,
  Trash2,
  User,
} from "lucide-react";
import { usePreferencesNotifications } from "../hooks/usePreferencesNotifications";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { initiales } from "@/features/demandes/lib/contactProfessionnel";
import {
  useChangerPhoto,
  useProfil,
  useSupprimerPhoto,
} from "../hooks/useProfil";
import { libelleInscription, masquerTelephone } from "../lib/formatProfil";
import { profilRoutes } from "../lib/profilRoutes";
import { AvatarProfil } from "../components/AvatarProfil";
import { ProfilLigne } from "../components/ProfilLigne";
import { ProfilSection } from "../components/ProfilSection";
import { Button } from "@/shared/components/ui/button";

const ICONE = "size-5";

export function ProfilPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  const { data: profil, isPending, error } = useProfil();
  const changerPhoto = useChangerPhoto();
  const supprimerPhoto = useSupprimerPhoto();
  const { data: preferences } = usePreferencesNotifications();

  const seDeconnecter = () => {
    // On vide le cache pour ne rien laisser des données de cet utilisateur
    queryClient.clear();
    logout();
    navigate("/login", { replace: true });
  };

  let identite: React.ReactNode;

  if (isPending) {
    identite = (
      <div className="flex h-24 items-center">
        <Loader2
          className="size-6 animate-spin text-ink/40"
          aria-label="Chargement"
        />
      </div>
    );
  } else if (error || !profil) {
    identite = (
      <p role="alert" className="py-6 text-sm text-red-600">
        Impossible de charger votre profil.
      </p>
    );
  } else {
    const nomComplet = `${profil.prenom} ${profil.nom}`;
    identite = (
      <div className="flex items-center gap-4">
        <AvatarProfil
          photoUrl={profil.photoUrl}
          initiales={initiales(nomComplet)}
          occupe={changerPhoto.isPending || supprimerPhoto.isPending}
          onFichier={(f) => changerPhoto.mutate(f)}
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-navy">{nomComplet}</p>
          <p className="text-sm text-ink/70 tabular-nums">
            {masquerTelephone(profil.telephone)}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            {libelleInscription(profil.dateInscription)}
          </p>
          {/* Hauteur réservée : pas de décalage quand le lien apparaît */}
          <div className="min-h-5">
            {profil.photoUrl && (
              <button
                type="button"
                onClick={() => supprimerPhoto.mutate()}
                disabled={supprimerPhoto.isPending || changerPhoto.isPending}
                className="text-xs font-medium text-signal hover:underline disabled:opacity-60"
              >
                Retirer la photo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8.5rem)] w-full max-w-3xl flex-col px-5 pt-2 pb-6 md:min-h-0 md:px-10 md:pt-10 md:pb-12">
      <header>
        <h2 className="text-[28px] leading-tight font-bold text-navy md:text-[34px]">
          Profil
        </h2>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/60">
          Accédez aux infos de votre profil
        </p>
      </header>

      <div className="mt-6">{identite}</div>

      {profil && (
        <div className="mt-8 space-y-6">
          <ProfilSection titre="Mes informations">
            <ProfilLigne
              to={profilRoutes.informations}
              icone={<User className={ICONE} />}
              libelle="Nom, e-mail"
              valeur={profil.email ?? "Non renseigné"}
            />
          </ProfilSection>

          <ProfilSection titre="Préférences">
            <ProfilLigne
              to={profilRoutes.notifications}
              icone={<Bell className={ICONE} />}
              libelle="Notifications"
              valeur={
                preferences
                  ? preferences.notificationsPush
                    ? "Activées"
                    : "Désactivées"
                  : ""
              }
            />
          </ProfilSection>

          <ProfilSection titre="Sécurité">
            <ProfilLigne
              to={profilRoutes.codeSecret}
              icone={<KeyRound className={ICONE} />}
              libelle="Code secret"
              valeur="••••"
            />
          </ProfilSection>

          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={seDeconnecter}
              className="group h-14 w-full gap-3 rounded-xl border-navy/15 bg-white text-[15px] font-semibold text-navy shadow-sm hover:bg-navy/5"
            >
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-full bg-navy/8 transition-colors group-hover:bg-navy group-hover:text-paper"
              >
                <LogOut className="size-4" />
              </span>
              Se déconnecter
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => navigate(profilRoutes.supprimer)}
              className="group h-auto w-full justify-start gap-3 rounded-xl px-4 py-3.5 text-left whitespace-normal"
            >
              <span
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-full bg-red-100 text-red-600"
              >
                <Trash2 className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">
                  Supprimer mon compte
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug font-normal opacity-70">
                  Action définitive : vos données seront effacées.
                </span>
              </span>
              <ChevronRight
                aria-hidden
                className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

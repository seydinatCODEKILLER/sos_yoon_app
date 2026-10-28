import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { AppLayout } from "@/layouts/AppLayout";
import { UserHomePage } from "@/features/demandes/pages/UserHomePage";
import { NotFoundPage } from "@/shared/components/NotFoundPage";
import { RootGate } from "@/shared/components/RootGate";
import { PagePlaceholder } from "@/shared/components/PagePlaceholder";
import { RegisterChoicePage } from "@/features/onboarding/pages/RegisterChoicePage";
import { RegisterParticulierPage } from "@/features/auth/pages/RegisterParticulierPage";
import { RegisterProfessionnelPage } from "@/features/auth/pages/RegisterProfessionnelPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { VerifyOtpPage } from "@/features/auth/pages/VerifyOtpPage";
import { DemanderAidePage } from "@/features/demandes/pages/DemanderAidePage";
import { CodeSecretInscriptionPage } from "@/features/auth/pages/CodeSecretInscriptionPage";
import { CodeOubliePage } from "@/features/auth/pages/CodeOubliePage";
import { SuiviDemandePage } from "@/features/demandes/pages/SuiviDemandePage";
import { MesDemandesPage } from "@/features/demandes/pages/MesDemandesPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { ProfilPage } from "@/features/profil/pages/ProfilPage";
import { CodeSecretPage } from "@/features/profil/pages/CodeSecretPage";
import { MesInformationsPage } from "@/features/profil/pages/MesInformationsPage";
import PreferencesNotificationsPage from "@/features/profil/pages/PreferencesNotificationsPage";
import { SupprimerComptePage } from "@/features/profil/pages/SupprimerComptePage";
import { VisiteurLayout } from "@/layouts/VisiteurLayout";
import { EnvoiDemandeEnAttentePage } from "@/features/demandes/pages/EnvoiDemandeEnAttentePage";
import { AssistantPage } from "@/features/assistant/pages/AssistantPage";
import { ValidationDossierPage } from "@/features/professionnel/pages/ValidationDossierPage";
import { DemandeRefuseePage } from "@/features/professionnel/pages/DemandeRefuseePage";
import { ProfilValidePage } from "@/features/professionnel/pages/ProfilValidePage";
import { TableauDeBordPage } from "@/features/professionnel/pages/TableauDeBordPage";
import { DemandesPage } from "@/features/professionnel/pages/DemandesPage";
import { DossiersPage } from "@/features/professionnel/pages/DossiersPage";
import { AgendaPage } from "@/features/professionnel/pages/AgendaPage";
import { NotificationsProfessionnelPage } from "@/features/professionnel/pages/NotificationsPage";
import { AbonnementPage } from "@/features/professionnel/pages/AbonnementPage";
import { ProfilProPage } from "@/features/professionnel/pages/ProfilPage";
import { LoginParticulierPage } from "@/features/auth/pages/LoginParticulierPage";
import { LoginProfessionnelPage } from "@/features/auth/pages/LoginProfessionnelPage";
import { MotDePasseOubliePage } from "@/features/auth/pages/MotDePasseOubliePage";
import { ReinitialiserMotDePassePage } from "@/features/auth/pages/ReinitialiserMotDePassePage";

export const router = createBrowserRouter([
  { path: "/", element: <RootGate /> },

  // ─── Auth (publiques) ───────────────────────────────────────────
  { path: "/login", element: <LoginPage /> },
  { path: "/login/particulier", element: <LoginParticulierPage /> },
  { path: "/login/professionnel", element: <LoginProfessionnelPage /> },
  { path: "/register", element: <RegisterChoicePage /> },
  { path: "/register/particulier", element: <RegisterParticulierPage /> },
  { path: "/register/professionnel", element: <RegisterProfessionnelPage /> },
  { path: "/verification-otp", element: <VerifyOtpPage /> },
  { path: "/code-oublie", element: <CodeOubliePage /> },
  {
    path: "/verification-email",
    element: <PagePlaceholder title="Vérification de l'email" />,
  },

  { path: "/inscription/code-secret", element: <CodeSecretInscriptionPage /> },
  {
    path: "/cgu",
    element: <PagePlaceholder title="Conditions Générales d'Utilisation" />,
  },
  {
    path: "/confidentialite",
    element: <PagePlaceholder title="Politique de Confidentialité" />,
  },
  { path: "/mot-de-passe-oublie", element: <MotDePasseOubliePage /> },
  {
    path: "/reinitialiser-mot-de-passe",
    element: <ReinitialiserMotDePassePage />,
  },

  // ─── Soxna Yoon : avec ou sans compte ───────────────────────────
  { path: "/assistant", element: <AssistantPage /> },

  // ─── Visiteur (sans compte) ─────────────────────────────────────
  {
    element: <VisiteurLayout />,
    children: [
      {
        path: "/demandes/nouvelle",
        element: <DemanderAidePage />,
        handle: { title: "Urgence Juridique" },
      },
    ],
  },

  // ─── Particulier ────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={["PARTICULIER"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/app",
            element: <UserHomePage />,
            handle: { title: "Urgence Juridique" },
          },
          {
            path: "/app/demandes/nouvelle",
            element: <DemanderAidePage />,
            handle: { section: "Demandes d'aide", title: "Urgence Juridique" },
          },
          {
            path: "/app/demandes/envoi",
            element: <EnvoiDemandeEnAttentePage />,
            handle: {
              section: "Demandes d'aide",
              title: "Envoi de la demande",
            },
          },
          {
            path: "/app/demandes",
            element: <MesDemandesPage />,
            handle: { section: "Demandes d'aide", title: "Mes demandes" },
          },
          {
            path: "/app/demandes/:id",
            element: <SuiviDemandePage />,
            handle: {
              section: "Demandes d'aide",
              title: "Suivi de la demande",
            },
          },
          {
            path: "/app/notifications",
            element: <NotificationsPage />,
            handle: { title: "Notifications" },
          },
          {
            path: "/app/profil",
            element: <ProfilPage />,
            handle: { title: "Profil" },
          },
          {
            path: "/app/profil/informations",
            element: <MesInformationsPage />,
          },
          {
            path: "/app/profil/zone",
            element: <PagePlaceholder title="Zone habituelle" />,
          },
          {
            path: "/app/profil/code-secret",
            element: <CodeSecretPage />,
          },
          {
            path: "/app/profil/supprimer",
            element: <SupprimerComptePage />,
          },
          {
            path: "/app/profil/notifications",
            element: <PreferencesNotificationsPage />,
          },
        ],
      },
    ],
  },

  // ─── Professionnel : espace complet (portée COMPLET) ────────────
  {
    element: <ProtectedRoute allowedRoles={["PRO"]} />,
    children: [
      { path: "/pro/profil-valide", element: <ProfilValidePage /> },

      {
        path: "/pro/changer-mot-de-passe",
        element: <PagePlaceholder title="Changer le mot de passe" />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "/pro",
            element: <TableauDeBordPage />,
            handle: { title: "Tableau de bord" },
          },
          {
            path: "/pro/demandes/:id?",
            element: <DemandesPage />,
            handle: { title: "Demandes" },
          },

          {
            path: "/pro/dossiers/:id?",
            element: <DossiersPage />,
            handle: { title: "Dossiers" },
          },
          {
            path: "/pro/agenda",
            element: <AgendaPage />,
            handle: { title: "Agenda" },
          },

          {
            path: "/pro/notifications",
            element: <NotificationsProfessionnelPage />,
            handle: { title: "Notifications" },
          },
          {
            path: "/pro/profil",
            element: <ProfilProPage />,
            handle: { title: "Mon profil" },
          },
          {
            path: "/pro/abonnement",
            element: <AbonnementPage />,
            handle: { title: "Abonnement" },
          },
        ],
      },
    ],
  },

  // ─── Professionnel : états intermédiaires (sans sidebar) ────────
  {
    element: <ProtectedRoute allowedRoles={["PRO"]} requiredPortee="DOSSIER" />,
    children: [
      { path: "/pro/validation", element: <ValidationDossierPage /> },
      { path: "/pro/demande-refusee", element: <DemandeRefuseePage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["PRO"]} requiredPortee="PAIEMENT" />
    ),
    children: [
      {
        path: "/pro/paiement",
        element: <AbonnementPage />,
        handle: { title: "Abonnement" },
      },
    ],
  },

  // ─── Admin ──────────────────────────────────────────────────────
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/admin", element: <PagePlaceholder title="Dashboard" /> },
          {
            path: "/admin/utilisateurs",
            element: <PagePlaceholder title="Utilisateurs" />,
          },
          {
            path: "/admin/professionnels",
            element: <PagePlaceholder title="Professionnels" />,
          },
          {
            path: "/admin/professionnels/:id",
            element: <PagePlaceholder title="Dossier du professionnel" />,
          },
          {
            path: "/admin/demandes",
            element: <PagePlaceholder title="Demandes" />,
          },
          {
            path: "/admin/moteur-ia",
            element: <PagePlaceholder title="Moteur IA / Triage" />,
          },
          {
            path: "/admin/parametres",
            element: <PagePlaceholder title="Paramètres" />,
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

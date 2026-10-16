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

export const router = createBrowserRouter([
  { path: "/", element: <RootGate /> },

  // ─── Auth (publiques) ───────────────────────────────────────────
  { path: "/login", element: <LoginPage /> },
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
  {
    path: "/code-oublie",
    element: <PagePlaceholder title="Code secret oublié" />,
  },
  {
    path: "/mot-de-passe-oublie",
    element: <PagePlaceholder title="Mot de passe oublié" />,
  },
  {
    path: "/mot-de-passe/reinitialiser",
    element: <PagePlaceholder title="Nouveau mot de passe" />,
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
            path: "/app/assistant",
            element: <PagePlaceholder title="Soxna Yoon" />,
          },
          {
            path: "/app/demandes/nouvelle",
            element: <DemanderAidePage />,
            handle: { section: "Demandes d'aide", title: "Urgence Juridique" },
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
            element: <PagePlaceholder title="Mon profil" />,
          },
        ],
      },
    ],
  },

  // ─── Professionnel : espace complet (portée COMPLET) ────────────
  {
    element: <ProtectedRoute allowedRoles={["PRO"]} />,
    children: [
      {
        path: "/pro/changer-mot-de-passe",
        element: <PagePlaceholder title="Changer le mot de passe" />,
      },
      {
        element: <AppLayout />,
        children: [
          {
            path: "/pro",
            element: <PagePlaceholder title="Tableau de bord" />,
          },
          {
            path: "/pro/demandes",
            element: <PagePlaceholder title="Demandes" />,
          },
          {
            path: "/pro/demandes/:id",
            element: <PagePlaceholder title="Détail de la demande" />,
          },
          {
            path: "/pro/dossiers",
            element: <PagePlaceholder title="Dossiers" />,
          },
          {
            path: "/pro/dossiers/:id",
            element: <PagePlaceholder title="Détail du dossier" />,
          },
          {
            path: "/pro/clients",
            element: <PagePlaceholder title="Clients" />,
          },
          { path: "/pro/agenda", element: <PagePlaceholder title="Agenda" /> },
          {
            path: "/pro/messages",
            element: <PagePlaceholder title="Messages" />,
          },
          {
            path: "/pro/notifications",
            element: <PagePlaceholder title="Notifications" />,
          },
          {
            path: "/pro/profil",
            element: <PagePlaceholder title="Mon profil" />,
          },
        ],
      },
    ],
  },

  // ─── Professionnel : états intermédiaires (sans sidebar) ────────
  {
    element: <ProtectedRoute allowedRoles={["PRO"]} requiredPortee="DOSSIER" />,
    children: [
      {
        path: "/pro/validation",
        element: <PagePlaceholder title="Validation de votre dossier" />,
      },
    ],
  },
  {
    element: (
      <ProtectedRoute allowedRoles={["PRO"]} requiredPortee="PAIEMENT" />
    ),
    children: [
      {
        path: "/pro/abonnement",
        element: <PagePlaceholder title="Abonnement" />,
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

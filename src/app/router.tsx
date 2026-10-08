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

export const router = createBrowserRouter([
  { path: "/", element: <RootGate /> },
  { path: "/demande", element: <PagePlaceholder title="Demande" /> },
  {
    path: "/demande/vocal",
    element: <PagePlaceholder title="Demande téléphonique" />,
  },
  { path: "/demande/ecrit", element: <PagePlaceholder title="Demande écrite" /> },
  { path: "/demande/ecrit/metier", element: <PagePlaceholder title="Demande écrite" /> },
  { path: "/demande/telephone", element: <PagePlaceholder title="Demande téléphonique" /> },
  {
    path: "/chatbot",
    element: <PagePlaceholder title="Chatbot d'orientation" />,
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterChoicePage /> },
  { path: "/register/particulier", element: <RegisterParticulierPage /> },
  { path: "/register/professionnel", element: <RegisterProfessionnelPage /> },
  { path: "/verification-otp", element: <VerifyOtpPage /> },
  {
    element: <ProtectedRoute allowedRoles={["PARTICULIER"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/app", element: <UserHomePage /> },
          { path: "/app/demandes/nouvelle", element: <PagePlaceholder title="Nouvelle demande" /> },
          { path: "/app/demandes/:id", element: <PagePlaceholder title="Détail de la demande" /> },
          { path: "/app/demandes", element: <PagePlaceholder title="Demandes" /> },
          { path: "/app/notifications", element: <PagePlaceholder title="Notifications" /> },
          { path: "/app/profil", element: <PagePlaceholder title="Profil" /> },
        ],
      },
    ],
  },

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
          { path: "/pro", element: <PagePlaceholder title="Demande téléphonique" /> },
          { path: "/pro/disponibilite", element: <PagePlaceholder title="Demande téléphonique" /> },
          { path: "/pro/messagerie", element: <PagePlaceholder title="Messagerie" /> },
          { path: "/pro/historique", element: <PagePlaceholder title="Historique" /> },
          { path: "/pro/profil", element: <PagePlaceholder title="Profil" /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/admin", element: <PagePlaceholder title="Demande téléphonique" /> },
          {
            path: "/admin/professionnels",
            element: <PagePlaceholder title="Demande téléphonique" />,
          },
          { path: "/admin/utilisateurs", element: <PagePlaceholder title="Utilisateurs" /> },
          { path: "/admin/demandes", element: <PagePlaceholder title="Demandes" /> },
          { path: "/admin/stats", element: <PagePlaceholder title="Statistiques" /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

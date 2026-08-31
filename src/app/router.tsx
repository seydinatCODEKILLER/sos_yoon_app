import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/features/landing";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { AppLayout } from "@/layouts/AppLayout";

import { UserHomePage } from "@/features/demandes/pages/UserHomePage";
import { NewRequestPage } from "@/features/demandes/pages/NewRequestPage";
import { RequestsListPage } from "@/features/demandes/pages/RequestsListPage";
import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
import { UserProfilePage } from "@/features/profil/pages/UserProfilePage";
import { NotFoundPage } from "@/shared/components/NotFoundPage";
import { ForcePasswordChangePage } from "@/features/professionnel/pages/ForcePasswordChangePage";
import { AvailabilityPage } from "@/features/professionnel/pages/AvailabilityPage";
import { MessagingPage } from "@/features/professionnel/pages/MessagingPage";
import { ProHistoryPage } from "@/features/professionnel/pages/ProHistoryPage";
import { ProProfilePage } from "@/features/professionnel/pages/ProProfilePage";
import { ProHomePage } from "@/features/professionnel/pages/ProHomePage";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminProfessionnelsPage } from "@/features/admin/pages/AdminProfessionnelsPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { AdminRequestsPage } from "@/features/admin/pages/AdminRequestsPage";
import { AdminStatsPage } from "@/features/admin/pages/AdminStatsPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <ProtectedRoute allowedRoles={["USER"]} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/app", element: <UserHomePage /> },
          { path: "/app/demandes/nouvelle", element: <NewRequestPage /> },
          { path: "/app/demandes", element: <RequestsListPage /> },
          { path: "/app/notifications", element: <NotificationsPage /> },
          { path: "/app/profil", element: <UserProfilePage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["PROFESSIONNEL"]} />,
    children: [
      {
        path: "/pro/changer-mot-de-passe",
        element: <ForcePasswordChangePage />,
      },
      {
        element: <AppLayout />,
        children: [
          { path: "/pro", element: <ProHomePage /> },
          { path: "/pro/disponibilite", element: <AvailabilityPage /> },
          { path: "/pro/messagerie", element: <MessagingPage /> },
          { path: "/pro/historique", element: <ProHistoryPage /> },
          { path: "/pro/profil", element: <ProProfilePage /> },
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
          { path: "/admin", element: <AdminDashboardPage /> },
          {
            path: "/admin/professionnels",
            element: <AdminProfessionnelsPage />,
          },
          { path: "/admin/utilisateurs", element: <AdminUsersPage /> },
          { path: "/admin/demandes", element: <AdminRequestsPage /> },
          { path: "/admin/stats", element: <AdminStatsPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

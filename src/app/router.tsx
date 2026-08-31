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

  { path: "*", element: <NotFoundPage /> },
]);

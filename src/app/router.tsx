import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/features/landing";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { DashboardPlaceholder } from "@/features/auth/components/DashboardPlaceholder";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/dashboard", element: <DashboardPlaceholder /> }],
  },
]);

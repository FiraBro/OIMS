// app.jsx (simplified - no ThemeProvider needed)
import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./utils/Layout";
import ProtectedRoute from "./components/Auth/ProtectRoutes";
import { PageTransition } from "./components/navigation/Navbar";
import MyPolicies from "./pages/policies/MyPolicies";
import AdminLayout from "./utils/AdminLayout";
import DashboardPage from "./pages/admin/Dashboard";
import Claim from "./pages/admin/Claim";

/* ---------------- Lazy Loaded Pages ---------------- */
const HomePage = lazy(() => import("./pages/home/HomePage"));
const PlanDetail = lazy(() => import("./pages/plan/PlanDetail"));
const ApplyPlan = lazy(() => import("./pages/plan/ApplyPlan"));
const PlansPage = lazy(() => import("./pages/plan/PlanPages"));
const UserApplications = lazy(() => import("./pages/apply/UserApplications"));
const ClaimSubmissionForm = lazy(() =>
  import("./pages/apply/ClaimsManagement")
);
const MyClaims = lazy(() => import("./components/claim/MyClaims"));
const SupportPage = lazy(() => import("./pages/support/SupportPage"));
const AuthPage = lazy(() => import("./pages/auth/AuthPage"));

/* ---------------- Router ---------------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <HomePage />
          </PageTransition>
        ),
      },
      {
        path: "plans/:id",
        element: (
          <PageTransition>
            <PlanDetail />
          </PageTransition>
        ),
      },
      {
        path: "apply/:id",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <ApplyPlan />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "my-applications",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <UserApplications />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "claims/new",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <ClaimSubmissionForm />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "show/claims",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <MyClaims />
            </PageTransition>
          </ProtectedRoute>
        ),
      },
      {
        path: "apply/plans",
        element: (
          <PageTransition>
            <PlansPage />
          </PageTransition>
        ),
      },
      {
        path: "support",
        element: (
          <PageTransition>
            <SupportPage />
          </PageTransition>
        ),
      },
      {
        path: "my-policies",
        element: (
          <ProtectedRoute>
            <PageTransition>
              <MyPolicies />
            </PageTransition>
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "claim",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <Claim />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

/* ---------------- App Root ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </AuthProvider>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      </div>
    </PageTransition>
  );
}
